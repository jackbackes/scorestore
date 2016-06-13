'use strict';
var router = require('express').Router({mergeParams: true});
const db = require( '../../../../../db' );
const Order = db.model( 'order' );
const User = db.model('user');

module.exports = router;

router.post( '/', ( req, res, next ) => {
  console.log(req.body);
  let order = req.body;
  let userId = req.params.userId;
  User.findById( userId ).then( user => {
    if(!user) throw 'no user'; //error utility -- KHOB
    user.createOrder( order ) //if you return this you are thenable -- KHOB
    .then( order => res.status( 201 ).send( order ) )
    .catch( err => next( 'could not create order:' + err ) )

  } )
} );
