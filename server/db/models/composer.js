'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');
var database = require('./_db');
var Genre = require('./genre')(database);

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
              return Genre.getComposers({
                      where:{
                        id:{
                          $ne: this.id
                        }
                      }
                    });
              }
        },
    });
};