'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('review', {
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false, //notnull has been deprecated.
        validate: {
          min: 0,
          max: 5,
        }
      },
      description: {
        type: Sequelize.TEXT,
        validate: {
          len: [5]
        }
      }
    })
  }
