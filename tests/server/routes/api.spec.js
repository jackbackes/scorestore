'use strict';
/**
 * @module api-spec
 * @namespace api-spec
 * @overview Tests the data api routes
 * @author John Backes
 * @requires module:chai
 * @requires module:chai-as-promised
 * @requires module:supertest
 */
const chai = require( 'chai' );
var expect = chai.expect;
var should = chai.should();
/** Chai-As-Promised allows chai to test promises with the chainable "eventually" method */
chai.use( require( 'chai-as-promised' ) );
var supertest = require( 'supertest' );
var supertestAsPromised = require( 'supertest-as-promised' )

var Sequelize = require( 'sequelize' );
var dbURI = 'postgres://localhost:5432/testing-fsg';
var db = new Sequelize( dbURI, {
  logging: false
} );
require( '../../../server/db/models/user' )( db );
require( '../../../server/db/models/song' )( db );
require( '../../../server/db/models/composer' )( db );
require( '../../../server/db/models/genre' )( db );
require( '../../../server/db/models/address' )( db );
require( '../../../server/db/models/review' )( db );


describe( '/api/v1', function () {
  var app;
  let User, Song, Composer, Genre, Address, Review;

  beforeEach( 'Sync DB', function () {
    return db.sync( {
      force: true
    } );
  } );

  beforeEach( 'Create app', function () {
    app = require( '../../../server/app' )( db );
    User = db.model( 'user' );
    Song = db.model( 'song' );
    Composer = db.model( 'composer' );
    Genre = db.model( 'genre' );
    Address = db.model( 'address' );
    Review = db.model( 'review' );
  } );

  let adminAgent, guestAgent, authdAgent;

  beforeEach( 'Create admin, guest, and authenticated agents', function () {
    adminAgent = supertestAsPromised.agent( app );
    guestAgent = supertestAsPromised.agent( app );
    authdAgent = supertestAsPromised.agent( app );
  } );
  const authdInfo = {
    id: 1,
    firstName: "Joe",
    lastName: "ShoopieDoop",
    email: 'joe@gmail.com',
    password: 'shoopdawoop',
    isAdmin: false
  };
  const adminInfo = {
    id: 2,
    firstName: "John",
    lastName: "John",
    email: 'john@john.com',
    password: 'blingblang',
    isAdmin: true
  };
  const guestInfo = {
    id: 3,
    email: "iama@guest.com",
    isGuest: true
  };


  beforeEach( 'Create admin and authd users', function ( done ) {
    let authd = User.create( authdInfo )
    let admin = User.create( adminInfo )
    return Promise.all( [authd, admin] ).then( ()=> done() ).catch( (err)=> done(err) );
  } );

  beforeEach( 'Login with admin and authd users', function ( done ) {
    return Promise.all( [
      authdAgent.post( '/login' )
      .send( authdInfo ),
      adminAgent.post( '/login' )
      .send( adminInfo )
    ] ).then( ()=> done() ).catch( done )
  } )

  afterEach( 'Log Out with admin and authd users', function ( done ) {
    return Promise.all( [
      authdAgent.get( '/logout' ),
      adminAgent.post( '/logout' )
    ]).then(() => done()).catch(err => done(err))
  } )

  describe( '/user', function (done) {
    describe( 'POST', function (done) {
      it( 'creates a new user and returns user data', function ( done ) {
        let manualUser = {
          firstName: "Ima",
          lastName: "ManualUser",
          email: "manual@user.com",
          password: "blingBlang",
          isAdmin: "true"
        }
        let guestRegister = {
          firstName: "Guest",
          lastName: "McGuesterson",
          email: "iama@guest.com",
          password: "blingBlang",
          isAdmin: "false"
        }
        let newUserInfo = {
          firstName: "Flim",
          lastName: "Flam",
          email: "flim@flam.com",
          password: "blingBlang",
          isAdmin: "false"
        }
        let guestRequest = guestAgent.post( '/api/v1/user' )
          .send( JSON.stringify(guestRegister) )
          .expect( 201 )
          .end( ( err, response ) => {
            if ( err ) throw err;
            response.body.should.be.an( 'object' );
            response.should.have.deep.property( 'fullName', "Guest McGuesterson" );
            response.should.not.have.deep.property( 'isGuest' );
          } )
        let adminRequest = adminAgent.post( '/api/v1/user' )
          .send( JSON.stringify(manualUser) )
          .expect( 201 )
          .end( ( err, response ) => {
            if ( err ) throw err;
            response.body.should.be.an( 'object' );
            response.should.have.deep.property( "fullName" )
              .that.equals( "Ima ManualUser" );
            response.should.have.deep.property( "email" )
              .that.equals( "manual@user.com" );
            response.should.have.deep.property( "isAdmin" )
              .that.is.a.boolean.that.equals( true );
          } )
        let authdRequest = authdAgent.post( '/api/v1/user' )
          .send( JSON.stringify(newUserInfo) )
          .expect( 401 )
          .end( ( err, response ) => {
            if ( err ) throw err;
            response.body.should.not.have.any.keys( 'firstName', 'lastName', 'fullName', 'password' );
          } )
        return Promise.all([authdRequest, adminRequest, guestRequest]).then(done).catch(done)
      } )
      describe( '/:userId', function () {
        describe( 'GET', function () {
          it( 'returns a user with the specified id', function ( done ) {
            guestAgent.get( '/api/v1/user/1 ' )
              .expect( 200 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                response.body.should.have.all.keys( 'firstName', 'lastName', 'fullName', 'id', 'reviews' );
                done();
              } )
          } )
          it( 'the results are sanitized if the user is not an admin', function (done) {
            guestAgent.get( '/api/v1/user/1 ' )
              .expect( 200 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                response.body.should.not.have.any.keys( 'password', 'salt', 'isAdmin', 'isGuest', 'email', 'orders', 'addresses' );
                done();
              } )
          } )
          it( 'admins see unsanitized results ', function (done) {
            adminAgent.get( '/api/v1/user/1' )
              .expect( 200 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                response.body.should.have.all.keys( 'password', 'isAdmin', 'isGuest', 'email' );
                response.body.should.not.have.any.keys( 'salt' )
                done();
              } )
            it( 'result should have an array of orders', function ( done ) {
              adminAgent.get( '/api/v1/user/1' )
                .expect( 200 )
                .end( ( err, response ) => {
                  if ( err ) return done( err );
                  response.body.orders.should.be.an( 'array' );
                  done();
                } )
            } )
            it( 'users can see unsanitized results for their own account', function () {
              authdAgent.get( '/api/v1/user/1' )
                .expect( 200 )
                .end( ( err, response ) => {
                  if ( err ) return done( err );
                  response.body.should.have.all.keys( 'password', 'isAdmin', 'isGuest', 'email' );
                  response.body.should.not.have.any.keys( 'salt' )
                  done();
                } )
            } )
          } )
          describe( 'DELETE', function () {
            it( 'admin can delete a user with the specified id', function ( done ) {
              adminAgent.delete( '/api/v1/user/3' )
                .expect( 204 )
                .end( ( err, response ) => {
                  if ( err ) return done( err );
                  adminAgent.get( '/api/v1/user/3' )
                    .expect( 404 )
                    .end( done )
                } )
            } )
            it( 'an authorized user can delete their own account', function ( done ) {
              authdAgent.delete( '/api/v1/user/1' )
                .expect( 204 )
                .end( ( err, response ) => {
                  if ( err ) return done( err );
                  adminAgent.get( '/api/v1/user/1' )
                    .expect( 404 )
                    .end( done )
                } )
            } )
            it( "a user cannot delete another user's account", function ( done ) {
              return Promise.all( [
                authdAgent.delete( '/api/v1/user/3' ).expect( 403 ).end(),
                guestAgent.delete( '/api/v1/user/1 ' ).expect( 401 ).end()
              ]).then(()=>done()).catch(done)
            } )
          } )
          describe( 'PUT', function () {
            let patchUser1 = {
              firstName: "Jeffey"
            }
            it( 'admin can update a user with the specified id (acts as patch, not replace)', function (done) {
              adminAgent.put( '/api/v1/user/1' ).send( patchUser1 ).expect( 201 ).end( (err, response) => {
                if(err) return done(err);
                adminAgent.get( '/api/v1/user/1' ).end( (err, response) => {
                  if(err) return done(err);
                  response.body.firstName.should.equal( patchUser1.firstName );
                  response.body.lastName.should.equal( authdInfo.lastName );
                  done();
                })
              })
            } )
            it( 'a user can update their own account', function (done) {
              authdAgent.put( '/api/v1/user/1' ).send( patchUser1 ).expect( 201 ).end( (err, response) => {
                if(err) return done(err);
                adminAgent.get( '/api/v1/user/1' ).end( (err, response) => {
                  if(err) return done(err);
                  response.body.firstName.should.equal( patchUser1.firstName );
                  response.body.lastName.should.equal( authdInfo.lastName );
                  done();
                })
              })
            } )
            it( 'a guest user cannot update their own account', function (done) {
              guestAgent.put( '/api/v1/user/3' ).send( patchUser1 ).expect( 401 ).end(done)
            } )
            it( "a user cannot update someone else's account", function (done) {
              return Promise.all([
                authdAgent.put( '/api/v1/user/2' ).send( patchUser1 ).expect( 403 ).end(),
                guestAgent.put( '/api/v1/user/1' ).send( patchUser1 ).expect( 401 ).end()
              ]).then(done).catch(done);
            } )
          } )
        } )
      } )
    } )
    describe( '/users', function (done) {
      describe( "GET", function (done) {
        it( 'returns a list of all users', function (done) {
          return Promise.all([
            adminAgent.get( '/api/v1/users' ).end( (err, response) => {
              if(err) throw err;
              response.body.should.be.an( 'array' );
              response.body.should.not.have.deep.property( 'salt' );
            }),
            guestAgent.get( '/api/v1/users' ).end( (err, response) => {
              if(err) throw err;
              response.body.should.be.an( 'array' );
              response.body.should.not.have.deep.property( 'password' );
              response.body.should.not.have.deep.property( 'salt' );
            }),
            authdAgent.get( '/api/v1/users' ).end( (err, response) => {
              if(err) throw err;
              response.body.should.be.an( 'array' );
              response.body.should.not.have.deep.property( 'password' )
              response.body.should.not.have.deep.property( 'salt' );
            })
          ]).then(done).catch(done);
        } )

      } )
      describe( "?", function (done) {
        it( 'takes query parameters', function (done) {
          authdAgent.get( '/api/v1/users?firstName=John&lastName=John' ).end( (err, response) =>{
            if(err) return done(err);
            response.body.should.be.an( 'array' );
            response.body.should.have.property( '[0]firstName', 'John' )
            done();
          })
        } )
      } )
    } )
    describe( '/composer', function (done) {
      let bach = {
        firstName: "Johannes",
        lastName: "Bach"
      }
      describe( 'POST', function (done) {
        it( 'an admin can create a new composer', function (done) {
          adminAgent.post( '/api/v1/composer' ).send( bach ).expect( 201 ).end( (err, response) => {
            if(err) return done(err);
            let postBach = bach;
            postBach.id = response.body.id;
            response.body.should.deep.equal( postBach );
            done();
          })
        } )
        it( 'an admin can create and associated through song/:songId/composer', function (done) {
          adminAgent.post( '/api/v1/song/1/composer' ).send( bach ).expect( 201 ).end( (err, response) => {
            if(err) return done(err);
            response.body[0].songs[0].id.should.equal( 1 );
            done();
          })
        } )
      } )
      describe( '/:composerId', function (done) {
        describe( 'GET', function (done) {
          it( 'returns composer with specific id', function (done) {
            return Promise.all([
              adminAgent.get( '/api/v1/composer/1' ).expect( 200 ).end( (err, response) =>{
                if(err) throw err;
                response.body.id.should.equal( 1 );
              }),
              guestAgent.get( '/api/v1/composer/2' ).expect( 200 ).end( (err, response) =>{
                if(err) throw err;
                response.body.id.should.equal( 2 );
              }),
              authdAgent.get( '/api/v1/composer/3' ).expect( 200 ).end( (err, response) =>{
                if(err) throw err;
                response.body.id.should.equal( 3 );
              })

            ]).then(done).catch(done);
          } )
        } )
        describe( 'DELETE', function (done) {
          it( 'admin can delete a composer', function (done) {
            adminAgent.delete( '/api/v1/composer/2' ).expect(204).end( (err, response) =>{
              if(err) return done(err);
              return adminAgent.get( '/api/v1/composer/2' ).expect(404).end(done)
            })
          } )
          it( 'non-admins cannot delete a composer', function (done) {
            guestAgent.delete( '/api/v1/composer/1' ).expect(204).end( (err, response) =>{
              if(err) return done(err);
              return adminAgent.get( '/api/v1/composer/2' ).expect(200).end(done)
            })
            authdAgent.delete( '/api/v1/composer/3' ).expect(204).end( (err, response) =>{
              if(err) return done(err);
              return adminAgent.get( '/api/v1/composer/2' ).expect(200).end(done)
            })
          } )
        } )
        describe( 'PUT', function (done) {
          it( 'admin can update a composer', function (done) {
            adminAgent.put( '/api/v1/composer/2' ).send( bach ).expect( 201 ).end( (err, response) => {
              if(err) return done(err);
              let putBach = bach;
              putBach.id = 2;
              response.body.should.deep.equal( putBach );
              done();
            })
          } )
          } )
          it( 'non-admin cannot update a composer', function (done) {
            Promise.all([
              guestAgent.put( '/api/v1/composer/3' ).send( bach ).expect( 401 ).end(),
              authdAgent.put( '/api/v1/composer/2' ).send( bach ).expect( 403 ).end()
            ]).then(done).catch(done);
          } )
        } )
      } )
    } )
    describe( '/composers', function (done) {
      describe( 'GET', function (done) {
        it( 'returns a list of composers', function (done) {
          Promise.all([
            adminAgent.get( '/api/v1/composers' ).expect(200).end((err, response)=>{
              if(err) return done(err)
              return response.body.should.be.an( 'array' );
            }),
            guestAgent.get( '/api/v1/composers' ).expect(200).end((err, response)=>{
              if(err) return done(err)
              return response.body.should.be.an( 'array' );
            }),
            authdAgent.get( '/api/v1/composers' ).expect(200).end((err, response)=>{
              if(err) return done(err)
              return response.body.should.be.an( 'array' );
            }).then(done).catch(done)
          ])
        } )
      } )
      describe( '?', function (done) {
        it( 'correctly handles query strings', function () {
          adminAgent.get( '/api/v1/composers?id=1' ).expect(200).end((err, response)=>{
            if(err) return done(err)
            response.body.should.be.an( 'array' );
            response.body[0].id.should.equal( 1 );
            return true
          })
          guestAgent.get( "/api/v1/composers?fullName=Ludwig+Van+Beethoven" )
        } )
      } )
    } )
    describe( '/cart', function (done) {
      let cart1 = [ {} ];
      let cart2 = [ {} ];
      let cart3 = [ {} ];


      it( 'user can only use these routes for their own cart', function (done) {
        authdAgent.get( '/api/v1/cart/2' )
      } )
      it( 'admin can use these routes for any cart', function (done) {
        adminAgent.get( '/api/v1/cart/1' )
        adminAgent.put( '/api/v1/cart/2' )
          .send( cart2 )
        adminAgent.delete( '/api/v1/cart/3' )
      } )
      it( 'POST /save saves the cart and returns the cart instance', function (done) {
        authdAgent.post( '/api/v1/cart/save' )
          .send( cart3 )
      } )
      it( 'PUT /:cartId updates the cart in the database', function (done) {
        authdAgent.put( '/api/v1/cart/1' )
          .send( cart1 )
      } )
      it( 'POST /add/song/:songId adds a specific song to the cart', function (done) {
        guestAgent.post( '/api/v1/cart/add/song/5' )
      } )
      it( 'DELETE /remove/song/:songId removes a specific song from the cart', function (done) {
        guestAgent.delete( '/api/v1/cart/delete/song/2' )
      } )
      it( 'DELETE /clear clears the current cart', function (done) {
        authdAgent.delete( '/api/v1/cart/clear' )
      } )
    } )
    describe( '/order', function (done) {
      it( '/:orderId -- authorized user can only use these routes for their own account', function (done) {
        authdAgent.get( '/api/v1/order/1' )
        authdAgent.get( '/api/v1/order/3' )
      } )
      it( '/:orderId -- admin can use these routes for any account', function (done) {
        adminAgent.get( '/api/v1/order/1' )
      } )
      describe( 'POST', function (done) {
        it( 'creates a new order', function (done) {
          authdAgent.post( '/api/v1/order' )
          guestAgent.post( '/api/v1/order' )
        } )
        it( 'admin can create order for another user', function (done) {
          adminAgent.post( '/api/v1/user/1/order' )
        } )
      } )
      describe( '/:orderId/trackingNumber', function (done) {
        it( 'user or admin can generate or retrieve a tracking number for an order', function (done) {
          guestAgent.get( '/api/v1/order/3/trackingNumber' )
          authdAgent.get( '/api/v1/order/1/trackingNumber' )
        } )
        it( 'user cannot retrieve tracking number associated with another user', function (done) {
          guestAgent.get( '/api/v1/order/1/trackingNumber' )
          authdAgent.get( '/api/v1/order/3/trackingNumber' )
        } )
        it( 'admin can retrieve tracking number for any user', function (done) {
          adminAgent.get( '/api/v1/order/1/trackingNumber' )
          adminAgent.get( '/api/v1/order/3/trackingNumber' )
        } )
      } )
      describe( '/:orderId/trackingNumber/:trackingNumber', function (done) {
        it( 'anyone can get an order with a tracking number', function (done) {
          guestAgent.get( '/api/v1/order/trackingNumber/123456789' )
          authdAgent.get( '/api/v1/order/trackingNumber/123456789' )
        } )
      } )
      describe( '/:id', function (done) {
        describe( 'GET', function (done) {
          it( 'an admin can get any order', function (done) {
            adminAgent.get( '/api/v1/order/1' )
            adminAgent.get( '/api/v1/order/3' )
          } )
          it( 'an authorized user can get their own order', function (done) {
            authdAgent.get( '/api/v1/order/1' )
          } )
          it( 'an authorized user cannot get another user order', function (done) {
            authdAgent.get( '/api/v1/order/3' )
          } )
          it( 'a guest user cannot even see their own order history', function (done) {
            guestAgent.get( '/api/v1/orders' )
            guestAgent.get( '/api/v1/order/3' )
          } )
        } )
        describe( 'DELETE', function (done) {
          it( 'an admin can delete any order', function (done) {
              adminAgent.delete( '/api/v1/order/1' )
            } )
            // by enabling paranoid mode we can prevent true destruction of orders. this would be important for auditing/accounting - we don't want to delete an order if a transaction has been successful, even if it doesn't show up in the user's own order history.
          it( 'orders are deleted VIRTUALLY but stay in the database', function (done) {
            adminAgent.delete( '/api/v1/order/2' )
          } )
          it( 'guests cannot delete orders', function (done) {
            guestAgent.delete( '/api/v1/order/3' )
          } )
          it( "authd users can VIRTUALLY delete their completed orders", function (done) {
            authdAgent.delete( '/api/v1/order/1' )
          } )
          it( "authd users can truly delete their incomplete orders", function (done) {
            authdAgent.delete( '/api/v1/order/5' )
          } )
        } )
        describe( 'PUT', function (done) {
          it( 'works', function (done) {
            adminAgent.put( '/api/v1/order/2' )
          } )
        } )
      } )
    } )
    describe( '/orders', function (done) {
      describe( 'GET', function (done) {
        it( 'returns an array of all orders', function (done) {
          adminAgent.get( '/api/v1/orders' )
        } )
        it( 'sanitized of user information', function (done) {
          guestAgent.get( '/api/v1/orders' )
          authdAgent.get( '/api/v1/orders' )
        } )
        it( 'can be nested as user/:userId/orders', function (done) {
          adminAgent.get( '/api/v1/user/2/orders' )
        } )
        it( "only returns a user's own orders if not admin", function (done) {
          authdAgent.get( '/api/v1/user/1/orders' )
          authdAgent.get( '/api/v1/user/3/orders' )
        } )
      } )
      describe( '?', function (done) {
        it( 'orders take query strings', function (done) {
          adminAgent.get( '/api/v1/orders?userId=1' )
        } )
      } )
    } )
    describe( '/songs', function (done) {
      describe( 'GET', function (done) {
        it( 'retrieves a list of songs', function (done) {
          adminAgent.get( '/api/v1/songs' )
        } )
        it( 'sanitized for non-admins', function (done) {
          guestAgent.get( '/api/v1/songs' )
          authdAgent.get( '/api/v1/songs' )
        } )
      } )
      describe( '?', function (done) {
        it( 'can take query parameters', function (done) {
          adminAgent.get( '/api/v1/songs?fullName=Ludwig+Van+Beethoven' )
        } )
      } )
    } )
    describe( '/song', function (done) {
      describe( 'POST', function (done) {
        it( 'admin-only', function (done) {
          adminAgent.post( '/api/v1/song' )
          guestAgent.post( '/api/v1/song' )
          authdAgent.post( '/api/v1/song' )
        } )
        it( 'adds a song', function (done) {
          adminAgent.post( '/api/v1/song' )
        } )
      } )
      describe( '/:id', function (done) {
        describe( 'GET', function (done) {
          it( 'retrieves a specific song', function (done) {
            adminAgent.get( '/api/v1/song/1' )
            guestAgent.get( '/api/v1/song/2' )
            authdAgent.get( '/api/v1/song/3' )
          } )
        } )
        describe( 'DELETE', function (done) {
          it( 'admin-only', function (done) {
            adminAgent.delete( '/api/v1/song/1' )
            guestAgent.delete( '/api/v1/song/2' )
            authdAgent.delete( '/api/v1/song/3' )
          } )
          it( 'deletes a specific song', function (done) {
            adminAgent.delete( '/api/v1/song/1' )
          } )
        } )
        describe( 'PUT', function (done) {
          it( 'admin-only', function (done) {
            adminAgent.put( '/api/v1/song/1' )
            authdAgent.put( '/api/v1/song/2' )
            guestAgent.put( '/api/v1/song/3' )
          } )
          it( 'updates a specific song', function (done) {
            adminAgent.put( '/api/v1/song/1' )
          } )
        } )
      } )
      describe( '/reviews', function (done) {
        describe( 'GET', function (done) {
          it( 'returns a list of all reviews', function (done) {
            adminAgent.get( '/api/v1/reviews' )
            guestAgent.get( '/api/v1/reviews' )
            authdAgent.get( '/api/v1/reviews' )
          } )
          it( 'song/:songId/reviews retrieves a list of reviews for a specific song', function (done) {
            guestAgent.get( '/api/v1/song/1/reviews' )
          } )
        } )
        describe( '?', function (done) {
          it( 'correctly interprets query parameters', function (done) {
            guestAgent.get( '/api/v1/reviews?songTitle=circle+of+life' )
          } )
        } )
      } )
      describe( '/review', function (done) {
        describe( 'POST', function (done) {
          it( 'authenticated users can create for their own account', function (done) {
            authdAgent.post( '/api/v1/review' )
          } )
          it( 'guest users cannot create', function (done) {
            guestAgent.post( '/api/v1/review' )
          } )
          it( 'admin users can create on behalf of any user', function (done) {
            adminAgent.post( '/api/v1/review' )
          } )
          it( 'creates a new review', function (done) {
            authdAgent.post( '/api/v1/review' )
          } )
          it( '/song/:songId/review creates a new review for a specific song', function (done) {
            adminAgent
          } )
          it( 'new reviews must be associated with a song', function (done) {
            authdAgent.post( '/api/v1/review' )
          } );
        } )
        describe( '/:reviewId', function (done) {
          describe( 'GET', function (done) {
            it( 'retrieves a review, for any user', function (done) {
              adminAgent.get( '/api/v1/review/1' )
              guestAgent.get( '/api/v1/review/2' )
              authdAgent.get( '/api/v1/review/3' )
            } );
          } )
          describe( 'DELETE', function (done) {
            it( 'deletes a review', function (done) {
              adminAgent.delete( '/api/v1/review/3' )
            } )
            it( 'an authenticated user can delete their own review', function (done) {
              authdAgent.delete( '/api/v1/review/1' )

            } )
            it( 'an admin can delete any review', function (done) {
              adminAgent.delete( '/api/v1/review/1' )
            } );
            it( 'a user cannot delete the review of another user', function (done) {
              authdAgent.delete( '/api/v1/reviw/3' )
            } )
            it( 'a guest cannot delte a review', function (done) {
              guestAgent.delete( '/api/v1/review/3' )
            } )
          } )
          describe( 'PUT', function (done) {
            it( 'updates a review', function (done) {
              adminAgent.put( '/api/v1/review/1' )
            } )
            it( 'an authenticated user can update their own review', function (done) {
              authdAgent.put( '/api/v1/review/1' )
            } )
            it( 'an admin can update any review', function (done) {
              adminAgent.put( '/api/v1/review/2' )
            } );
            it( 'a user cannot update the review of another user', function (done) {
              adminAgent.put( '/api/v1/review/3' )
            } )
          } )
        } )
      } )
    } )
    describe( '/genre', function (done) {
      describe( 'POST', function (done) {
        it( 'admins can create a genre', function (done) {
          adminAgent.post( '/api/v1/genre' )
        } )
        it( 'admin-only', function (done) {
          authdAgent.post( '/api/v1/genre' )
          guestAgent.post( '/api/v1/genre' )
        } );
      } )
      describe( '/:id', function (done) {
        describe( 'GET', function (done) {
          it( 'retrieves information about a specific genre including list of songs and composers', function (done) {
            adminAgent.get( '/api/v1/genre/1' )
            authdAgent.get( '/api/v1/genre/2' )
            guestAgent.get( '/api/v1/genre/3' )
          } )
        } )
        describe( 'DELETE', function (done) {
          it( 'deletes a genre', function (done) {
            adminAgent.delete( '/api/v1/genre/1' )
          } )
          it( 'admin-only', function (done) {
            authdAgent.delete( '/api/v1/genre/2' )
            guestAgent.delete( '/api/v1/genre/3' )
          } );
        } )
        describe( 'PUT', function (done) {
          it( 'updates a genre', function (done) {
            adminAgent.put( '/api/v1/genre/1' )
          } )
          it( 'admin-only', function (done) {
            authdAgent.put( '/api/v1/genre/2' )
            guestAgent.put( '/api/v1/genre/3' )
          } );
        } )
      } )
    } )
    describe( '/genres', function (done) {
      describe( 'GET', function (done) {
        it( 'retrieves a list of all genres, accessible by all user roles', function (done) {
          adminAgent.get( '/api/v1/genres' )
          authdAgent.get( '/api/v1/genres' )
          guestAgent.get( '/api/v1/genres' )
        } );
      } )
      describe( '?', function (done) {
        it( 'supports queries', function (done) {
          adminAgent.get( '/api/v1/genres?id=classical' )
          adminAgent.get( '/api/v1/genres?id=Classical' )
        } )
      } )
    } )
  } )
