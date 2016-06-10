'use strict';

const path = require('path');
const router = require('express').Router();
const db = require(path.join(__dirname, '../../../db'));

router.get('/', function (req, res, next){
  if (req.session.cart) res.send(req.session.cart);
  else res.send();  
});

router.post('/', function (req, res, next) {
  if (req.session.cart) req.session.cart.push({song: req.body.song, quantity: req.body.quantity});
  else req.session.cart = [{song: req.body.song, quantity: req.body.quantity}];
  res.send(req.session.cart);
});

router.delete('/:songId', function (req, res, next) {

  req.session.cart = req.session.cart.filter(item =>  { 
    return item.song.id !== +req.params.songId; 
  });
  res.send(req.session.cart);
});

module.exports = router;