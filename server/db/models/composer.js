'use strict';


var Sequelize = require('sequelize');
// var Genre = require('./genre')(database);

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
            findSimilar: function () {
              return this.Model.findAll({
                include: [{
                  model: db.model('genre'),
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
        },
    }
  });
};
