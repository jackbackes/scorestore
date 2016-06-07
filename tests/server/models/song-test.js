var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));

var Sequelize = require('sequelize');
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
                    console.log('here', err)
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