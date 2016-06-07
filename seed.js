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

const chalk = require('chalk');
const db = require('./server/db');
const User = db.model('user');
const Order = db.model('order');
const Review = db.model('review');
const Song = db.model('song');
const Composer = db.model('composer');
const Promise = require('sequelize').Promise;

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

let seedSongs = function(){
  let songs = {
    {
      title: "Symphony No. 5 in C Minor",
      subtitle: "First Movement",
      description: "Adapted By Arrangement from Ernst Pauer, 1826-1905",
      yearComposed: 1823,
      fileName: "Beethoven_Symphony_No._5_1st_movement_Piano_solo.pdf",
      price: 10.00,
      inventoryQuantity: 10,
      imageURL: "???",
      instrumentTags: ["piano"],
      sourceURL: "???",
      publicDomainStatus: "public"
    }
  }
  let creatingSongs = songs.map(function (songObj) {
      return Song.create(songObj);
  });

  return Promise.all(creatingSongs);
};

let seedComposers = function(seedSongs){
  //populate this object with composer data. set an object title so that it can be used in the "setComposer" command below.
  let composers = {
    beethoven: {
      firstName: "Ludwig",
      lastName: "Van Beethoven"
    }
  }

  // set composer for each song.
  return seedSongs.spread( (symphonyNo5) => Promise.all([
    symphonyNo5.setComposer(composers.beethoven)
  ]))
  })
}

let seedOrders = function(){
  let orders = [
    testingOrder: {
      time: Date.now(),
      songs: [
        { songId: 1, quantity: 10 },
        { songId: 2, quantity: 1 },
        { songId: 3, quantity: 4 }
      ],
      userId: 1,
      shippingAddress: {
        firstName: "Jimmy"
        lastName: "Neutron"
        address: "123 Mars Avenue"
        city: "MoonBase"
        state: "TX"
        zipCode: 75252
      }
    }]
  return seedUsers.spread( (testing, obama) => [
    testing.createOrder( {
      //add the time of the order
      time: testingOrder.time
    }, {
      include: [
        //include the correct user
        {model: User, where: {id: testingOrder.userId}},
        //include the songs into the order
        {model: Song, where: {id: [testingOrder.songs[0].songId, testingOrder.songs[1].songId, testingOrder.songs[2].songId]}}
      ]
      //add the shipping address
    } ).createAddress( testingOrder.shippingAddress );
  ] )
};
let seedReviews = function(){
  let reviews = [
    testingReview: { userId: 1, songId: 1, rating: 5, description: "I loved it!"},
    { userId: 2, songId: 2, rating: 0, description: "I hated it!"},
    { userId: 1, songId: 2, rating: 5, description: "I don't understand the bad review. I loved it!"}
  ]
  return seedUsers.spread( (testing, obama ) => [
    testing.createReview( {
      testingReview.rating,
      testingReview.description
    } )
  ])
};

db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
