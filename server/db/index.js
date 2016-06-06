'use strict';
var db = require('./_db');
var User = require('./models/user')(db);
var Song = require('./models/song')(db);
// var Composer = require('./models/composer')(db)


// Song.belongsTo(Composer);
// Song.belongsTo(Genre);
// Song.belongsToMany(Order, {through: 'song_order'});
// Review.belongsTo(Song);


module.exports = db;

