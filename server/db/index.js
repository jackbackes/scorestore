'use strict';

var db = require('./_db');
module.exports = db;

require('./models/user')(db);
require('./models/genre')(db);
require('./models/photo')(db);
require('./models/song')(db);
require('./models/composer')(db);
require('./models/address')(db);
require('./models/review')(db);
require('./models/order')(db);
require('./models/orderSong')(db);

var User = db.model('user');
var Genre = db.model('genre');
var Photo = db.model('photo');
var Song = db.model('song');
var Composer = db.model('composer');
var Address = db.model('address');
var Review = db.model('review');
var Order = db.model('order');

//make a class method that accepts db as an argument and makes associations; so just call associate one time each on every model -- KHOB

Song.belongsTo(Composer);
Song.belongsTo(Genre);
Song.belongsToMany(Order, {through: 'song_order'}); //Seqelize does not support "hasMany" for n:m associations.

Order.belongsTo(Address); //put the addressId on the order table
Order.belongsTo(User);
Order.belongsToMany(Song, {through: 'song_order'}); //Seqelize does not support "hasMany" for n:m associations.
Review.belongsTo(Song);
Review.belongsTo(User);

User.belongsTo(Address);  //put the addressId on the user table
User.hasMany(Review);
User.hasMany(Order);

//dupes -- KHOB
Review.belongsTo(Song);
Review.belongsTo(User);

Song.belongsTo(Photo);
User.belongsTo(Photo); //maybe as avatar? -- KHOB

module.exports = db;
