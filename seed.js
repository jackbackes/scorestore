/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

/**
 * Seed File for production.
 */

'use strict'

const chalk = require('chalk');
const db = require('./server/db');
const User = db.model('user');
const Order = db.model('order');
const Review = db.model('review');
const Song = db.model('song');
const Composer = db.model('composer');
const Genre = db.model('genre');
const SongOrder = db.model('song_order');
const Photo = db.model('photo')
// const Promise = require('sequelize').Promise;
const Promise = require('bluebird');

const seedInfo = require('./ScoreSheetInfo');

var seedUsers = function () {

    var users = [
        {
            firstName: 'Omri',
            lastName: 'Bernstein',
            isGuest: false,
            email: 'testing@fsa.com',
            password: 'password',
            twitter_id: "123",
            facebook_id: "123",
            google_id: "123",
            isAdmin: false
        },
        {
            firstName: 'Barack',
            lastName: 'Obama',
            isGuest: false,
            email: 'obama@gmail.com',
            password: 'potus',
            isAdmin: 'true',
            twitter_id: "123",
            facebook_id: "123",
            google_id: "123",
            isAdmin: true
        },{
            email: "guest@mcguesterson.com",
            isGuest: true
        }

    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

let seedSongs = function(){
  return seedInfo.songs.map(function (songObj) {
      return Song.create(songObj);
  });

};

let seedComposers = function(){
  //populate this object with composer data. set an object title so that it can be used in the "setComposer" command below.

  return seedInfo.composers.map(function (composerObj) {
      return Composer.create(composerObj);
  });
}

let seedOrders = function(/*resolvedSeedUsers, resolvedSeedSongs*/){
  return [
    {
      songs: [
        { songId: 1, quantity: 10 },
        { songId: 2, quantity: 1 },
        { songId: 3, quantity: 4 }
      ],
      orderInfo: {
        userId: 1,
        shipped: true,
        deliveredAt: Date.now(),
        transactionSuccessful: true,
        total: 22.22,
      },
      shippingAddress: {
        firstName: "Jimmy",
        lastName: "Neutron",
        address: "123 Mars Avenue",
        city: "MoonBase",
        state: "TX",
        zipCode: 75252
      }
    }]
};

// let seedReviews = function(resolvedSeedUsers){
//   let reviews = [
//     { userId: 1, songId: 1, rating: 5, description: "I loved it!"},
//     { userId: 2, songId: 2, rating: 0, description: "I hated it!"},
//     { userId: 1, songId: 2, rating: 5, description: "I don't understand the bad review. I loved it!"}
//   ]
//   let testingReview = reviews[0];
//   return Promise.all(resolvedSeedUsers).spread( (testing, obama ) => [
//     testing.createReview( {
//       rating: testingReview.rating,
//       description: testingReview.description
//     } )
//   ])
// };

let seedGenres = function(){
  return seedInfo.genres.map(function (genreObj) {
      return Genre.create(genreObj);
  });

};

let seedPhotos = function(){
  return seedInfo.photos.map(function (photoObj) {
      return Photo.create(photoObj);
  });

};

db.sync({ force: true })
    .then(function () {
        return Promise.all([seedUsers(), seedComposers(), seedGenres(), seedPhotos(), seedSongs()])
        .spread( (users, composers, genres, photos, songs) => {
          return User.findById(1).then( user => {
            console.log('found user:', user);
            let orders = seedOrders();
            return user.createOrder(orders[0].orderId).then( (order) => {
              return [users, composers, genres, photos, songs, order];
            })
          })
        })
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
