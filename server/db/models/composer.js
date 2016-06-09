'use strict';


var Sequelize = require('sequelize');
<<<<<<< HEAD
var database = require('../_db');
var Genre = require('./genre')(database);
=======

>>>>>>> models

module.exports = function(db) {

<<<<<<< HEAD
        return db.define('composer', {
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
                    get: function() {
                        return this.firstName + " " + this.lastName;
                    }
                }
            }, {
                instanceMethods: {
                    findSimilar: function() {
                        return this.Model.findAll({
                            include: [{
                                model: Genre,
                                through: {
                                    where: {
                                        genreId: this.genreId,
                                        composerId: {
                                            $ne: this.id
                                        }
                                    }
                                }
                            }]
                        });
                      }
                    },
                });
        };
=======
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
>>>>>>> models
