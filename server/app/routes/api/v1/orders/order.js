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

router.get( '/:orderId', ( req, res, next ) => {
  let orderId = req.params.orderId;
  Order.findOne( {
    include: [Song, Address, User],
    where: {
      id: orderId
    }
  })
  .then( order => {
      res.status( 200 ).send( order )
  })
  .catch(next);
});

router.get( '/:orderId/restore', (req, res, next ) => {
  let orderId = req.params.orderId;
  Order.restore({
    where: {
      id: orderId
    }
  }).then( result => {
    res.status(201).send(result)
  }).catch(next)
})

// router.post( '/', ( req, res, next ) => {
//   let order = req.body;
//   Order.create( order )
//     .then( order => res.status( 201 ).send( order ) )
//     .catch( err => next( _error('could not create order', err, 500 ) ) )
// } );


router.post('/', function (req, res, next) {
  let user = req.user || req.session.guest;
  let stripeToken = req.body.response.id;
  let total = req.body.total * 100
  
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
        })
      })
      .then(function(order) {
        return Promise.map(req.session.cart, function(item) {
          Song.findById(item.song.id)
          .then(function(song) {
            order.addSong(song, {quantity: item.quantity, price: song.price})  
          });
        })
      })
      .then(function() {
        // delete req.session.cart;
        // delete req.session.shippingAddress;
        res.sendStatus(200);
      })
      .catch(next)    
    }
  })
   
});

router.delete( '/:orderId', ( req, res, next ) => {
  console.log( 'deleting' );
  let orderId = req.params.orderId;
  Order.destroy( {
      where: {
        id: orderId
      }
    } )
    .then( ( rows ) => {
      res.status( 204 ).send() 
    })
      .catch( err => next( _error( 'could not delete order', err, 500 ) ) )
} )

router.put('/:orderId/shipped', (req, res, next) => {
  Order.update( {
      status: 'Processing',
      shipped: true
    },
    { where:
       {
        id: req.params.orderId
       }
  })
  .then( (updated) => {
    if(!updated) throw _error('could not update order', 500);
    res.status(200).send('Processing');
  }).catch(next);
});

router.put('/:orderId/delivered', (req, res, next) => {
  Order.update( {
      status: 'Completed',
    },
    { where:
       {
        id: req.params.orderId
       }
  })
  .then( (updated) => {
    if(!updated) throw _error('could not update order', 500);
    res.status(200).send('Completed');
  }).catch(next);
});

router.put('/:orderId/address', (req, res, next) => {
  let newAddress = req.body;
  Order.findById(req.params.orderId)
  .then(function (order) {
    return Address.update(newAddress, {
      where: {
        id: order.addressId
      }
    })
  })
  .then( (updated) => {
    if(!updated) throw _error('could not update order', newAddress, 500);
    res.status(200).send({updated, newAddress});
  }).catch(next);
})

router.get('/:orderId/address', (req, res, next) => {
  Order.findById(req.params.orderId)
  .then(function (order) {
    res.send(order.getAddress());
  })
  .catch(next);
})

//tracking number

router.get('/:orderId/confirmation-number', (req, res, next) => {
  let orderId = req.params.orderId;
  Order.findById(orderId).then( order => {
    if(!order) throw _error('no order', {orderId});
    let confNumber = order.generateConfirmationNumber();
    res.status(201).send({orderId, confNumber});
  }).catch(next);
})

router.get('/confirmation-number/:confNumber', (req, res, next) => {
  Order.findOne({
    where: {
      confirmationNumber: req.params.confNumber
    }
  }).then( order => {
    if(!order) throw _error('no order for confirmation number', {confNumber: req.params.confNumber}, 404)
    res.status(200).send(order)
  }).catch(next)
})


router.use( function ( error, req, res, next ) {
  console.log('there was an error:', error);
  res.status( error.status || 404 ).send( JSON.stringify(error) );
} );

function _error( message='not found', data={}, status=404 ) {
  return {message, data, status}
}
