'use strict';
var router = require('express').Router();
module.exports = router;
var db = require('../../db');
var Composer = db.model('composer');


//throw all of these in v1 folder and add to index there -- KHOB

router.use('/members', require('./members'));

router.use('/v1/songs', require('./songs'));

router.use('/v1/users', require('./users'));

router.use('/v1/cart', require('./cart'));

router.use('/v1/guest', require('./guest'));

router.use('/v1/order', require('./order'));

// Make sure this is after all of
// the registered routes!

//find me a home -- KHOB
router.get('/v1/composer/:composerId/similarComposers', function(req, res, next){
	Composer.findById(req.params.composerId)
	.then(function(composer){
		return composer.findSimilarSongs()
	})
	.then(function(similarComposersSongs){
		res.send(similarComposersSongs)
	})
	.catch(next)
})

router.use('/v1', require('./api/v1'));

router.use(function (req, res) {
    res.status(404).end();
});
