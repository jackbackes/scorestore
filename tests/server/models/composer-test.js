var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-things'));
process.env.NODE_ENV = 'testing';

var Sequelize = require('sequelize');
var Promise = require('sequelize').Promise;
var db = require('../../../server/db');

var Song = db.model('song');
var Genre = db.model('genre');
var Composer = db.model('composer');


describe('Composer Model', function () {

    beforeEach('Sync DB', function () {
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
            

            it('returns the full name string', function(done) {
                Composer.create({ firstName: 'Jim', lastName: 'Jones'})
                .then(function (composer) {
                    expect(composer.fullName).to.equal("Jim Jones");
                    done();
                })
                .catch(done);
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

                it('finds similar composers based on genre', function (done) {
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
                        return composer1.findSimilar()
                        .then(function(similarComposers) {
                            expect(similarComposers[0].id).to.equal(composer2.id);
                            expect(similarComposers).to.have.lengthOf(1);
                            done();
                        });
                    })
                    .catch(function (err) {
                        done(err);
                    });
                });

        });

});