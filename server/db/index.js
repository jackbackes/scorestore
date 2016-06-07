'use strict';

var db = require('./_db');
var User = require('./models/user')(db);
var Song = require('./models/song')(db);
var Composer = require('./models/composer')(db);
var Genre = require('./models/genre')(db);
var Address = require('./models/address')(db);
var Review = require('./models/review')(db);
var Order = require('./models/order')(db);
var OrderSong = require('./models/orderSong')(db);
var Photo = require('./models/photo')(db);


Song.belongsTo(Composer);
Song.belongsTo(Genre);
Song.belongsToMany(Order, {through: 'song_order'});
Order.belongsToMany(Song, {through: 'song_order'});

Review.belongsTo(Song);
Review.belongsTo(User);

User.hasMany(Address);
User.hasMany(Review);

Song.belongsTo(Photo);
User.belongsTo(Photo);

module.exports = db;

