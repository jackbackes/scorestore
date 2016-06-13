'use strict';


var Sequelize = require('sequelize');

module.exports = function (db) {
	//might want a price field, so that the price is fixed on the order in case you change the price for the product (song) -- KHOB
    return db.define('song_order', {
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    });
  };
