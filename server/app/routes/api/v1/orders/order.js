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
    .catch( err => next( 'could not create order:' + err ) )
} );

router.delete( '/:orderId', ( req, res, next ) => {
  console.log( 'deleting' );
  let orderId = req.params.orderId;
  Order.destroy( {
      where: {
        id: orderId
      }
    } )
    .then( ( rows ) => res.status( 204 ).send() )
    .catch( err => next( 'could not delete order:' + err ) )
} )

router.use( function ( error, req, res, next ) {
  console.log('there was an error:', error);
  res.status( 404 )
    .end( JSON.stringify(error) );
} );
