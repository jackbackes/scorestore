'use strict';

var db = require('./_db');
module.exports = db;

require('./models/user')(db);
require('./models/song')(db);
require('./models/composer')(db);
require('./models/genre')(db);
require('./models/address')(db);
require('./models/review')(db);
require('./models/order')(db);
require('./models/orderSong')(db);
require('./models/photo')(db);

var User = db.model('user');
var Song = db.model('song');
var Composer = db.model('composer');
var Genre = db.model('genre');
var Address = db.model('address');
var Review = db.model('review');
var Order = db.model('order');
var Photo = db.model('photo');

User.hasMany(Address);
User.hasMany(Review);


Song.belongsTo(Composer);
Song.belongsTo(Genre);
Song.belongsToMany(Order, {through: 'song_order'});
Order.belongsToMany(Song, {through: 'song_order'});

Review.belongsTo(Song);
Review.belongsTo(User);


Song.belongsTo(Photo);
User.belongsTo(Photo);

Order.belongsTo(Address); // are we connecting the address to the order, user or both?



