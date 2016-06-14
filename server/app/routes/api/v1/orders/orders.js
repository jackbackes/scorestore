'use strict';
var router = require('express').Router();
module.exports = router;
const db = require( '../../../../../db' );
const Order = db.model( 'order' );
const Auth = require('../../../../configure/auth-middleware.js');

function getOrders(where){
  let options = where ? {where} : {};
  return Order.findAll(options)
}

router.get('/', Auth.assertAdmin, (req, res, next)=>{
  let where = req.query || undefined;
  getOrders(where).then( orders => res.status(200).send(orders) )
             .catch(next)
})
