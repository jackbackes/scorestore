'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user')(db);
var Address = require('./models/address')(db);
var Review = require('./models/review')(db);

User.hasMany(Address);
User.hasMany(Review);
Review.belongsTo(User);
