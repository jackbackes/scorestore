'use strict';
var router = require('express').Router();
module.exports = router;
var db = require('../../db');
var Song = db.model('song');
var Composer = db.model('composer');
var Genre = db.model('genre');
var Photo = db.model('photo');

router.use('/members', require('./members'));

// Make sure this is after all of
// the registered routes!
router.get('/v1/song/:songId', function(req, res, next){
	Song.findById(req.params.songId, {include: [Composer, Genre, Photo]})
	.then(function(song){
		res.send(song);
	})
	.catch(next)
})

router.get('/v1/song/:songId/similarInstruments', function(req, res, next){
	Song.findById(req.params.songId)
	.then(function(song){
		return song.findSimilarByInstruments()
	})
	.then(function(similarSongs){
		res.send(similarSongs)
	})
	.catch(next)
})

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

router.use(function (req, res) {
    res.status(404).end();
});
