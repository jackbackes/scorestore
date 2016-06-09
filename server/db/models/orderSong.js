'use strict';


var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('song_order', {
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    });
  };
