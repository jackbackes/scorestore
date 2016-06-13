'use strict';
const router = require('express').Router();
const path = require('path');
const db = require(path.join(__dirname, '../../../db'));
const User = db.model('user');
module.exports = router;

router.post('', function (req, res, next) {
  req.body.isGuest = false;
  req.body.isAdmin = false;
  return User.create(req.body)
  .then(function (user) {
    res.send(user);
  });
});