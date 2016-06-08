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

var adminAgent, guestAgent, authdAgent;
var app;
let User, Song, Composer, Genre, Address, Review;

describe( '/api/v1', function (  ) {

  beforeEach( 'Sync DB', function () {
    return db.sync( {
      force: true
    } );
  } );


  beforeEach( 'Create app', function () {
    app = require( '../../../server/app' )( db );
    adminAgent = supertestAsPromised.agent( app );
    guestAgent = supertestAsPromised.agent( app );
    authdAgent = supertestAsPromised.agent( app );
    User = db.model( 'user' );
    Song = db.model( 'song' );
    Composer = db.model( 'composer' );
    Genre = db.model( 'genre' );
    Address = db.model( 'address' );
    Review = db.model( 'review' );
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


  beforeEach( 'Create admin user and login', function () {
    let admin = User.create( adminInfo )
      .then( () => adminAgent.post( '/login' )
        .send( adminInfo ) )
  } );

  beforeEach( 'Create authd user and login', function () {
    let authd = User.create( authdInfo )
      .then( () => authdAgent.post( '/login' )
        .send( authdInfo ) )
  } )


  describe( '/user', function () {;

    describe( 'POST', function () {
      it( 'creates a new user and returns user data', function (  ) {
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
          .send( JSON.stringify( guestRegister ) )
          .expect( 201 )
          .end( ( err, response ) => {
            if ( err ) throw err;
            response.body.should.be.an( 'object' );
            response.should.have.deep.property( 'fullName', "Guest McGuesterson" );
            response.should.not.have.deep.property( 'isGuest' );
          } )
        let adminRequest = adminAgent.post( '/api/v1/user' )
          .send( JSON.stringify( manualUser ) )
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
          .send( JSON.stringify( newUserInfo ) )
          .expect( 401 )
          .end( ( err, response ) => {
            if ( err ) throw err;
            response.body.should.not.have.any.keys( 'firstName', 'lastName', 'fullName', 'password' );
          } )
        return Promise.all( [ authdRequest, adminRequest, guestRequest ] )
          .then( done )
          .catch( done )
      } )
      describe( '/:userId', function () {
        describe( 'GET', function () {;
          it( 'returns a user with the specified id', function ( done ) {
            guestAgent.get( '/api/v1/user/1 ' )
              .expect( 200 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                response.body.should.have.all.keys( 'firstName', 'lastName', 'fullName', 'id', 'reviews' );
                done();
              } )
          } )
          it( 'the results are sanitized if the user is not an admin', function ( done ) {
            guestAgent.get( '/api/v1/user/1 ' )
              .expect( 200 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                response.body.should.not.have.any.keys( 'password', 'salt', 'isAdmin', 'isGuest', 'email', 'orders', 'addresses' );
                done();
              } )
          } )
          it( 'admins see unsanitized results ', function ( done ) {
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
            it( 'users can see unsanitized results for their own account', function ( done ) {
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
                  authdAgent.delete( '/api/v1/user/3' )
                  .expect( 403 )
                  .end(),
                  guestAgent.delete( '/api/v1/user/1 ' )
                  .expect( 401 )
                  .end()
                ] )
                .then( () => done() )
                .catch( done )
            } )
          } )
          describe( 'PUT', function () {
            let patchUser1 = {
              firstName: "Jeffey"
            }
            it( 'admin can update a user with the specified id (acts as patch, not replace)', function ( done ) {
              adminAgent.put( '/api/v1/user/1' )
                .send( JSON.stringify( patchUser1 ) )
                .expect( 200 )
                .end( ( err, response ) => {
                  if ( err ) return done( err );
                  adminAgent.get( '/api/v1/user/1' )
                    .end( ( err, response ) => {
                      if ( err ) return done( err );
                      response.body.firstName.should.equal( patchUser1.firstName );
                      response.body.lastName.should.equal( authdInfo.lastName );
                      done();
                    } )
                } )
            } )
            it( 'a user can update their own account', function ( done ) {
              authdAgent.put( '/api/v1/user/1' )
                .send( JSON.stringify( patchUser1 ) )
                .expect( 200 )
                .end( ( err, response ) => {
                  if ( err ) return done( err );
                  adminAgent.get( '/api/v1/user/1' )
                    .end( ( err, response ) => {
                      if ( err ) return done( err );
                      response.body.firstName.should.equal( patchUser1.firstName );
                      response.body.lastName.should.equal( authdInfo.lastName );
                      done();
                    } )
                } )
            } )
            it( 'a guest user cannot update their own account', function ( done ) {
              guestAgent.put( '/api/v1/user/3' )
                .send( JSON.stringify( patchUser1 ) )
                .expect( 401 )
                .end( done )
            } )
            it( "a user cannot update someone else's account", function ( done ) {
              return Promise.all( [
                  authdAgent.put( '/api/v1/user/2' )
                  .send( JSON.stringify( patchUser1 ) )
                  .expect( 403 )
                  .end(),
                  guestAgent.put( '/api/v1/user/1' )
                  .send( JSON.stringify( patchUser1 ) )
                  .expect( 401 )
                  .end()
                ] )
                .then( done )
                .catch( done );
            } )
          } )
        } )
      } )
    } )
    describe( '/users', function () {;

      describe( "GET", function () {
        it( 'returns a list of all users', function ( done ) {
          return Promise.all( [
              adminAgent.get( '/api/v1/users' )
              .end( ( err, response ) => {
                if ( err ) throw err;
                response.body.should.be.an( 'array' );
                response.body.should.not.have.deep.property( 'salt' );
              } ),
              guestAgent.get( '/api/v1/users' )
              .end( ( err, response ) => {
                if ( err ) throw err;
                response.body.should.be.an( 'array' );
                response.body.should.not.have.deep.property( 'password' );
                response.body.should.not.have.deep.property( 'salt' );
              } ),
              authdAgent.get( '/api/v1/users' )
              .end( ( err, response ) => {
                if ( err ) throw err;
                response.body.should.be.an( 'array' );
                response.body.should.not.have.deep.property( 'password' )
                response.body.should.not.have.deep.property( 'salt' );
              } )
            ] )
            .then( done )
            .catch( done );
        } )

      } )
      describe( "?", function () {
        it( 'takes query parameters', function ( done ) {
          authdAgent.get( '/api/v1/users?firstName=John&lastName=John' )
            .end( ( err, response ) => {
              if ( err ) return done( err );
              response.body.should.be.an( 'array' );
              response.body.should.have.property( '[0]firstName', 'John' )
              done();
            } )
        } )
      } )
    } )
    describe( '/composer', function () {;

      let bach = {
        firstName: "Johannes",
        lastName: "Bach"
      }
      describe( 'POST', function () {
        it( 'an admin can create a new composer', function ( done ) {
          adminAgent.post( '/api/v1/composer' )
            .send( JSON.stringify( bach ) )
            .expect( 201 )
            .end( ( err, response ) => {
              if ( err ) return done( err );
              let postBach = bach;
              postBach.id = response.body.id;
              response.body.should.deep.equal( postBach );
              done();
            } )
        } )
        it( 'an admin can create and associated through song/:songId/composer', function ( done ) {
          adminAgent.post( '/api/v1/song/1/composer' )
            .send( JSON.stringify( bach ) )
            .expect( 201 )
            .end( ( err, response ) => {
              if ( err ) return done( err );
              response.body[ 0 ].songs[ 0 ].id.should.equal( 1 );
              done();
            } )
        } )
      } )
      describe( '/:composerId', function () {
        describe( 'GET', function () {
          it( 'returns composer with specific id', function ( done ) {
            return Promise.all( [
                adminAgent.get( '/api/v1/composer/1' )
                .expect( 200 )
                .end( ( err, response ) => {
                  if ( err ) throw err;
                  response.body.id.should.equal( 1 );
                } ),
                guestAgent.get( '/api/v1/composer/2' )
                .expect( 200 )
                .end( ( err, response ) => {
                  if ( err ) throw err;
                  response.body.id.should.equal( 2 );
                } ),
                authdAgent.get( '/api/v1/composer/3' )
                .expect( 200 )
                .end( ( err, response ) => {
                  if ( err ) throw err;
                  response.body.id.should.equal( 3 );
                } )

              ] )
              .then( done )
              .catch( done );
          } )
        } )
        describe( 'DELETE', function () {
          it( 'admin can delete a composer', function ( done ) {
            adminAgent.delete( '/api/v1/composer/2' )
              .expect( 204 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                return adminAgent.get( '/api/v1/composer/2' )
                  .expect( 404 )
                  .end( done )
              } )
          } )
          it( 'non-admins cannot delete a composer', function ( done ) {
            guestAgent.delete( '/api/v1/composer/1' )
              .expect( 204 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                return adminAgent.get( '/api/v1/composer/2' )
                  .expect( 200 )
                  .end( done )
              } )
            authdAgent.delete( '/api/v1/composer/3' )
              .expect( 204 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                return adminAgent.get( '/api/v1/composer/2' )
                  .expect( 200 )
                  .end( done )
              } )
          } )
        } )
        describe( 'PUT', function () {
          it( 'admin can update a composer', function ( done ) {
            adminAgent.put( '/api/v1/composer/2' )
              .send( JSON.stringify( bach ) )
              .expect( 200 )
              .end( ( err, response ) => {
                if ( err ) return done( err );
                let putBach = bach;
                putBach.id = 2;
                response.body.should.deep.equal( putBach );
                done();
              } )
          } )
        } )
        it( 'non-admin cannot update a composer', function ( done ) {
          Promise.all( [
              guestAgent.put( '/api/v1/composer/3' )
              .send( JSON.stringify( bach ) )
              .expect( 401 )
              .end(),
              authdAgent.put( '/api/v1/composer/2' )
              .send( JSON.stringify( bach ) )
              .expect( 403 )
              .end()
            ] )
            .then( done )
            .catch( done );
        } )
      } )
    } )
  } )
  describe( '/composers', function () {;

    describe( 'GET', function () {
      it( 'returns a list of composers', function ( done ) {
        Promise.all( [
          adminAgent.get( '/api/v1/composers' )
          .expect( 200 )
          .end( ( err, response ) => {
            if ( err ) return done( err )
            return response.body.should.be.an( 'array' );
          } ),
          guestAgent.get( '/api/v1/composers' )
          .expect( 200 )
          .end( ( err, response ) => {
            if ( err ) return done( err )
            return response.body.should.be.an( 'array' );
          } ),
          authdAgent.get( '/api/v1/composers' )
          .expect( 200 )
          .end( ( err, response ) => {
            if ( err ) return done( err )
            return response.body.should.be.an( 'array' );
          } )
          .then( done )
          .catch( done )
        ] )
      } )
    } )
    describe( '?', function () {
      it( 'correctly handles query strings', function ( done ) {
        adminAgent.get( '/api/v1/composers?id=1' )
          .expect( 200 )
          .end( ( err, response ) => {
            if ( err ) return done( err )
            response.body.should.be.an( 'array' );
            response.body[ 0 ].id.should.equal( 1 );
            return true
          } )
        guestAgent.get( "/api/v1/composers?fullName=Ludwig+Van+Beethoven" )
      } )
    } )

  } )

  function pause(milliseconds) {
    console.log('waiting');
  	var dt = new Date();
  	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
    console.log('done waiting');
  }


  describe( '/cart', function () {

    let cart1 = {
      userId: 1,
      songs: [ {
        id: 1,
        quantity: 2
      }, {
        id: 5,
        quantity: 1
      } ]
    };
    let cart2 = {
      userId: 2,
      songs: [ {
        id: 2,
        quantity: 27
      } ]
    };
    let cart3 = {
      userId: 3,
      songs: [ {
        id: 3,
        quantity: 23
      }, {
        id: 6,
        quantity: 1
      }, {
        id: 7,
        quantity: 1
      } ]
    };


    xit( 'user can only use these routes for their own cart', function (  ) {
      authdAgent.get( '/api/v1/cart/2' )
        .send( cart2 )
        .expect( 403 )
    } )
    it( 'admin can use these routes for any cart', function (  ) {
      return Promise.all( [adminAgent.get( '/api/v1/cart/1' )
        .send( cart1 )
        .expect( 200 ),
      adminAgent.put( '/api/v1/cart/2' )
        .send( cart2 )
        .expect( 200 ),
      adminAgent.delete( '/api/v1/cart/3' )
        .send( cart3 )
        .expect( 204 ) ])
    } )
    it( 'POST /save saves the cart and returns the cart instance', function (  ) {
      return authdAgent.post( '/api/v1/cart/save' )
        .send( JSON.stringify( cart3 ) )
        .expect( 201 )
    } )
    it( 'PUT /:cartId updates the cart in the database', function (  ) {
      return authdAgent.put( '/api/v1/cart/1' )
        .send( JSON.stringify( cart1 ) )
        .expect( 200 )
    } )
    it( 'POST /add/song/:songId adds a specific song to the cart', function (  ) {
      return guestAgent.get( '/api/v1/cart/add/song/5' )
        .expect( 200 )
    } )
    it( 'DELETE /remove/song/:songId removes a specific song from the cart', function (  ) {
      return guestAgent.delete( '/api/v1/cart/delete/song/2' )
        .expect( 204 )
    } )
    it( 'DELETE /clear clears the current cart', function (  ) {
      return Promise.all( [ authdAgent.get( '/api/v1/cart/add/song/1' ),
          authdAgent.get( '/api/v1/cart/add/song/2' ),
          authdAgent.get( '/api/v1/cart/add/song/3' ),
          authdAgent.get( '/api/v1/cart/add/song/4' )
        ] )
        .then( () => authdAgent.delete( '/api/v1/cart/clear' )
          .expect( 204 ) )
        .then( response => response.body.songs.should.have.lengthOf( 0 ) )
        .catch( err )

    } )
  } );
  xdescribe( '/order', function () {
    let authdUserOrder1, authdUserOrder2, guestUserOrder1;
    beforeEach(function(done){
      let authdUserOrder1 = authd.createOrder({
        id: 1,
        songs: [
          { id: 1, quantity: 10},
          { id: 3, quantity: 1 }
        ]
      })
      let authdUserOrder2 = authd.createOrder({
        id: 2,
        songs: [
          { id: 2, quantity: 2 },
          { id: 5, quantity: 1 }
        ]
      })
      let guestUserOrder1 = guest.createOrder({
        id: 3,
        songs: [
          { id: 3, quantity: 1 }
        ]
      })
      let adminCreateOrderData = {
        id: 4,
        songs: [
          { id: 2, quantity: 4 },
          { id: 10, quantity: 3 }
        ]
      }
      let guestUserTrackedOrder = guest.createOrder({
        id: 5,
        songs: [
          {id: 4, quantity: 2 }
        ],
        trackingNumber: 123456789
      })
    });

    it( '/:orderId -- authorized user can only use these routes for their own account', function (  ) {
      return Promise.all( [
        authdAgent.get( '/api/v1/order/1' ).expect( 200 ),
        authdAgent.get( '/api/v1/order/3' ).expect( 403 )
      ])
    } )
    it( '/:orderId -- admin can use these routes for any account', function (  ) {
      return Promise.all([
        adminAgent.get( '/api/v1/order/1' ).expect( 200 ),
        adminAgent.get( '/api/v1/order/2' ).expect( 200 ),
        adminAgent.get( '/api/v1/order/3' ).expect( 200 ),
      ])
    } )
    describe( 'POST', function () {
      it( 'creates a new order', function ( done ) {
        return Promise.all([
          authdAgent.post( '/api/v1/order' ).expect( 201 ),
          guestAgent.post( '/api/v1/order' ).expect( 201 )
        ])
      } )
      it( 'admin can create order for another user', function (  ) {
        return adminAgent.post( '/api/v1/user/1/order' ).send( adminCreateOrderData ).expect( 201 );
      } )
    } )
    describe( '/:orderId/trackingNumber', function () {
      it( 'user or admin can generate or retrieve a tracking number for an order', function (  ) {
        return Promise.all([
          guestAgent.get( '/api/v1/order/3/trackingNumber' ).expect( 200 ),
          authdAgent.get( '/api/v1/order/1/trackingNumber' ).expect( 200 )
        ])
      } )
      it( 'user cannot retrieve tracking number associated with another user', function (  ) {
        return Promise.all([
          guestAgent.get( '/api/v1/order/1/trackingNumber' ).expect( 401 ),
          authdAgent.get( '/api/v1/order/3/trackingNumber' ).expect( 403 )
        ])
      } )
      it( 'admin can retrieve tracking number for any user', function ( done ) {
        return Promise.all([
          adminAgent.get( '/api/v1/order/1/trackingNumber' ).expect( 200 ),
          adminAgent.get( '/api/v1/order/3/trackingNumber' ).expect( 200 )
        ])
      } )
    } )
    describe( '/:orderId/trackingNumber/:trackingNumber', function () {
      it( 'anyone can get an order with a tracking number', function (  ) {
        return Promise.all([
          guestAgent.get( '/api/v1/order/trackingNumber/123456789' ).expect( 200 ),
          authdAgent.get( '/api/v1/order/trackingNumber/123456789' ).expect( 200 )
        ])
      } )
    } )

    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'an admin can get any order', function (  ) {
          return Promise.all([
            adminAgent.get( '/api/v1/order/1' ).expect( 200 ),
            adminAgent.get( '/api/v1/order/3' ).expect( 200 )
          ])
        } )
        it( 'an authorized user can get their own order', function (  ) {
          return authdAgent.get( '/api/v1/order/1' ).expect( 200 )
        } )
        it( 'an authorized user cannot get another user order', function (  ) {
          return authdAgent.get( '/api/v1/order/3' ).expect( 403 )
        } )
        it( 'a guest user cannot even see their own order history', function ( done ) {
          return Promise.all([
            guestAgent.get( '/api/v1/orders' ).expect( 401 ),
          guestAgent.get( '/api/v1/order/3' ).expect( 401 )])
        } )
      } )
      describe( 'DELETE', function () {
        it( 'an admin can delete any order', function (  ) {
            return adminAgent.delete( '/api/v1/order/1' ).expect( 204 )
          } )
          // by enabling paranoid mode we can prevent true destruction of orders. this would be important for auditing/accounting - we don't want to delete an order if a transaction has been successful, even if it doesn't show up in the user's own order history.
        it( 'orders are deleted VIRTUALLY but stay in the database', function ( done ) {
          adminAgent.delete( '/api/v1/order/2' ).expect( 204 )
        } )
        it( 'guests cannot delete orders', function ( done ) {
          guestAgent.delete( '/api/v1/order/3' ).expect( 401 )
        } )
        it( "authd users can VIRTUALLY delete their completed orders", function ( done ) {
          authdAgent.delete( '/api/v1/order/1' ).expect( 204 )
        } )
        it( "authd users can truly delete their incomplete orders", function ( done ) {
          authdAgent.delete( '/api/v1/order/5' ).expect( 204 )
        } )
      } )
      describe( 'PUT', function () {
        it( 'updates an order', function ( done ) {
          adminAgent.put( '/api/v1/order/2' ).expect( 200 )
        } )
      } )
    } )
  } );
  xdescribe( '/orders', function () {;

    describe( 'GET', function () {
      it( 'returns an array of all orders', function ( ) {
        adminAgent.get( '/api/v1/orders' ).expect( 200 )
      } )
      it( 'sanitized of user information', function ( done ) {
        guestAgent.get( '/api/v1/orders' ).expect( 200 )
        authdAgent.get( '/api/v1/orders' ).expect( 200 )
      } )
      it( 'can be nested as user/:userId/orders', function ( done ) {
        adminAgent.get( '/api/v1/user/2/orders' ).expect( 200 )
      } )
      it( "only returns a user's own orders if not admin", function ( done ) {
        authdAgent.get( '/api/v1/user/3/orders' ).expect( 403 )
        guestAgent.get( '/api/v1/user/1/orders' ).expect( 401 )
      } )
    } )
    describe( '?', function () {
      it( 'orders take query strings', function ( done ) {
        adminAgent.get( '/api/v1/orders?userId=1' ).expect( 200 )
      } )
    } )
  } );
  describe( '/songs', function () {;

    describe( 'GET', function () {
      it( 'retrieves a list of songs', function (  ) {
        return adminAgent.get( '/api/v1/songs' ).expect( 200 )
      } )
      it( 'sanitized for non-admins', function (  ) {
        return guestAgent.get( '/api/v1/songs' ).expect( 200 )
      } )
      it( 'sanitized for non-admins', function (  ) {
        return authdAgent.get( '/api/v1/songs' ).expect( 200 )
      } )
    } )
    describe( '?', function () {
      it( 'can take query parameters', function (  ) {
        return adminAgent.get( '/api/v1/songs?fullName=Ludwig+Van+Beethoven' ).expect( 200 )
      } )
    } )
  } );
  xdescribe( '/song', function () {;

    describe( 'POST', function () {
      it( 'admin-only', function (  ) {
        return Promise.all([
          adminAgent.post( '/api/v1/song' ),
        guestAgent.post( '/api/v1/song' ).expect( 401 ),
        authdAgent.post( '/api/v1/song' ).expect( 403 )])
      } )
      it( 'adds a song', function (  ) {
        return adminAgent.post( '/api/v1/song' )
      } )
    } )
    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'retrieves a specific song', function ( done ) {
          return Promise.all([
            adminAgent.get( '/api/v1/song/1' ).expect( 200 ),
            guestAgent.get( '/api/v1/song/2' ).expect( 200 ),
            authdAgent.get( '/api/v1/song/3' ).expect( 200 )
          ])
        } )
      } )
      describe( 'DELETE', function () {
        it( 'admin-only', function (  ) {
          return Promise.all([
            adminAgent.delete( '/api/v1/song/1' ).expect( 204),
            guestAgent.delete( '/api/v1/song/2' ).expect( 401 ),
            authdAgent.delete( '/api/v1/song/3' ).expect( 403 )
          ])
        } )
        it( 'deletes a specific song', function (  ) {
          return adminAgent.delete( '/api/v1/song/1' ).expect( 204 );
        } )
      } )
      describe( 'PUT', function () {
        it( 'admin-only', function (  ) {
          return Promise.all([
            adminAgent.put( '/api/v1/song/1' ).expect( 200 ),
            authdAgent.put( '/api/v1/song/2' ).expect( 403 ),
            guestAgent.put( '/api/v1/song/3' ).expect( 401 )
          ])
        } )
        it( 'updates a specific song', function (  ) {
          return adminAgent.put( '/api/v1/song/1' ).expect( 200 )
        } )
      } )
    } )
    describe( '/reviews', function () {;

      describe( 'GET', function () {
        it( 'returns a list of all reviews', function (  ) {
          return Promise.all([
            adminAgent.get( '/api/v1/reviews' ).expect( 200 ),
            guestAgent.get( '/api/v1/reviews' ).expect( 200 ),
            authdAgent.get( '/api/v1/reviews' ).expect( 200 )
          ])
        } )
        it( 'song/:songId/reviews retrieves a list of reviews for a specific song', function (  ) {
          return guestAgent.get( '/api/v1/song/1/reviews' ).expect( 200 )
        } )
      } )
      describe( '?', function () {
        it( 'correctly interprets query parameters', function (  ) {
          return guestAgent.get( '/api/v1/reviews?songTitle=circle+of+life' ).expect( 200 )
        } )
      } )
    } )
    describe( '/review', function () {;

      describe( 'POST', function () {
        let newReviewWithSongId = {
          songId: 3,
          description: "The Worst Ever!",
          rating: "1"
        }
        it( 'authenticated users can create for their own account', function (  ) {
          return authdAgent.post( '/api/v1/review' ).send( newReviewWithSongId ).expect( 201 );
        } )
        it( 'guest users cannot create', function (  ) {
          return guestAgent.post( '/api/v1/review' ).send( newReviewWithSongId ).expect( 401 )
        } )
        it( 'admin users can create on behalf of any user', function (  ) {
          newReviewWithSongId.userId = 3;
          return adminAgent.post( '/api/v1/review' ).send( newReviewWithSongId ).expect( 201 )
        } )
        it( 'creates a new review', function (  ) {
          return authdAgent.post( '/api/v1/review' ).send( newReviewWithSongId ).expect( 201 )
        } )
        let newReviewNoSongId = {
          description: "The Best Ever!",
          rating: "5"
        }
        it( '/song/:songId/review creates a new review for a specific song', function (  ) {
          return authdAgent.post( '/api/v1/song/3/review' ).send(newReviewNoSongId).expect( 201 )
        } )
        it( 'new reviews must be associated with a song if posted to the general route', function (  ) {
          return authdAgent.post( '/api/v1/review' ).send(newReviewNoSongId).expect( 400 )
        } );
      } )
      describe( '/:reviewId', function (  ) {
        describe( 'GET', function (  ) {
          it( 'retrieves a review, for any user', function (  ) {
            return Promise.all([
              adminAgent.get( '/api/v1/review/1' ).expect( 200 ),
              guestAgent.get( '/api/v1/review/2' ).expect( 200 ),
              authdAgent.get( '/api/v1/review/3' ).expect( 200 )

            ])
          } );
        } )
        describe( 'DELETE', function (  ) {
          it( 'deletes a review', function (  ) {
            adminAgent.delete( '/api/v1/review/3' )
          } )
          it( 'an authenticated user can delete their own review', function (  ) {
            authdAgent.delete( '/api/v1/review/1' ).expect( 204 )

          } )
          it( 'an admin can delete any review', function (  ) {
            adminAgent.delete( '/api/v1/review/1' )
          } );
          it( 'a user cannot delete the review of another user', function (  ) {
            authdAgent.delete( '/api/v1/reviw/3' ).expect( 403 );
          } )
          it( 'a guest cannot delte a review', function (  ) {
            guestAgent.delete( '/api/v1/review/3' ).expect( 401 )
          } )
        } )
        describe( 'PUT', function (  ) {
          it( 'updates a review', function (  ) {
            adminAgent.put( '/api/v1/review/1' ).expect( 200 )
          } )
          it( 'an authenticated user can update their own review', function (  ) {
            authdAgent.put( '/api/v1/review/1' ).expect( 200 )
          } )
          it( 'an admin can update any review', function (  ) {
            adminAgent.put( '/api/v1/review/2' ).expect( 200 )
          } );
          it( 'a user cannot update the review of another user', function (  ) {
            adminAgent.put( '/api/v1/review/3' )
          } )
        } )
      } )
    } )
  } );
  xdescribe( '/genre', function (  ) {;

    describe( 'POST', function (  ) {
      it( 'admins can create a genre', function (  ) {
        adminAgent.post( '/api/v1/genre' )
      } )
      it( 'admin-only', function (  ) {
        authdAgent.post( '/api/v1/genre' ).expect( 403 );
        guestAgent.post( '/api/v1/genre' ).expect( 401 )
      } );
    } )
    describe( '/:id', function (  ) {
      describe( 'GET', function (  ) {
        it( 'retrieves information about a specific genre including list of songs and composers', function (  ) {
          adminAgent.get( '/api/v1/genre/1' ).expect( 200 )
          authdAgent.get( '/api/v1/genre/2' ).expect( 200 )
          guestAgent.get( '/api/v1/genre/3' ).expect( 200 )
        } )
      } )
      describe( 'DELETE', function (  ) {
        it( 'deletes a genre', function (  ) {
          adminAgent.delete( '/api/v1/genre/1' )
        } )
        it( 'admin-only', function (  ) {
          authdAgent.delete( '/api/v1/genre/2' ).expect( 403 );
          guestAgent.delete( '/api/v1/genre/3' ).expect( 401 )
        } );
      } )
      describe( 'PUT', function (  ) {
        it( 'updates a genre', function (  ) {
          adminAgent.put( '/api/v1/genre/1' ).expect( 200 )
        } )
        it( 'admin-only', function (  ) {
          authdAgent.put( '/api/v1/genre/2' ).expect( 403 );
          guestAgent.put( '/api/v1/genre/3' ).expect( 401 )
        } );
      } )
    } )
  } );
  xdescribe( '/genres', function (  ) {;

    describe( 'GET', function (  ) {
      it( 'retrieves a list of all genres, accessible by all user roles', function (  ) {
        return Promise.all([
          adminAgent.get( '/api/v1/genres' ).expect( 200 ),
          authdAgent.get( '/api/v1/genres' ).expect( 200 ),
          guestAgent.get( '/api/v1/genres' ).expect( 200 )
        ])
      } );
    } )
    describe( '?', function (  ) {
      it( 'supports queries', function (  ) {
        return Promise.all([
          adminAgent.get( '/api/v1/genres?id=classical' ).expect( 200 ),
          adminAgent.get( '/api/v1/genres?id=Classical' ).expect( 200 )

        ])
      } )
    } )
  } )
} )
