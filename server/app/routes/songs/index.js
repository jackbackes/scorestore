'use strict';

const path = require('path');
const router = require('express').Router();
const db = require(path.join(__dirname, '../../../db'));
const Song = db.model('song');
const Composer = db.model('composer');
const Genre = db.model('genre');
const Photo = db.model('photo');

//be consistent with '' and '/' -- KHOB
router.get('', function (req, res, next){
  return Song.findAll({ //return is not necessary -- KHOB
    include: [Composer, Genre, Photo],
    where: req.query
  })
  .then(function (songs) {
    res.send(songs);
  })
  .catch(next);
});

router.param('id', function (req, res, next, id) {
  return Song.findById(id, {include: [Composer, Genre, Photo]})
  .then(function (song) {
    req.song = song;
    next();
  })
  .catch(next);
});

router.post('/', function (req, res, next) {
  if (req.user) {
    if (req.user.isAdmin) {
      Song.create(req.body)
      .then(function () {
        res.sendStatus(201); //might want to send result of creation (id) -- KHOB
      })
      .catch(next);
    } else {
      res.sendStatus(403); //uniform error handling -- KHOB
    }
   } else {
    res.sendStatus(401);
  }
});

router.get('/:id', function (req, res, next) {
  res.send(req.song);
});

router.delete('/:id', function (req, res, next) {
  if (req.user) {
    if (req.user.isAdmin) { //auth middleware or authentication -- KHOB
      req.song.destroy()
      .then(function () {
        res.sendStatus(204);
      })
      .catch(next);
    } else {
      res.sendStatus(403);
    }
   } else {
    res.sendStatus(401);
  }
});

router.put('/:id', function (req, res, next) {
  if (req.user) {
    if (req.user.isAdmin) {
      req.song.update(req.body)
      .then(function () {
        res.sendStatus(200);
      })
      .catch(next);
    } else {
      res.sendStatus(403);
    }
   } else {
    res.sendStatus(401);
  }
});

router.get('/:id/similarInstruments', function(req, res, next){
  req.song.findSimilarByInstruments()
  .then(function(similarSongs){
    res.send(similarSongs)
  })
  .catch(next);
})

module.exports = router;
