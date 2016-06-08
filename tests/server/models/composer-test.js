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
// require('../../../server/db/models/order')(db);
// require('../../../server/db/models/orderSong')(db);
require('../../../server/db/models/genre')(db);
// // require('../../../server/db/models/review')(db);
require('../../../server/db/models/composer')(db);
// require('../../../server/db/models/address')(db);
// require('../../../server/db/models/photo')(db);
// require('../../../server/db/models/user')(db);

var Song = db.model('song');
// var Order = db.model('order');
// var orderSong = db.model('song_order');
var Genre = db.model('genre');
// var Review = db.model('review');
var Composer = db.model('composer');
// var Address = db.model('address');
// var Photo = db.model('photo');
// var User = db.model('user');

Song.belongsTo(Composer);
Song.belongsTo(Genre);
// Song.belongsToMany(Order, {through: 'song_order'});
// Order.belongsToMany(Song, {through: 'song_order'});


// Review.belongsTo(Song);
// Review.belongsTo(User);

// User.hasMany(Address);
// User.hasMany(Review);

// Song.belongsTo(Photo);
// User.belongsTo(Photo);

describe('Composer Model', function () {

    // var createSong,
    // createOrder;
    // createComposer,
    // createGenre,
    // createUser,
    // createReview,
    // createAddress,
    // createPhoto;

    beforeEach('Sync DB', function () {
        // createGenre = function (genre) {
        //     return Genre.create({genreName: genre});
        // };
        // createAddress = function () {
        //     return Address.create({ firstName: 'John', lastName: 'Smith', address: '1 Main Street', city: 'New York', State: 'NY', zipCode: '10001'});
        // };
        // createComposer = function () {
        //     return Composer.create({ firstName: 'Jim', lastName: 'Jones'});
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

            it('throws an error if firstName is not provided', function() {
                var composer = Composer.build({lastName: 'Jones'});
                return composer.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'firstName');
                });
            });
       

            it('throws an error if lastName is not provided', function() {
                var composer = Composer.build({firstName: 'Jim'});
                return composer.validate()
                .then(function(err) {
                    expect(err).to.exist;
                    expect(err.errors).to.contain.a.thing.with.property('path', 'lastName');
                });
            });
        });

        describe('fullNameVirtual', function () {
            

            it('returns the full name string', function() {
                Composer.create({ firstName: 'Jim', lastName: 'Jones'})
                .then(function (composer) {
                    expect(composer.fullName).to.equal("Jim Jones");
                });
            });
        });

        describe('findSimilar instance method', function () {
            var genre1, genre2, genre3;
            var song1, song2, song3, song4;
            var composer1, composer2, composer3;
            var createSong;
            beforeEach('CreateSong', function () {   
                return Promise.all([
                    Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5}),
                    Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5}),
                    Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5}),
                    Song.create({ title: 'song1', description: 'the first song', fileName: '/song1', price: 5.00, inventoryQuantity: 5})

                    ])
                .spread(function(s1, s2, s3, s4) {
                    song1 = s1;
                    song2 = s2;
                    song3 = s3;
                    song4 = s4;
                })
                .then(function () {
                    return Promise.all([
                        Genre.create({genreName: 'jazz'}),
                        Genre.create({genreName: 'classical'}),
                        Genre.create({genreName: 'opera'})
                    ]);
                })
                .spread(function(g1, g2, g3) {
                    genre1 = g1;
                    genre2 = g2;
                    genre3 = g3;
                })
                .then(function () {
                    return Promise.all([
                        Composer.create({ firstName: 'Jim', lastName: 'Jones'}),
                        Composer.create({ firstName: 'John', lastName: 'Smith'}),
                        Composer.create({ firstName: 'Jack', lastName: 'Johnson'})
                    ]);
                })
                .spread(function(c1, c2, c3) {
                    composer1 = c1;
                    composer2 = c2;
                    composer3 = c3;
                });
            });

                it('finds similar composers based on genre', function () {
                    Promise.all([
                        song1.setGenre(genre1),
                        song2.setGenre(genre1),
                        song3.setGenre(genre2),
                        song4.setGenre(genre3)
                    ])
                    .spread(function(song1, song2, song3, song4) {
                        return Promise.all([
                            song1.setComposer(composer1),
                            song2.setComposer(composer2),
                            song3.setComposer(composer1),
                            song4.setComposer(composer3)
                        ]);
                    })
                    .spread(function() {
                        composer1.findSimilar()
                        .then(function(similarComposers) {
                            console.log('Here', similarComposers);
                            expect(similarComposers[0].id).to.equal(composer2.id);
                            expect(similarComposers).to.have.lengthOf(1);
                        });
                    });
                });

        });

});