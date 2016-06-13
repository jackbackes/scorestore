'use strict';

var Sequelize = require('sequelize');
const randomstring = require('randomstring');

module.exports = function (db) {

    //what if I want to cancel my order? -- KHOB

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
      confirmationNumber: {
        type: Sequelize.STRING,
        unique: true
      },
      total: { //best to store as integer (ideally) b/c JS handles decimals with weird rounding errors -- KHOB
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
