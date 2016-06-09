'use strict';

var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('photo', {
      isLocal: {
        type: Sequelize.BOOLEAN,
      },
      localFileName: {
        type: Sequelize.STRING,
      },
      externalUrl: {
        type: Sequelize.STRING,
      },
    });
  };