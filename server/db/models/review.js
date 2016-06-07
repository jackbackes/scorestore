'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('review', {
      rating: {
        type: Sequelize.INTEGER,
        validate: {
          min: 0,
          max: 5,
          notNull: true
        }
      },
      description: {
        type: Sequelize.TEXT
      }
    })
  }
