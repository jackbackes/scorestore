'use strict';


var Sequelize = require('sequelize');

module.exports = function (db) {

    db.define('genre', {
        genreName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
};