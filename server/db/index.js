'use strict';
var db = require('./_db');
var User = require('./models/user')(db);
var Song = require('./models/song')(db);
var Composer = require('./models/composer')(db);
var Genre = require('./models/genre')(db);
var Address = require('./models/address')(db);
var Review = require('./models/review')(db);


Song.belongsTo(Composer);
Song.belongsTo(Genre);
Song.belongsToMany(Order, {through: 'song_order'});

Composer.belongsToMany(Genre, {through: 'composer_genre'});

Review.belongsTo(Song);
Review.belongsTo(User);

User.hasMany(Address);
User.hasMany(Review);


module.exports = db;
