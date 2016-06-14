'use strict';
/**
 * The API Spec route tests should comprehensively test the data api.
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
process.env.NODE_ENV = 'testing';
var db = require('../../../server/db');

// require( '../../../server/db/models/user' )( db );
// require( '../../../server/db/models/song' )( db );
// require( '../../../server/db/models/composer' )( db );
// require( '../../../server/db/models/genre' )( db );
// require( '../../../server/db/models/address' )( db );
// require( '../../../server/db/models/review' )( db );

var adminAgent, guestAgent, authdAgent;
var app;
let User, Song, Composer, Genre, Address, Review;

describe( '/api/v1', function () {

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
    return User.create( adminInfo ).then( () => adminAgent.post( '/login' ).send( adminInfo ) )
  } );

  beforeEach( 'Create authd user and login', function () {
    return User.create( authdInfo )
      .then( () => authdAgent.post( '/login' )
        .send( authdInfo ) )
  } )

  // beforeEach( 'pause', function () {
  //   pause( 1000 );
  // } )

  function pause( milliseconds ) {
    var dt = new Date();
    while ( ( new Date() ) - dt <= milliseconds ) { /* Do nothing */ }
  }

  describe( '/user', function () {
    describe( 'POST', function () {
      it( 'creates a new user and returns user data', function () {
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
        return Promise.all( [
          guestAgent.post( '/api/v1/users' )
          .send( JSON.stringify( guestRegister ) )
          .expect( 201 )
          .then( response => {
            response.body.should.be.an( 'object' );
            response.should.have.deep.property( 'fullName', "Guest McGuesterson" );
            response.should.not.have.deep.property( 'isGuest' );
          } ),
          adminAgent.post( '/api/v1/users' )
          .send( JSON.stringify( manualUser ) )
          .expect( 201 )
          .then( response => {
            response.body.should.be.an( 'object' );
            response.should.have.deep.property( "fullName" )
              .that.equals( "Ima ManualUser" );
            response.should.have.deep.property( "email" )
              .that.equals( "manual@user.com" );
            response.should.have.deep.property( "isAdmin" )
              .that.is.a.boolean.that.equals( true );
          } ),
          authdAgent.post( '/api/v1/users' )
          .send( JSON.stringify( newUserInfo ) )
          .expect( 401 )
          .then( response => {
            response.body.should.not.have.any.keys( 'firstName', 'lastName', 'fullName', 'password' );
          } )
        ] )
      } )
      describe( '/:userId', function () {
        describe( 'GET', function () {
          it( 'returns a user with the specified id', function () {
            return guestAgent.get( '/api/v1/users/1 ' )
              .expect( 200 )
              .then( response => {

                response.body.should.have.all.keys( 'firstName', 'lastName', 'fullName', 'id', 'reviews' );
              } )
          } )
          it( 'the results are sanitized if the user is not an admin', function () {
            return guestAgent.get( '/api/v1/users/1 ' )
              .expect( 200 )
              .then( response => {

                response.body.should.not.have.any.keys( 'password', 'salt', 'isAdmin', 'isGuest', 'email', 'orders', 'addresses' );
              } )
          } )
          it( 'admins see unsanitized results ', function () {
            return adminAgent.get( '/api/v1/users/1' )
              .expect( 200 )
              .then( response => {

                response.body.should.have.all.keys( 'password', 'isAdmin', 'isGuest', 'email' );
                response.body.should.not.have.any.keys( 'salt' )
              } )
            it( 'result should have an array of orders', function () {
              return adminAgent.get( '/api/v1/users/1' )
                .expect( 200 )
                .then( response => {

                  response.body.orders.should.be.an( 'array' );
                } )
            } )
            it( 'users can see unsanitized results for their own account', function () {
              return authdAgent.get( '/api/v1/users/1' )
                .expect( 200 )
                .then( response => {

                  response.body.should.have.all.keys( 'password', 'isAdmin', 'isGuest', 'email' );
                  response.body.should.not.have.any.keys( 'salt' )
                } )
            } )
          } )
          describe( 'DELETE', function () {
            it( 'admin can delete a user with the specified id', function () {
              return adminAgent.delete( '/api/v1/users/3' )
                .expect( 204 )
                .then( response => {

                  adminAgent.get( '/api/v1/users/3' )
                    .expect( 404 )
                } )
            } )
            it( 'an authorized user can delete their own account', function () {
              return authdAgent.delete( '/api/v1/users/1' )
                .expect( 204 )
                .then( response => {

                  return adminAgent.get( '/api/v1/users/1' )
                    .expect( 404 )
                } )
            } )
            it( "a user cannot delete another user's account", function () {
              return Promise.all( [
                authdAgent.delete( '/api/v1/users/3' )
                .expect( 403 ),
                guestAgent.delete( '/api/v1/users/1 ' )
                .expect( 401 )
              ] )

            } )
          } )
          describe( 'PUT', function () {
            let patchUser1 = {
              firstName: "Jeffey"
            }
            it( 'admin can update a user with the specified id (acts as patch, not replace)', function () {
              return adminAgent.put( '/api/v1/users/1' )
                .send( JSON.stringify( patchUser1 ) )
                .expect( 200 )
                .then( response => adminAgent.get( '/api/v1/users/1' ) )
                .then( response => {
                                      response.body.firstName.should.equal( patchUser1.firstName );
                                      response.body.lastName.should.equal( authdInfo.lastName );
                                      return undefined;
                                    } )
            } )
            it( 'a user can update their own account', function () {
              return authdAgent.put( '/api/v1/users/1' )
                .send( JSON.stringify( patchUser1 ) )
                .expect( 200 )
                .then( response => {

                  adminAgent.get( '/api/v1/users/1' )
                    .then( response => {

                      response.body.firstName.should.equal( patchUser1.firstName );
                      response.body.lastName.should.equal( authdInfo.lastName );
                    } )
                } )
            } )
            it( 'a guest user cannot update their own account', function () {
              return guestAgent.put( '/api/v1/users/3' )
                .send( JSON.stringify( patchUser1 ) )
                .expect( 401 )
            } )
            it( "a user cannot update someone else's account", function () {
              return Promise.all( [
                authdAgent.put( '/api/v1/users/2' )
                .send( JSON.stringify( patchUser1 ) )
                .expect( 403 ),
                guestAgent.put( '/api/v1/users/1' )
                .send( JSON.stringify( patchUser1 ) )
                .expect( 401 )
              ] )
            } )
          } )
        } )
      } )
    } )
    describe( '/users', function () {
      describe( "GET", function () {
        it( 'returns a list of all users', function () {
          return Promise.all( [
            adminAgent.get( '/api/v1/users' )
            .then( response => {
              response.body.should.be.an( 'array' );
              response.body.should.not.have.deep.property( 'salt' );
            } ),
            guestAgent.get( '/api/v1/users' )
            .then( response => {
              response.body.should.be.an( 'array' );
              response.body.should.not.have.deep.property( 'password' );
              response.body.should.not.have.deep.property( 'salt' );
            } ),
            authdAgent.get( '/api/v1/users' )
            .then( response => {
              response.body.should.be.an( 'array' );
              response.body.should.not.have.deep.property( 'password' )
              response.body.should.not.have.deep.property( 'salt' );
            } )
          ] );
        } )

      } )
      describe( "?", function () {
        it( 'takes query parameters', function () {

          return authdAgent.get( '/api/v1/users?firstName=John&lastName=John' )
            .then( response => {

              response.body.should.be.an( 'array' );
              // response.body.should.have.property( '[0]firstName', 'John' )
            } )
        } )
      } )
    } )
  } );
    describe( '/composer', function () {
      let bach = {
        firstName: "Johannes",
        lastName: "Bach"
      }
      describe( 'POST', function () {
        xit( 'an admin can create a new composer', function () {

          return adminAgent.post( '/api/v1/composer' )
            .send( bach )
            .expect( 201 )
            .then( response => {

              // let postBach = bach;
              // postBach.id = response.body.id;
              // response.body.should.deep.equal( postBach );
            } )
        } )
        it( 'an admin can create and associated through song/:songId/composer', function () {

          return adminAgent.post( '/api/v1/song/1/composer' )
            .send( JSON.stringify( bach ) )
            .expect( 201 )
            .then( ( response ) => {
              response.body[ 0 ].songs[ 0 ].id.should.equal( 1 );
            } )
            .catch( err => err )
        } )
      } )
      describe( '/:composerId', function () {
          describe( 'GET', function () {
            it( 'returns composer with specific id', function () {

              return Promise.all( [
                adminAgent.get( '/api/v1/composer/1' )
                .expect( 200 )
                .then( response => {

                  response.body.id.should.equal( 1 );
                } ),
                guestAgent.get( '/api/v1/composer/2' )
                .expect( 200 )
                .then( response => {

                  response.body.id.should.equal( 2 );
                } ),
                authdAgent.get( '/api/v1/composer/3' )
                .expect( 200 )
                .then( response => {

                  response.body.id.should.equal( 3 );
                } )
              ] )
            } )
          } )
          describe( 'DELETE', function () {
            it( 'admin can delete a composer', function () {

              return adminAgent.delete( '/api/v1/composer/2' )
                .expect( 204 )
                .then( response => {

                  return adminAgent.get( '/api/v1/composer/2' )
                    .expect( 404 )
                } )
            } )
            it( 'non-admins cannot delete a composer', function () {

              return Promise.all( [
                guestAgent.delete( '/api/v1/composer/1' )
                .expect( 204 )
                .then( response => {

                  return adminAgent.get( '/api/v1/composer/2' )
                    .expect( 200 )
                } ),
                authdAgent.delete( '/api/v1/composer/3' )
                .expect( 204 )
                .then( response => {

                  return adminAgent.get( '/api/v1/composer/2' )
                    .expect( 200 )
                } )
              ] )
            } )
          } )
          describe( 'PUT', function () {
            it( 'admin can update a composer', function () {

              return adminAgent.put( '/api/v1/composer/2' )
                .send( bach )
                .expect( 200 )
                .then( response => {

                  let putBach = bach;
                  putBach.id = 2;
                  response.body.should.deep.equal( putBach );
                } )
            } )
          } )
          it( 'non-admin cannot update a composer', function () {

              return Promise.all( [
                  guestAgent.put( '/api/v1/composer/3' )
                  .send( JSON.stringify( bach ) )
                  .expect( 401 ),
                  authdAgent.put( '/api/v1/composer/2' )
                  .send( JSON.stringify( bach ) )
                  .expect( 403 )
                ] ) //close promise
            } ) //close it statement
        } ) //close composerId describe
    } )
  describe( '/composers', function () {
    describe( 'GET', function () {
      it( 'returns a list of composers', function () {
        return Promise.all( [
          adminAgent.get( '/api/v1/composers' )
          .expect( 200 )
          .then( response => {
            if ( err ) throw err
            return response.body.should.be.an( 'array' );
          } ),
          guestAgent.get( '/api/v1/composers' )
          .expect( 200 )
          .then( response => {
            if ( err ) throw err
            return response.body.should.be.an( 'array' );
          } ),
          authdAgent.get( '/api/v1/composers' )
          .expect( 200 )
          .then( response => {
            if ( err ) throw err
            return response.body.should.be.an( 'array' );
          } )
        ] )
      } )
    } )
    describe( '?', function () {
      it( 'correctly handles query strings', function () {
        return Promise.all( [
          adminAgent.get( '/api/v1/composers?id=1' )
          .expect( 200 )
          .then( response => {
            if ( err ) throw err
            response.body.should.be.an( 'array' );
            response.body[ 0 ].id.should.equal( 1 );
            return true
          } ),
          guestAgent.get( "/api/v1/composers?fullName=Ludwig+Van+Beethoven" )
        ] )
      } )
    } )
  } )


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
    it( 'user can only use these routes for their own cart', function () {
      return authdAgent.get( '/api/v1/cart/2' )
        .send( cart2 )
        .expect( 403 )
    } )
    it( 'admin can use these routes for any cart', function () {
      return Promise.all( [ adminAgent.get( '/api/v1/cart/1' )
        .send( cart1 )
        .expect( 200 ),
        adminAgent.put( '/api/v1/cart/2' )
        .send( cart2 )
        .expect( 200 ),
        adminAgent.delete( '/api/v1/cart/3' )
        .send( cart3 )
        .expect( 204 )
      ] )
    } )
    it( 'POST /save saves the cart and returns the cart instance', function () {
      return authdAgent.post( '/api/v1/cart/save' )
        .send( JSON.stringify( cart3 ) )
        .expect( 201 )
    } )
    it( 'PUT /:cartId updates the cart in the database', function () {
      return authdAgent.put( '/api/v1/cart/1' )
        .send( JSON.stringify( cart1 ) )
        .expect( 200 )
    } )
    it( 'POST /add/song/:songId adds a specific song to the cart', function () {
      return guestAgent.get( '/api/v1/cart/add/song/5' )
        .expect( 200 )
    } )
    it( 'DELETE /remove/song/:songId removes a specific song from the cart', function () {
      return guestAgent.delete( '/api/v1/cart/delete/song/2' )
        .expect( 204 )
    } )
    it( 'DELETE /clear clears the current cart', function () {
      return Promise.all( [
          authdAgent.get( '/api/v1/cart/add/song/1' ),
          authdAgent.get( '/api/v1/cart/add/song/2' ),
          authdAgent.get( '/api/v1/cart/add/song/3' ),
          authdAgent.get( '/api/v1/cart/add/song/4' )
        ] )
        .then( () => authdAgent.delete( '/api/v1/cart/clear' )
          .expect( 204 ) )
        .then( response => response.body.songs.should.have.lengthOf( 0 ) )
    } )
  } );
  xdescribe( '/order', function () {
    let authdUserOrder1, authdUserOrder2, guestUserOrder1, adminCreateOrderData, guestUserTrackedOrder
    beforeEach( function () {
      let guest = User.findById( 3 )
      let authd = User.findById( 1 )
      return Promise.all( [authd, guest] ).then( results => {
        let authdUser = results[0], guestUser = results[1];
        console.log(authdUser, guestUser);
        authdUserOrder1 = authdUser.createOrder( {
          id: 1,
          songs: [ {
            id: 1,
            quantity: 10
          }, {
            id: 3,
            quantity: 1
          } ]
        } )
        authdUserOrder2 = authdUser.createOrder( {
          id: 2,
          songs: [ {
            id: 2,
            quantity: 2
          }, {
            id: 5,
            quantity: 1
          } ]
        } )
        guestUserOrder1 = guestUser.createOrder( {
          id: 3,
          songs: [ {
            id: 3,
            quantity: 1
          } ]
        } )
        adminCreateOrderData = {
          id: 4,
          songs: [ {
            id: 2,
            quantity: 4
          }, {
            id: 10,
            quantity: 3
          } ]
        }
        guestUserTrackedOrder = guestUser.createOrder( {
          id: 5,
          songs: [ {
            id: 4,
            quantity: 2
          } ],
          trackingNumber: 123456789
        } )

      })

    } );

    it( '/:orderId -- authorized user can only use these routes for their own account', function () {
      return Promise.all( [
        authdAgent.get( '/api/v1/order/1' )
        .expect( 200 ),
        authdAgent.get( '/api/v1/order/3' )
        .expect( 403 )
      ] )
    } )
    it( '/:orderId -- admin can use these routes for any account', function () {
      return Promise.all( [
        adminAgent.get( '/api/v1/order/1' )
        .expect( 200 ),
        adminAgent.get( '/api/v1/order/2' )
        .expect( 200 ),
        adminAgent.get( '/api/v1/order/3' )
        .expect( 200 ),
      ] )
    } )
    describe( 'POST', function () {
      it( 'creates a new order', function () {
        return Promise.all( [
          authdAgent.post( '/api/v1/order' )
          .expect( 201 ),
          guestAgent.post( '/api/v1/order' )
          .expect( 201 )
        ] )
      } )
      it( 'admin can create order for another user', function () {
        return adminAgent.post( '/api/v1/user/1/order' )
          .send( adminCreateOrderData )
          .expect( 201 );
      } )
    } )
    describe( '/:orderId/shipment', function() {
      describe( 'POST', function() {
        it('ships the order')
        it('uses a third party API for shipment(like easypost.com)')
        it('tracks shipping history')
        it('supports multiple parcels: tracks multiple parcels')
        it('self route for authd user')
        it('admin route for any user')
        it('only stores an id for the shipment in the local database')
      })
      describe( 'GET', function() {
        it('gets the shipment history for the order')
        it('supports query parameters')
        it('provides a tracking number that can be used on the website of the carrier')
      })

    })
    describe( '/:orderId/confirmation-number', function () {
      it( 'user or admin can generate or retrieve a tracking number for an order', function () {
        return Promise.all( [
          guestAgent.get( '/api/v1/order/3/trackingNumber' )
          .expect( 200 ),
          authdAgent.get( '/api/v1/order/1/trackingNumber' )
          .expect( 200 )
        ] )
      } )
      it( 'user cannot retrieve tracking number associated with another user', function () {
        return Promise.all( [
          guestAgent.get( '/api/v1/order/1/trackingNumber' )
          .expect( 401 ),
          authdAgent.get( '/api/v1/order/3/trackingNumber' )
          .expect( 403 )
        ] )
      } )
      it( 'admin can retrieve tracking number for any user', function () {
        return Promise.all( [
          adminAgent.get( '/api/v1/order/1/trackingNumber' )
          .expect( 200 ),
          adminAgent.get( '/api/v1/order/3/trackingNumber' )
          .expect( 200 )
        ] )
      } )
    } )
    describe( '/:orderId/trackingNumber/:trackingNumber', function () {
      it( 'anyone can get an order with a tracking number', function () {
        return Promise.all( [
          guestAgent.get( '/api/v1/order/trackingNumber/123456789' )
          .expect( 200 ),
          authdAgent.get( '/api/v1/order/trackingNumber/123456789' )
          .expect( 200 )
        ] )
      } )
    } )

    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'an admin can get any order', function () {
          return Promise.all( [
            adminAgent.get( '/api/v1/order/1' )
            .expect( 200 ),
            adminAgent.get( '/api/v1/order/3' )
            .expect( 200 )
          ] )
        } )
        it( 'an authorized user can get their own order', function () {
          return authdAgent.get( '/api/v1/order/1' )
            .expect( 200 )
        } )
        it( 'an authorized user cannot get another user order', function () {
          return authdAgent.get( '/api/v1/order/3' )
            .expect( 403 )
        } )
        it( 'a guest user cannot even see their own order history', function () {
          return Promise.all( [
            guestAgent.get( '/api/v1/orders' )
            .expect( 401 ),
            guestAgent.get( '/api/v1/order/3' )
            .expect( 401 )
          ] )
        } )
      } )
      describe( 'DELETE', function () {
        it( 'an admin can delete any order', function () {
            return adminAgent.delete( '/api/v1/order/1' )
              .expect( 204 )
          } )
        xit( 'an admin can restore an order')
          // by enabling paranoid mode we can prevent true destruction of orders. this would be important for auditing/accounting - we don't want to delete an order if a transaction has been successful, even if it doesn't show up in the user's own order history.
        it( 'orders are deleted VIRTUALLY but stay in the database', function () {
          return adminAgent.delete( '/api/v1/order/2' )
            .expect( 204 )
        } );
        it( 'guests cannot delete orders', function () {
          return guestAgent.delete( '/api/v1/order/3' )
            .expect( 401 )
        } );
        it( "authd users can VIRTUALLY delete their completed orders", function () {
          return authdAgent.delete( '/api/v1/order/1' )
            .expect( 204 )
        } )
        it( "authd users can truly delete their incomplete orders", function () {
          return authdAgent.delete( '/api/v1/order/5' )
            .expect( 204 )
        } )
      } )
      describe( 'PUT', function () {
        it( 'updates an order', function () {
          return adminAgent.put( '/api/v1/order/2' )
            .expect( 200 )
        } )
      } )
    } )
  } );
  describe( '/orders', function () {
    describe( 'GET', function () {
      it( 'returns an array of all orders', function () {
        return adminAgent.get( '/api/v1/orders' )
          .expect( 200 )
      } )
      it( 'sanitized of user information', function () {
        return Promise.all( [
          guestAgent.get( '/api/v1/orders' )
          .expect( 200 ),
          authdAgent.get( '/api/v1/orders' )
          .expect( 200 )
        ] )
      } )
      it( 'can be nested as user/:userId/orders', function () {
        adminAgent.get( '/api/v1/user/2/orders' )
          .expect( 200 )
      } )
      it( "only returns a user's own orders if not admin", function () {
        authdAgent.get( '/api/v1/user/3/orders' )
          .expect( 403 )
        guestAgent.get( '/api/v1/user/1/orders' )
          .expect( 401 )
      } )
    } )
    describe( '?', function () {
      it( 'orders take query strings', function () {
        adminAgent.get( '/api/v1/orders?userId=1' )
          .expect( 200 )
      } )
    } )
  } );
  describe( '/songs', function () {

    describe( 'GET', function () {
      it( 'retrieves a list of songs', function () {
        return adminAgent.get( '/api/v1/songs' )
          .expect( 200 )
      } )
      it( 'sanitized for non-admins', function () {
        return guestAgent.get( '/api/v1/songs' )
          .expect( 200 )
      } )
      it( 'sanitized for non-admins', function () {
        return authdAgent.get( '/api/v1/songs' )
          .expect( 200 )
      } )
    } )
    describe( '?', function () {
      it( 'can take query parameters', function () {
        // return adminAgent.get( '/api/v1/songs?fullName=Ludwig+Van+Beethoven' )
        //   .expect( 200 );
        return adminAgent.get( '/api/v1/songs?yearComposed=1971' )
          .expect( 200 );
      } );
    } );
    describe( 'POST', function () {
      it( 'admin-only', function () {
        return Promise.all( [
          adminAgent.post( '/api/v1/songs' )
          .expect( 201 ),
          guestAgent.post( '/api/v1/songs' )
          .expect( 401 ),
          authdAgent.post( '/api/v1/songs' )
          .expect( 403 )
        ] )
      } )
      it( 'adds a song', function () {
        return adminAgent.post( '/api/v1/songs' )
      } )
    } )



    describe( '/reviews', function () {

      describe( 'GET', function () {
        it( 'returns a list of all reviews', function () {
          return Promise.all( [
            adminAgent.get( '/api/v1/reviews' )
            .expect( 200 ),
            guestAgent.get( '/api/v1/reviews' )
            .expect( 200 ),
            authdAgent.get( '/api/v1/reviews' )
            .expect( 200 )
          ] )
        } )
        it( 'song/:songId/reviews retrieves a list of reviews for a specific song', function () {
          return guestAgent.get( '/api/v1/song/1/reviews' )
            .expect( 200 )
        } )
      } )
      describe( '?', function () {
        it( 'correctly interprets query parameters', function () {
          return guestAgent.get( '/api/v1/reviews?songTitle=circle+of+life' )
            .expect( 200 )
        } )
      } )
    } )
    describe( '/review', function () {

      describe( 'POST', function () {
        let newReviewWithSongId = {
          songId: 3,
          description: "The Worst Ever!",
          rating: "1"
        }
        it( 'authenticated users can create for their own account', function () {
          return authdAgent.post( '/api/v1/review' )
            .send( newReviewWithSongId )
            .expect( 201 );
        } )
        it( 'guest users cannot create', function () {
          return guestAgent.post( '/api/v1/review' )
            .send( newReviewWithSongId )
            .expect( 401 )
        } )
        it( 'admin users can create on behalf of any user', function () {
          newReviewWithSongId.userId = 3;
          return adminAgent.post( '/api/v1/review' )
            .send( newReviewWithSongId )
            .expect( 201 )
        } )
        it( 'creates a new review', function () {
          return authdAgent.post( '/api/v1/review' )
            .send( newReviewWithSongId )
            .expect( 201 )
        } )
        let newReviewNoSongId = {
          description: "The Best Ever!",
          rating: "5"
        }
        it( '/song/:songId/review creates a new review for a specific song', function () {
          return authdAgent.post( '/api/v1/song/3/review' )
            .send( newReviewNoSongId )
            .expect( 201 )
        } )
        it( 'new reviews must be associated with a song if posted to the general route', function () {
          return authdAgent.post( '/api/v1/review' )
            .send( newReviewNoSongId )
            .expect( 400 )
        } );
      } )
      describe( '/:reviewId', function () {
        describe( 'GET', function () {
          it( 'retrieves a review, for any user', function () {
            return Promise.all( [
              adminAgent.get( '/api/v1/review/1' )
              .expect( 200 ),
              guestAgent.get( '/api/v1/review/2' )
              .expect( 200 ),
              authdAgent.get( '/api/v1/review/3' )
              .expect( 200 )
            ] )
          } );
        } );
        describe( 'DELETE', function () {
          it( 'deletes a review', function () {
            return adminAgent.delete( '/api/v1/review/3' )
              .expect( 204 )
          } )
          it( 'an authenticated user can delete their own review', function () {
            return authdAgent.delete( '/api/v1/review/1' )
              .expect( 204 )
          } )
          it( 'an admin can delete any review', function () {
            return adminAgent.delete( '/api/v1/review/1' )
              .expect( 204 );
          } );
          it( 'a user cannot delete the review of another user', function () {
            return authdAgent.delete( '/api/v1/reviw/3' )
              .expect( 403 );
          } )
          it( 'a guest cannot delte a review', function () {
            return guestAgent.delete( '/api/v1/review/3' )
              .expect( 401 )
          } )
        } );
        describe( 'PUT', function () {
          it( 'updates a review', function () {
            return adminAgent.put( '/api/v1/review/1' )
              .expect( 200 )
          } )
          it( 'an authenticated user can update their own review', function () {
            return authdAgent.put( '/api/v1/review/1' )
              .expect( 200 )
          } )
          it( 'an admin can update any review', function () {
            return adminAgent.put( '/api/v1/review/2' )
              .expect( 200 )
          } );
          it( 'a user cannot update the review of another user', function () {
            return authdAgent.put( '/api/v1/review/3' )
              .expect( 403 )
          } )
        } )
      } )
    } )

  });

  describe( '/genre', function () {

    describe( 'POST', function () {
      it( 'admins can create a genre', function () {
        return adminAgent.post( '/api/v1/genre' )
      } )
      it( 'admin-only', function () {
        return Promise.all( [
          authdAgent.post( '/api/v1/genre' )
          .expect( 403 ),
          guestAgent.post( '/api/v1/genre' )
          .expect( 401 )
        ] )
      } );
    } )
    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'retrieves information about a specific genre including list of songs and composers', function () {
          return Promise.all( [
            adminAgent.get( '/api/v1/genre/1' )
            .expect( 200 ),
            authdAgent.get( '/api/v1/genre/2' )
            .expect( 200 ),
            guestAgent.get( '/api/v1/genre/3' )
            .expect( 200 )
          ] )
        } )
      } )
      describe( 'DELETE', function () {
        it( 'deletes a genre', function () {
          return adminAgent.delete( '/api/v1/genre/1' )
        } )
        it( 'admin-only', function () {
          return Promise.all( [
            authdAgent.delete( '/api/v1/genre/2' )
            .expect( 403 ),
            guestAgent.delete( '/api/v1/genre/3' )
            .expect( 401 )
          ] )
        } );
      } )
      describe( 'PUT', function () {
        it( 'updates a genre', function () {
          return adminAgent.put( '/api/v1/genre/1' )
            .expect( 200 )
        } )
        it( 'admin-only', function () {
          return Promise.all( [
            authdAgent.put( '/api/v1/genre/2' )
            .expect( 403 ),
            guestAgent.put( '/api/v1/genre/3' )
            .expect( 401 )
          ] )
        } );
      } )
    } )
  } );
  describe( '/genres', function () {

    describe( 'GET', function () {
      it( 'retrieves a list of all genres, accessible by all user roles', function () {
        return Promise.all( [
          adminAgent.get( '/api/v1/genres' )
          .expect( 200 ),
          authdAgent.get( '/api/v1/genres' )
          .expect( 200 ),
          guestAgent.get( '/api/v1/genres' )
          .expect( 200 )
        ] )
      } );
    } )
    describe( '?', function () {
      it( 'supports queries', function () {
        return Promise.all( [
          adminAgent.get( '/api/v1/genres?id=classical' )
          .expect( 200 ),
          adminAgent.get( '/api/v1/genres?id=Classical' )
          .expect( 200 )
        ] )
      } )
    } )
  } )

})
