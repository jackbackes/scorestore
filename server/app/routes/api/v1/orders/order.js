'use strict';
const router = require( 'express' ).Router();
module.exports = router;
const db = require( '../../../../../db' );
const Order = db.model( 'order' );



router.get( '/:orderId', ( req, res, next ) => {
  console.log('getting order id');
  let orderId = req.params.orderId;
  console.log('got order id');
  Order.findById( orderId ).then( order => {
      if ( !order ) throw 'no order';
      console.log('sending response');
      res.status( 200 )
        .send( order )
    } )
    .catch( next )
} )

//consider a put here because the db is mutated -- KHOB
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

router.post( '/', ( req, res, next ) => {
  let order = req.body;
  Order.create( order )
    .then( order => res.status( 201 ).send( order ) )
    .catch( err => next( _error('could not create order', err, 500 ) ) )
} );

//this should only be hit for invalid orders -- KHOB
router.delete( '/:orderId', ( req, res, next ) => {
  console.log( 'deleting' );
  let orderId = req.params.orderId;
  Order.destroy( {
      where: {
        id: orderId
      }
    } )
    .then( ( rows ) => res.status( 204 ).send() )
      .catch( err => next( _error( 'could not delete order', err, 500 ) ) )
} )

router.put('/:orderId', (req, res, next) => {
  let orderId = req.params.orderId, orderData = req.body;
  console.log('updating order',orderId);
  Order.update(orderData, {
    where: {
      id: orderId
    }
  }).then( (updated) => {
    if(!updated) throw _error('could not update order', {orderData}, 500);
    res.status(200).send({updated, orderData});
  }).catch(next);
})

//tracking number

//consider using PUT (if another time you hit this it does not generate a new confirmNum) or *POST* -- KHOB
//have generation linked to when it is transacted; i.e. get rid of route and have it only as a method -- KHOB
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

//main error handling middleware -- KHOB
router.use( function ( error, req, res, next ) {
  console.log('there was an error:', error);
  res.status( error.status || 404 ).send( JSON.stringify(error) );
} );

function _error( message='not found', data={}, status=404 ) {
  return {message, data, status}
}
