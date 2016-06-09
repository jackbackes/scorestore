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
Song.belongsToMany(Order, {through: 'song_order'}); //Seqelize does not support "hasMany" for n:m associations.

console.log('order associations')
Order.hasOne(Address);
Order.belongsTo(User);
Order.belongsToMany(Song, {through: 'song_order'}); //Seqelize does not support "hasMany" for n:m associations.
Review.belongsTo(Song);
Review.belongsTo(User);

console.log('user associations')
User.hasMany(Address);
User.hasMany(Review);
User.hasMany(Order);

console.log('review associations')
Review.belongsTo(Song);
Review.belongsTo(User);
Song.belongsTo(Photo);
User.belongsTo(Photo);


module.exports = db;
