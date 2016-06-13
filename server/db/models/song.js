'use strict';


var Sequelize = require('sequelize');
var database = require('../_db');
var Genre = database.model('genre');
var Photo = database.model('photo');

module.exports = function (db) {
  //number validations for price/quantity to be > 0 -- KHOB 
  //url validators in sequelize -- KHOB

  //default scope to have certain fields auto-populated -- KHOB
     db.define('song', {
        title: { //consider unique title -- KHOB
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
              include: [Photo],
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
                  $contains: [tag] //might need to drop array brackets -- KHOB
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
        }
    });
};
