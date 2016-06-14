'use strict';

const path = require('path');
const router = require('express').Router();
module.exports = router;
const db = require(path.join(__dirname, '../../../../../db'));
const Song = db.model('song');
const Order = db.model('order');
const Address = db.model('address');
const User = db.model('user');
const stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
const Promise = require('sequelize').Promise;
const Auth = require('../../../../configure/auth-middleware.js');



router.get( '/:orderId', Auth.assertAdminOrSelf, ( req, res, next ) => {

  let orderId = req.params.orderId;
  Order.findOne( {
    include: [Song, Address, User],
    where: {
      id: orderId
    }
  })
  .then( order => {
      res.status( 200 ).send( order );
  })
  .catch(next);
});

router.get( '/:orderId/restore', Auth.assertAdmin, (req, res, next ) => {
  let orderId = req.params.orderId;
  Order.restore({
    where: {
      id: orderId
    }
  }).then( result => {
    res.status(201).send(result);
  }).catch(next);
});

// make this an instance method??
router.post('/', function (req, res, next) {
  let user = req.user || req.session.guest;
  let stripeToken = req.body.response.id;
  let total = req.body.total * 100;
  
  stripe.charges.create({
    amount: total,
    currency: 'usd',
    source: stripeToken,
    description: "Example Order"
  }, function (err, charge) {
    if (err) {
      res.status(403).send(err.type);
    }
    else { 
      Address.findOrCreate({where: req.session.shippingAddress})
      .spread(function(address, createdAddress) {
        return Order.create({
          transactionSuccessful: true,
          total: req.body.total,
          addressId: address.id,
          userId: user.id
        });
      })
      .then(function(order) {
        return order.generateConfirmationNumber()
        .then(function () {
          return order;
        });
      })
      .then(function (order) {
        res.order = order;
        return Promise.map(req.session.cart, function(item) {
          return Song.findById(item.song.id)
          .then(function(song) {
            return order.addSong(song, {quantity: item.quantity, price: song.price});  
          });
        });
      })
      .then(function() {
        // delete req.session.cart;
        // delete req.session.shippingAddress;
        res.status(200).send(res.order);
      })
      .catch(next);    
    }
  });
   
});

router.delete( '/:orderId', Auth.assertAdmin, ( req, res, next ) => {
  let orderId = req.params.orderId;
  Order.destroy( {
      where: {
        id: orderId
      }
    } )
    .then( ( rows ) => {
      res.status( 204 ).send();
    })
      .catch( err => next( _error( 'could not delete order', err, 500 ) ) );
} );

router.put('/:orderId/status', Auth.assertAdmin, (req, res, next) => {
   let status = req.body.status; //'Processing' === shipped ; "Completed" === delivered
   Order.update( req.body,
    { where:
       {
        id: req.params.orderId
       }
  })
  .then( (updated) => {
    if(!updated) throw _error('could not update order', 500);
    res.status(200).send(status);
  }).catch(next);
});

//Save for implementation if Admin can update order address
// router.put('/:orderId/address',  (req, res, next) => {
//   let newAddress = req.body;
//   Order.findById(req.params.orderId)
//   .then(function (order) {
//     return Address.update(newAddress, {
//       where: {
//         id: order.addressId
//       }
//     });
//   })
//   .then((updated) => {
//     if(!updated) throw _error('could not update order', newAddress, 500);
//     res.status(200).send({updated, newAddress});
//   }).catch(next);
// });

// router.get('/:orderId/address', (req, res, next) => {
//   Order.findById(req.params.orderId)
//   .then(function (order) {
//     res.send(order.getAddress());
//   })
//   .catch(next);
// });

//tracking number
// post route
// take various parts of unique information and hash same information together to generate confirmation number
// just call when charging after transaction successful
router.get('/:orderId/confirmation-number', (req, res, next) => {
  let orderId = req.params.orderId;
  Order.findById(orderId).then( order => {
    if(!order) throw _error('no order', {orderId});
    let confNumber = order.confirmationNumber;
    res.status(201).send({orderId, confNumber});
  }).catch(next);
});

router.get('/confirmation-number/:confNumber', (req, res, next) => {
  Order.findOne({
    where: {
      confirmationNumber: req.params.confNumber
    }
  }).then( order => {
    if(!order) throw _error('no order for confirmation number', {confNumber: req.params.confNumber}, 404);
    res.status(200).send(order);
  }).catch(next);
});


router.use( function ( error, req, res, next ) {
  console.log('there was an error:', error);
  res.status( error.status || 404 ).send( JSON.stringify(error) );
} );

function _error( message='not found', data={}, status=404 ) {
  return {message, data, status};
}
