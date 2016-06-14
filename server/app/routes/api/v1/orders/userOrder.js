'use strict';
var router = require('express').Router({mergeParams: true});
const db = require( '../../../../../db' );
const Order = db.model( 'order' );
const User = db.model('user');

module.exports = router;

router.post( '/', ( req, res, next ) => {
  let order = req.body;
  let userId = req.params.userId;
  User.findById( userId ).then( user => {
    if(!user) throw 'no user';
    user.createOrder( order )
    .then( order => res.status( 201 ).send( order ) )
    .catch( err => next( 'could not create order:' + err ) );

  } );
} );
