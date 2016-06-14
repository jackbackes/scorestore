'use strict';

const path = require('path');
const router = require('express').Router();
const db = require(path.join(__dirname, '../../../db'));
const Review = db.model('review');
const Song = db.model('song');
const User = db.model('user');

router.get('/', function (req, res, next){
  	Review.findAll()
  	.then(function(reviews){
  		res.send(reviews);
  	})
});

router.post('/', function (req, res, next){
	let stars = req.body.rating
	let writtenR = req.body.description
	Review.create({
		rating: stars,
		description: writtenR,
		songId: req.body.songId,
		userId: req.body.userId
	})
	.then(function(theReview){
		res.send(theReview);
	})
});

router.get('/userReviews/:userId', function (req, res, next){
  	Review.findAll({
  		include: [Song],
  		where:{
  			userId: req.params.userId
  		}
  	})
  	.then(function(reviews){
  		res.send(reviews);
  	})
});

router.get('/songReviews/:songId', function (req, res, next){
  	Review.findAll({
  		include: [User],
  		where:{
  			songId: req.params.songId
  		}
  	})
  	.then(function(reviews){
  		res.send(reviews);
  	})
});

module.exports = router;