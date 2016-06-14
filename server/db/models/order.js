'use strict';

var Sequelize = require('sequelize');
const randomstring = require('randomstring');

module.exports = function (db) {

    return db.define('order', {
      status: {
        type:Sequelize.ENUM('Created', 'Processing', "Completed", "Cancelled"),
        defaultValue: 'Created'
      },
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
      confirmationNumber: {
        type: Sequelize.STRING,
        unique: true
      },
      total: {
        type: Sequelize.DECIMAL
      }
    }, {
      paranoid: true,
      instanceMethods: {
        generateConfirmationNumber: function(){
          let thisOrder = this;
          let confNumber = randomstring.generate({
            length: 10,
            capitalization: 'uppercase'
          });
          // console.log(thisOrder);
          this.setDataValue('confirmationNumber', confNumber);
          this.save();
          return confNumber;
        }
      }
    });
  };
