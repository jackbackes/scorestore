'use strict';

var _ = require('lodash');
var Sequelize = require('sequelize');

module.exports = function (db) {

     return db.define('song', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subtitle: {
          type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        yearComposed: {
            type: Sequelize.INTEGER
        },
        fileName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        inventoryQuantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        imageURL: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: './images/default-image.jpg'
        },
        instrumentTags: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            set: function (tags) {

              tags = tags || [];

              if (typeof tags === 'string') {
                tags = tags.split(',').map(function (str) {
                  return str.trim();
                });
              }

              this.setDataValue('instrumentTags', tags);

            }
        },
        sourceURL: {
            type: Sequelize.STRING
        },
        publicDomainStatus: {
            type: Sequelize.ENUM('public', 'private') //placeholder for license information to include later
        }
    }, {
        instanceMethods: {
            findSimilar: function () {
              return this.Model.findAll({
                where: {
                  id: {
                    $ne: this.id
                  },
                  instrumentTags: {
                    $overlap: this.instrumentTags
                  }
                }
              });
          }
        },
        classMethods: {
            findByTag: function (tag) {
              return this.findAll({
                where: {
                  instrumentTags: {
                    $contains: [tag]
                  }
                }
              });
            }
        },
    });
};
