'use strict';


var Sequelize = require('sequelize');
var Song;

module.exports = function (db) {
    require('./song')(db);
    Song = db.model('song');
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
              return Song.findAll({
                where: {
                  composerId: this.id
                },
                group: ['genreId']
              })
              .then(function(songs) {
                return Promise.all(songs.map(function(a){
                  return a.genreId;
                }));
              })
              .then(function(genres) {
                return this.Model.findAll({
                  where: {
                    genreId: {
                      $in: genres
                    },
                    composerId: {
                      $ne: this.id
                    }
                  }
                });
              });    
            }
        },
    });
};