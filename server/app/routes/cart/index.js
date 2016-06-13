'use strict';

const path = require('path');
const router = require('express').Router();
const db = require(path.join(__dirname, '../../../db'));

router.get('/', function (req, res, next){
  // send the cart on the session if it exists
  if (req.session.cart) res.send(req.session.cart);
  else res.send();  
});

router.post('/songs', function (req, res, next) {
  // if there is a cart, iterate through cart to see if the song is already in there, and
  //  if so, update cart with new quantity; otherwise add the song and quantity to the cart 
  // if there is no cart, then create the cart
  if (req.session.cart) {
  	var inCart = false;
  	req.session.cart = req.session.cart.map(function(elem){
  		if(elem.song.id === req.body.song.id){
  			inCart = true;
  			elem.quantity += req.body.quantity;
  			return elem;
  		} else {
  			return elem;
  		}
  	})
  	if(inCart === false) req.session.cart.push({song: req.body.song, quantity: req.body.quantity});
  } else {
  	req.session.cart = [{song: req.body.song, quantity: req.body.quantity}];
  }
  res.send(req.session.cart);
});

router.put('/songs/:songId', function(req, res, next){
  // to update the quantity of the songs, iterate through cart and replace the quantity with the new requested quantity
	req.session.cart = req.session.cart.map(function(elem){
  		if(elem.song.id === req.body.song.id){
  			elem.quantity = req.body.quantity;
  			return elem;
  		} else {
  			return elem;
  		}
  	})
  	res.send(req.session.cart);

})

router.delete('/songs/:songId', function (req, res, next) {

  req.session.cart = req.session.cart.filter(item =>  { 
    return item.song.id !== +req.params.songId; 
  });
  res.send(req.session.cart);
});


router.post('/address', function (req, res, next) {
  // add the shipping address on the req.session
  if (req.session.cart) {
    req.session.shippingAddress = req.body;
    res.sendStatus(201);
  }
  else {
    res.sendStatus(403);
  }
})

router.get('/address', function (req, res, next) {
  if (req.session.shippingAddress) {
    res.send(req.session.shippingAddress);
  }
  else {
    res.sendStatus(403);
  }
})

module.exports = router;