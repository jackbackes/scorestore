'use strict';


var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('song_order', {
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    });
  };
