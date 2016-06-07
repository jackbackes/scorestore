'use strict';
const db = require('./_db');
const User = require('./models/user')(db);
const Song = require('./models/song')(db);
const Address = require('./models/address')(db);
const Review = require('./models/review')(db);
const Composer = require('./models/composer')(db)
const OrderSong = require('./models/orderSong')(db)



Song.belongsTo(Composer);
Song.belongsTo(Genre);
Order.hasMany(Song, {through: 'song_order'});
Review.belongsTo(Song);

User.hasMany(Address);
User.hasMany(Review);
Review.belongsTo(User);


module.exports = db;


// const models = require('./models')
// const User = models.User;
