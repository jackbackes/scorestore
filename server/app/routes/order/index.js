'use strict';

const path = require('path');
const router = require('express').Router();
const db = require(path.join(__dirname, '../../../db'));
const Song = db.model('song');
const Order = db.model('order');
const Address = db.model('address');
const stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");
const Promise = require('sequelize').Promise;

router.get('/', function (req, res, next){
  
   //is something supposed to happen here? If not why do I exist? -KHOB
});

router.post('/', function (req, res, next) {
	let user = req.user || req.session.guest;
	let stripeToken = req.body.response.id;
	let total = req.body.total * 100
	
	//potentially order could have a charge/checkout method -- KHOB
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
					//missing return on 44 (song) and 46 (order) -- KHOB
					Song.findById(item.song.id)
					.then(function(song) {
						order.addSong(song, {quantity: item.quantity})	
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


module.exports = router;