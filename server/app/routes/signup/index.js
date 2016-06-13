'use strict';
const router = require('express').Router();
const path = require('path');
const db = require(path.join(__dirname, '../../../db'));
const User = db.model('user');
const Address = db.model('address');
module.exports = router;

router.post('', function (req, res, next) {
  req.body.user.isGuest = false;
  req.body.user.isAdmin = false;
  if (req.body.address) {
    req.body.address.firstName = req.body.user.firstName;
    req.body.address.lastName = req.body.user.lastName;
    return Address.create(req.body.address)
    .then(function (address) {
      User.create(req.body.user)
      .then(function (user) {
        return user.setAddress(address);
      })
      .then(function () {
        res.sendStatus(201);
      });
    });
  } else {
    return User.create(req.body.user)
    .then(function (user) {
      res.status(204).send(user);
    });
  }
});