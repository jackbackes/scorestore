'use strict';

var Sequelize = require('sequelize');

module.exports = function (db) {
    //s3 for all to be external; either way one url for external or internal -- KHOB
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