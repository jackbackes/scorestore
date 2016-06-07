'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {

    return db.define('order', {
      shipped: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      deliveredAt: {
        type: Sequelize.DATE
      },
      billingHistory: {
        type: Sequelize.ARRAY(Sequelize.JSONB)
      },
      transactionSuccessful: {
        type: Sequelize.BOOLEAN
      },
      total: {
        type: Sequelize.DECIMAL
      }
    })
  }
