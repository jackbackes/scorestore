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
require('../../../server/db/models/genre')(db);

var Song = db.model('song');
var Order = db.model('order');
var orderSong = db.model('song_order');
var Genre = db.model('genre');

Song.belongsTo(Genre);
Song.belongsToMany(Order, {through: 'song_order'});
Order.belongsToMany(Song, {through: 'song_order'});


describe('Song Model', function () {

    var createSong,
    createOrder;

    beforeEach('Sync DB', function () {
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

            beforeEach('CreateSong', function () {
                createSong = function () {
                    return Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5});
                };
            });

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
            var genre1, genre2, genre3;
            beforeEach('CreateSong', function () {   
                createSong = function () {
                    return Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5});
                };
                Promise.all([
                    Genre.create({genreName: 'jazz'}),
                    Genre.create({genreName: 'classical'}),
                    Genre.create({genreName: 'opera'})
                ])
                .spread(function(g1, g2, g3) {
                    genre1 = g1;
                    genre2 = g2;
                    genre3 = g3;
                })

            })

            it('findSimilarByInstrument finds similar songs based on instruments', function () {
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
                        song2.findSimilarByInstruments()
                        .then(function (similarSongs) {
                            expect(similarSongs).to.have.lengthOf(2);
                        });
                    });
            });


            it('findSimilarByGenre finds similar songs based on genres', function () {
                Promise.all([createSong(), createSong(), createSong(), createSong()])
                    .spread(function (song1, song2, song3, song4) {
                        return Promise.all([
                            song1.setGenre(genre1),
                            song2.setGenre(genre2),
                            song3.setGenre(genre3),
                            song4.setGenre(genre1),
                        ]);
                    })  
                    .spread(function(song1, song2, song3, song4) {
                        song1.findSimilarByGenre()
                        .then(function(similarSongs) {
                            expect(similarSongs[0].id).to.equal(song4.id)
                            expect(similarSongs).to.have.lengthOf(1);
                        });
                    });
            });

        });

        describe('Order-Song Association', function () {

            beforeEach('Create Order and Song', function () { 
                createSong = function () {
                    return Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5});
                };
                createOrder = function () {
                    return Order.create();
                };
            });

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