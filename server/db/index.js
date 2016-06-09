'use strict';

var db = require('./_db');
module.exports = db;

require('./models/user')(db);
require('./models/genre')(db);
require('./models/song')(db);
require('./models/composer')(db);
require('./models/address')(db);
require('./models/review')(db);
require('./models/order')(db);
require('./models/orderSong')(db);
require('./models/photo')(db);

var User = db.model('user');
var Genre = db.model('genre');
var Song = db.model('song');
var Composer = db.model('composer');
var Address = db.model('address');
var Review = db.model('review');
var Order = db.model('order');
var Photo = db.model('photo');




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
