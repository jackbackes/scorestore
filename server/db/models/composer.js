'use strict';


var Sequelize = require('sequelize');


module.exports = function (db) {

    db.define('composer', { 
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fullName: {
            type: Sequelize.VIRTUAL,
            get: function () {
              return this.firstName + " " + this.lastName;
            }
        }
    }, {
        instanceMethods: {
            // revise to reflect no composer-genre through table
            findSimilar: function () {
              // return this.Model.findAll({
              //   include: [{
              //     model: Genre,
              //     through: {
              //       where: {
              //         genreId: this.genreId,
              //         composerId: {
              //           $ne: this.id
              //         }
              //       }
              //     }
              //   }]
            // });
        },
    }
  });
};