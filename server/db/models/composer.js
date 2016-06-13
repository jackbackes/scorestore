'use strict';


var Sequelize = require('sequelize');
var database = require('../_db');
var Song = database.model('song'); //consider in instance method itself -- KHOB
var Photo = database.model('photo');

module.exports = function (db) {
    db.define('composer', {
    //don't forget that an empty string won't be caught by allowNull; look into notEmpty -- KHOB 
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
          //findSimilar is using a lot of 'findSimilarSong' functionality; call findSimilarSong in here -- KHOB
            findSimilar: function () {
              var that = this;
              return Song.findAll({
                where: {
                  composerId: this.id
                }
              })
              .then(function(songs) {
                return Promise.all(songs.map(function(a){
                  return a.genreId;
                }));
              })
              .then(function(genres) {
                return Song.findAll({
                  where: {
                    genreId: {
                      $in: genres
                    },
                    composerId: {
                      $ne: that.id
                    }
                  }
                });
              })
              .then(function (songs) {
                return Promise.all(songs.map(function(a){
                  return a.composerId;
                }));
              })
              .then(function(composers) {
                return that.Model.findAll({
                  where: {
                    id: {
                      $in: composers
                    }
                  }
                });
              });    
            },
          findSimilarSongs: function () {
                var that = this;
                return Song.findAll({
                  where: {
                    composerId: this.id
                  }
                })
                .then(function(songs) {
                  return Promise.all(songs.map(function(a){
                    return a.genreId;
                  }));
                })
                .then(function(genres) {
                  return Song.findAll({
                    include: [Photo],
                    where: {
                      genreId: {
                        $in: genres
                      },
                      composerId: {
                        $ne: that.id
                      }
                    }
                  });
                })
            }
            
        },
  });
};
