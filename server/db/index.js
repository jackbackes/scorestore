'use strict';
const db = require('./_db');
const User = require('./models/user')(db);
const Song = require('./models/song')(db);
const Address = require('./models/address')(db);
const Review = require('./models/review')(db);
const Composer = require('./models/composer')(db)
const Order = require('./models/order')(db)
const OrderSong = require('./models/orderSong')(db)
const Genre = require('./models/genre')(db)

console.log('song associations')
Song.belongsTo(Composer);
Song.belongsTo(Genre);
Song.belongsToMany(Order, {through: 'song_order'}); //Seqelize does not support "hasMany" for n:m associations.

console.log('order associations')
Order.hasOne(Address);
Order.belongsTo(User);
Order.belongsToMany(Song, {through: 'song_order'}); //Seqelize does not support "hasMany" for n:m associations.


console.log('user associations')
User.hasMany(Address);
User.hasMany(Review);
User.hasMany(Order);

console.log('review associations')
Review.belongsTo(Song);
Review.belongsTo(User);


module.exports = db;
