'use strict';


var Sequelize = require('sequelize');

module.exports = function (db) {

     db.define('song', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
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
          findSimilarByInstruments: function () {
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
          },
          findSimilarByGenre: function () {
            return this.Model.findAll({
              where: {
                id: {
                  $ne: this.id
                },
                genreId: this.genreId
              }
            });
          }
        },
        classMethods: {
          findByInstrumentTag: function (tag) {
            return this.findAll({
              where: {
                instrumentTags: {
                  $contains: [tag]
                }
              }
            });
          },
          findByGenre: function (genre) {
            return this.findAll({
              include: [Genre],
              where: {
                genreName: genre
              }
            });
          }
        },
    });
};