'use strict';
var router = require('express').Router();
module.exports = router;


router.use('/order', require('./orders/order'));
router.use('/orders', require('./orders/orders'));
router.use('/user/:userId/order', require('./orders/userOrder'));

//are you using this or the order immediately inside of 'api' -- KHOB
