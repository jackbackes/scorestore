'use strict';

const path = require('path');
const router = require('express').Router();
const db = require(path.join(__dirname, '../../../db'));
const User = db.model('user');


router.post('/', function (req, res, next) {
    User.findOrCreate({where:
      {
        email: req.body.email,
        isGuest: true
      }
    })
    .spread(function(user, createdUser) {
      req.session.guest = user;
      res.send({user: user, id: req.sessionID});
    })
    .catch(next);
});

module.exports = router;