'use strict';


var Sequelize = require('sequelize');
var database = require('../_db');
var Song = database.model('song');


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
            }
        },
  });
};

