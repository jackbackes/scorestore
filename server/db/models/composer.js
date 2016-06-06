'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');
var Genre = require('./genre');

module.exports = function (db) {

    db.define('composer', {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        instanceMethods: {
            findSimilar: function () {
              return this.Model.findAll({
                where: {
                  id: {
                    $ne: this.id
                  },
                  tags: {
                    $overlap: this.instrumentTags
                  }
                }
              });
          }
        },
    });
};