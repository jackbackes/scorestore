var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));

var Sequelize = require('sequelize');
var Promise = require('sequelize').Promise;
var dbURI = 'postgres://localhost:5432/testingfsg';
var db = new Sequelize(dbURI, {
    logging: false
});

require('../../../server/db/models/song')(db);
require('../../../server/db/models/order')(db);
require('../../../server/db/models/orderSong')(db);
// require('../../../server/db/models/review')(db);
// require('../../../server/db/models/genre')(db);
// require('../../../server/db/models/composer')(db);
// require('../../../server/db/models/address')(db);
// require('../../../server/db/models/photo')(db);
// require('../../../server/db/models/user')(db);

var Song = db.model('song');
var Order = db.model('order');
var orderSong = db.model('song_order');
// var Review = db.model('review');
// var Genre = db.model('genre');
// var Composer = db.model('composer');
// var Address = db.model('address');
// var Photo = db.model('photo');
// var User = db.model('user');

// Song.belongsTo(Composer);
// Song.belongsTo(Genre);
Song.belongsToMany(Order, {through: 'song_order'});
Order.belongsToMany(Song, {through: 'song_order'});


// Review.belongsTo(Song);
// Review.belongsTo(User);

// User.hasMany(Address);
// User.hasMany(Review);

// Song.belongsTo(Photo);
// User.belongsTo(Photo);

describe('Associations', function () {

    var createSong,
    createOrder;
    // createComposer,
    // createGenre,
    // createUser,
    // createReview,
    // createAddress,
    // createPhoto;

    beforeEach('Sync DB', function () {
        createSong = function () {
            return Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5});
        };
        createOrder = function () {
            return Order.create();
        };
        // createAddress = function () {
        //     return Address.create({ firstName: 'John', lastName: 'Smith', address: '1 Main Street', city: 'New York', State: 'NY', zipCode: '10001'});
        // };
        // createComposer = function () {
        //     return Composer.create({ firstName: 'Jim', lastName: 'Jones'});
        // };
        // createGenre = function () {
        //     return Genre.create({genreName: 'jazz'});
        // };
        // createReview = function () {
        //     return Review.create({rating: 5, description: 'Great song'});
        // };
        // createUser = function () {
        //     return User.create({ firstName: "Barack", lastName: 'Obama', email: 'obama@gmail.com'})
        // };
        // createPhoto = function () {
        //     return Photo.create({ isLocal: true});
        // };
       return db.sync({ force: true });
    });


       describe('Validations', function () {

            it('throws an error if title is not provided', function() {
                var song = Song.build({ description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5});
                return song.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'title');
                });
            });
       

            it('throws an error if description is not provided', function() {
                var song = Song.build({ title:'Song1', fileName: '/song1', price: 5.00, inventoryQuantity: 5});
                return song.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'description');
                });
            });

             it('throws an error if fileName is not provided', function() {
                var song = Song.build({ title:'Song1', description: 'the first song', price: 5.00, inventoryQuantity: 5});
                return song.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'fileName');
                });
            });

             it('throws an error if price is not provided', function() {
                var song = Song.build({ title:'Song1', description: 'the first song', fileName: '/song1', inventoryQuantity: 5});
                return song.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'price');
                });
            });

             it('throws an error if price is not a number', function() {
                var song = Song.build({ title:'Song1', description: 'the first song', fileName: '/song1', price: 'five', inventoryQuantity: 5});
                return song.save()
                .then(function () {
                    throw Error('Promise should have rejected');
                  }, function (err) {
                    expect(err).to.exist;
                    expect(err.message).to.contain('invalid input syntax');
                  });
            });

             it('throws an error if inventoryQuantity is not provided', function() {
                var song = Song.build({ title:'Song1', description: 'the first song', fileName: '/song1', price: 5.00});
                return song.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'inventoryQuantity');
                });
            });



        });

        describe('setInstrumentTags setter', function () {

            it('adds array of tags to song', function () {
                createSong()
                .then(function (song) {
                    return song.set('instrumentTags', ['piano', 'french horn', 'guitar', 'saxophone']).save()
                        .then(function () {
                            expect(song.instrumentTags).to.have.lengthOf(4);
                            expect(song.instrumentTags).to.include('french horn');

                        });
                });
            });

            it('adds comma-delimited string of tags to song', function () {
                createSong()
                .then(function (song) {
                    return song.set('instrumentTags', 'piano, french horn, guitar, saxophone').save()
                        .then(function () {
                            expect(song.instrumentTags).to.have.lengthOf(4);
                            expect(song.instrumentTags).to.include('saxophone');
                        });
                });
            });

        });

        describe('instance methods', function () {

            it('findSimilar finds similar songs', function () {
                Promise.all([createSong(), createSong(), createSong(), createSong()])
                    .spread(function (song1, song2, song3, song4) {
                        return Promise.all([
                            song1.set('instrumentTags', ['piano', 'guitar', 'saxophone']).save(),
                            song2.set('instrumentTags', 'french horn').save(),
                            song3.set('instrumentTags', ['piano', 'french horn', 'guitar', 'saxophone']).save(),
                            song4.set('instrumentTags', ['piano', 'french horn', 'guitar', 'saxophone']).save()
                            ])
                        })
                    .spread(function(song1, song2, song3, song4) {
                        song2.findSimilar()
                        .then(function (similarSongs) {
                            expect(similarSongs).to.have.lengthOf(2);
                        });
                    });
            });

        });

        describe('Order-Song Association', function () {

            // beforeEach('Create Order and Song', function () { 
            //     createSong = function () {
            //         return Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5});
            //     };
            //     createOrder = function () {
            //         return Order.create();
            //     };
            // });

            it('creates and orderId and SongId on order-song table when an order is made', function () { 
                var songId, orderId;
                createOrder()
                .then(function(order) {
                    orderId = order.id;
                    return createSong()
                    .then(function(song) {
                        songId = song.id;
                        return order.addSong(song, {quantity: 2});
                    });
                })
                .then(function () {
                    return orderSong.findOne({
                        where: {
                            orderId: orderId
                        }
                    });
                })
                .then(function (orderSong) {
                    expect(orderSong.orderId).to.equal(orderId);
                    expect(orderSong.songId).to.equal(songId);
                    expect(orderSong.quantity).to.equal(2);
                });
            });
        });

});