'use strict';
var router = require('express').Router();
module.exports = router;
const db = require( '../../../../../db' );
const Order = db.model( 'order' );
const Song = db.model('song');
const Address = db.model('address');
const User = db.model('user');

function getOrders(where){
  let options = where ? {where} : {};
  return Order.findAll(options)
}

router.get('/', (req, res, next)=>{
  let where = req.query || undefined;
  getOrders(where).then( orders => res.status(200).send(orders) )
             .catch(next)
})

router.get('/userOrders/:id', function(req, res, next){
	Order.findAll({
		include: [Song, Address, User],
		where: {
			userId: req.params.id
		}
	})
	.then(function(orders){
		res.send(orders);
	})
})