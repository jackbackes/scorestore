'use strict';

const path = require('path');
const router = require('express').Router();
const db = require(path.join(__dirname, '../../../db'));
const Song = db.model('song');

router.get('/', function (req, res, next){
  
});

router.post('/', function (req, res, next){

});
