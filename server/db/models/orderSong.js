'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('song_order', {
      quantity: {
        type: Sequelize.INTEGER
      }
    })
  }
