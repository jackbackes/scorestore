'use strict';
// Instantiate all models
var expect = require( 'chai' )
  .expect;
var should = require('chai').should();

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
var supertest = require( 'supertest' );


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
    adminAgent = supertest.agent( app );
    guestAgent = supertest.agent( app );
    authdAgent = supertest.agent( app );
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
  }

  beforeEach( 'Create admin and authd users', function ( done ) {
    let authd = User.create( authdInfo ).then( done ).catch( done );
    let admin = User.create( adminInfo ).then( done ).catch( done );
    return Promise.all( authd, admin );
  } );

  describe( '/user', function () {
    describe( 'POST', function () {
      it( 'creates a new user and returns user data', function ( done ) {
        let manualUser   = { firstName: "Ima", lastName: "ManualUser", email: "manual@user.com", password: "blingBlang", isAdmin: true }
        let guestRegister = { firstName: "Guest", lastName: "McGuesterson", email: "iama@guest.com", password: "blingBlang", isAdmin: false }
        let newUserInfo = { firstName: "Flim", lastName: "Flam", email: "flim@flam.com", password: "blingBlang", isAdmin: false }
        let guestRequest = guestAgent.post('/api/v1/user').send( guestRegister ).expect(201)
                                     .end( (err, response) => {
                                       if(err) return done(err);
                                       response.body.should.be.an( 'object' );
                                       response.should.have.deep.property( 'fullName', "Guest McGuesterson" );
                                       response.should.not.have.deep.property('isGuest');
                                       done();
                                     })
        let adminRequest = adminAgent.post('/api/v1/user').send( manualUser ).expect(201).end( (err, response) => {
          if(err) return done(err);
          response.body.should.be.an( 'object' );
          response.should.have.deep.property("fullName").that.equals( "Ima ManualUser" );
          response.should.have.deep.property("email").that.equals( "manual@user.com" );
          response.should.have.deep.property("isAdmin").that.is.a.boolean.that.equals(true);
          done();
        })
        let authdRequest = authdAgent.post('/api/v1/user').send( newUserInfo ).expect(401).end( ( err, response ) => {
          if(err) return done(err);
          response.body.should.not.have.any.keys('firstName','lastName','fullName','password');
          done();
      } )
    } )
    describe( '/:userId', function () {
      describe( 'GET', function () {
        it( 'returns a user with the specified id', function ( done ) {
          guestAgent.get( '/api/v1/user/1 ')
        } )
        it( 'the results are sanitized if the user is not an admin' , function () {
          guestAgent.get( '/api/v1/user/1 ')
        })
        it( 'admins see unsanitized results ', function () {
          adminAgent.get( '/api/v1/user/1')
        })
        it( 'users can see unsanitized results for their own account', function () {
          authdAgent.get( '/api/v1/user/1')
        })
      } )
      describe( 'DELETE', function () {
        it( 'admin can delete a user with the specified id', function () {
          adminAgent.delete( '/api/v1/user/3')
        } )
        it( 'an authorized user can delete their own account', function () {
          authdAgent.delete( '/api/v1/user/1' )
        } )
        it( "a user cannot delete another user's account", function () {
          authdAgent.delete( '/api/v1/user/3' )
          guestAgent.delete( '/api/v1/user/1 ')
        } )
      } )
      describe( 'PUT', function () {
        it( 'admin can update a user with the specified id', function () {
          adminAgent.put( '/api/v1/user/1' )
        } )
        it( 'a user can update their own account', function () {
          authdAgent.put( '/api/v1/user/1' )
        } )
        it( 'a guest user cannot update their own account', function() {
          guestAgent.put( '/api/v1/user/3' )
        })
        it( "a user cannot update someone else's account", function () {
          authdAgent.put(  '/api/v1/user/2' )
          guestAgent.put( '/api/v1/user/1' )
        })
      } )
    } )
  } )
  describe( '/users', function () {
    describe( "GET", function () {
      it( 'returns a list of all users', function () {
        adminAgent.get( '/api/v1/users' )
        guestAgent.get( '/api/v1/users' )
        authdAgent.get( '/api/v1/users' )
      } )

    } )
    describe( "?", function () {
      it( 'takes query parameters', function () {
        authdAgent.get( '/api/v1/users?firstName=John&lastName=John')
      } )
    } )
  } )
  describe( '/composer', function () {
    describe( 'POST', function () {
      it( 'an admin can create a new composer', function () {
        adminAgent.post('/api/v1/composer')
      } )
      it( 'an admin can create and associated through song/:songId/composer', function () {
        adminAgent.post('/api/v1/song/1/composer')
      } )
    } )
    describe( '/:composerId', function () {
      describe( 'GET', function () {
        it( 'returns composer with specific id', function () {
          adminAgent.get('/api/v1/composer/1')
          guestAgent.get('/api/v1/composer/2')
          authdAgent.get('/api/v1/composer/3')
        } )
      } )
      describe( 'DELETE', function () {
        it( 'admin can delete a composer', function () {
          adminAgent.delete('/api/v1/composer/2')
        } )
        it( 'non-admins cannot delete a composer', function () {
          guestAgent.delete('/api/v1/composer/1')
          authdAgent.delete('/api/v1/composer/3')
        })
      } )
      describe( 'PUT', function () {
        it( 'admin can update a composer', function () {
          adminAgent.put( '/api/v1/composer/2')
        } )
        it( 'non-admin cannot update a composer', function () {
          guestAgent.put( '/api/v1/composer/3')
          authdAgent.put( '/api/v1/composer/2')
        })
      } )
    } )
  } )
  describe( '/composers', function () {
    describe( 'GET', function () {
      it( 'returns a list of composers', function () {
        adminAgent.get('/api/v1/composers')
        guestAgent.get('/api/v1/composers')
        authdAgent.get('/api/v1/composers')
      } )
    } )
    describe( '?', function () {
      it( 'correctly handles query strings', function () {
        adminAgent.get('/api/v1/composers?id=1')
        guestAgent.get("/api/v1/composers?fullName=Ludwig+Van+Beethoven")
      } )
    } )
  } )
  describe( '/cart', function () {
    let cart1 = [{}];
    let cart2 = [{}];
    let cart3 = [{}];


    it( 'user can only use these routes for their own cart', function () {
      authdAgent.get('/api/v1/cart/2')
    } )
    it( 'admin can use these routes for any cart', function () {
      adminAgent.get('/api/v1/cart/1')
      adminAgent.put('/api/v1/cart/2').send(cart2)
      adminAgent.delete('/api/v1/cart/3')
    } )
    it( 'POST /save saves the cart and returns the cart instance', function () {
      authdAgent.post('/api/v1/cart/save').send(cart3)
    } )
    it( 'PUT /:cartId updates the cart in the database', function () {
      authdAgent.put('/api/v1/cart/1').send(cart1)
    } )
    it( 'POST /add/song/:songId adds a specific song to the cart', function () {
      guestAgent.post('/api/v1/cart/add/song/5')
    } )
    it( 'DELETE /remove/song/:songId removes a specific song from the cart', function () {
      guestAgent.delete( '/api/v1/cart/delete/song/2')
    } )
    it( 'DELETE /clear clears the current cart', function () {
      authdAgent.delete( '/api/v1/cart/clear' )
    } )
  })
  describe( '/order', function () {
    it( '/:orderId -- authorized user can only use these routes for their own account', function () {
      authdAgent.get('/api/v1/order/1')
      authdAgent.get('/api/v1/order/3')
    } )
    it( '/:orderId -- admin can use these routes for any account', function () {
      adminAgent.get('/api/v1/order/1')
    } )
    describe( 'POST', function () {
      it( 'creates a new order', function () {
        authdAgent.post('/api/v1/order')
        guestAgent.post('/api/v1/order')
      } )
      it( 'admin can create order for another user', function () {
        adminAgent.post('/api/v1/user/1/order')
      } )
    } )
    describe( '/:orderId/trackingNumber', function () {
      it( 'user or admin can generate or retrieve a tracking number for an order', function () {
        guestAgent.get('/api/v1/order/3/trackingNumber')
        authdAgent.get('/api/v1/order/1/trackingNumber')
      })
      it( 'user cannot retrieve tracking number associated with another user', function () {
        guestAgent.get('/api/v1/order/1/trackingNumber')
        authdAgent.get('/api/v1/order/3/trackingNumber')
      })
      it( 'admin can retrieve tracking number for any user', function () {
        adminAgent.get('/api/v1/order/1/trackingNumber')
        adminAgent.get('/api/v1/order/3/trackingNumber')
      })
    })
    describe( '/:orderId/trackingNumber/:trackingNumber', function () {
      it( 'anyone can get an order with a tracking number', function () {
        guestAgent.get('/api/v1/order/trackingNumber/123456789')
        authdAgent.get('/api/v1/order/trackingNumber/123456789')
      })
    })
    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'an admin can get any order', function () {
          adminAgent.get('/api/v1/order/1')
          adminAgent.get('/api/v1/order/3')
        } )
        it( 'an authorized user can get their own order', function () {
          authdAgent.get('/api/v1/order/1' )
        })
        it( 'an authorized user cannot get another user order', function () {
          authdAgent.get( '/api/v1/order/3' )
        })
        it( 'a guest user cannot even see their own order history', function () {
          guestAgent.get( '/api/v1/orders' )
          guestAgent.get( '/api/v1/order/3' )
        } )
      } )
      describe( 'DELETE', function () {
        it( 'an admin can delete any order', function () {
          adminAgent.delete( '/api/v1/order/1' )
        } )
        // by enabling paranoid mode we can prevent true destruction of orders. this would be important for auditing/accounting - we don't want to delete an order if a transaction has been successful, even if it doesn't show up in the user's own order history.
        it( 'orders are deleted VIRTUALLY but stay in the database', function () {
          adminAgent.delete( '/api/v1/order/2' )
        })
        it( 'guests cannot delete orders', function () {
          guestAgent.delete( '/api/v1/order/3' )
        } )
        it( "authd users can VIRTUALLY delete their completed orders", function () {
          authdAgent.delete( '/api/v1/order/1' )
        } )
        it( "authd users can truly delete their incomplete orders", function () {
          authdAgent.delete( '/api/v1/order/5' )
        } )
      } )
      describe( 'PUT', function () {
        it( 'works', function () {
          adminAgent.put( '/api/v1/order/2' )
        } )
      } )
    } )
  } )
  describe( '/orders', function () {
    describe( 'GET', function () {
      it( 'returns an array of all orders', function () {
        adminAgent.get( '/api/v1/orders' )
      } )
      it( 'sanitized of user information', function () {
        guestAgent.get( '/api/v1/orders' )
        authdAgent.get( '/api/v1/orders' )
      } )
      it( 'can be nested as user/:userId/orders', function () {
        adminAgent.get( '/api/v1/user/2/orders' )
      } )
      it( "only returns a user's own orders if not admin", function () {
        authdAgent.get( '/api/v1/user/1/orders')
        authdAgent.get( '/api/v1/user/3/orders')
      } )
    } )
    describe( '?', function () {
      it( 'orders take query strings', function () {
        adminAgent.get( '/api/v1/orders?userId=1' )
      } )
    } )
  } )
  describe( '/songs', function () {
    describe( 'GET', function () {
      it( 'retrieves a list of songs', function () {
        adminAgent.get( '/api/v1/songs')
      } )
      it( 'sanitized for non-admins', function () {
        guestAgent.get( '/api/v1/songs' )
        authdAgent.get( '/api/v1/songs' )
      })
    } )
    describe( '?', function () {
      it( 'can take query parameters', function () {
        adminAgent.get( '/api/v1/songs?fullName=Ludwig+Van+Beethoven')
      } )
    } )
  } )
  describe( '/song', function () {
    describe( 'POST', function () {
      it( 'admin-only', function () {
        adminAgent.post( '/api/v1/song' )
        guestAgent.post( '/api/v1/song' )
        authdAgent.post( '/api/v1/song' )
      } )
      it( 'adds a song', function () {
        adminAgent.post( '/api/v1/song' )
      } )
    } )
    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'retrieves a specific song', function () {
          adminAgent.get( '/api/v1/song/1' )
          guestAgent.get( '/api/v1/song/2' )
          authdAgent.get( '/api/v1/song/3' )
        } )
      } )
      describe( 'DELETE', function () {
        it( 'admin-only', function () {
          adminAgent.delete( '/api/v1/song/1' )
          guestAgent.delete( '/api/v1/song/2' )
          authdAgent.delete( '/api/v1/song/3' )
        } )
        it( 'deletes a specific song', function () {
          adminAgent.delete( '/api/v1/song/1' )
        } )
      } )
      describe( 'PUT', function () {
        it( 'admin-only', function () {
          adminAgent.put( '/api/v1/song/1' )
          authdAgent.put( '/api/v1/song/2' )
          guestAgent.put( '/api/v1/song/3' )
        } )
        it( 'updates a specific song', function () {
          adminAgent.put( '/api/v1/song/1' )
        } )
      } )
    } )
    describe( '/reviews', function () {
      describe( 'GET', function () {
        it( 'returns a list of all reviews', function () {
          adminAgent.get( '/api/v1/reviews' )
          guestAgent.get( '/api/v1/reviews' )
          authdAgent.get( '/api/v1/reviews' )        } )
        it( 'song/:songId/reviews retrieves a list of reviews for a specific song', function () {
          guestAgent.get( '/api/v1/song/1/reviews')
        } )
      } )
      describe( '?', function () {
        it( 'correctly interprets query parameters', function () {
          guestAgent.get( '/api/v1/reviews?songTitle=circle+of+life')
        } )
      } )
    } )
    describe( '/review', function () {
      describe( 'POST', function () {
        it( 'authenticated users can create for their own account', function () {
          authdAgent.post( '/api/v1/review' )
        } )
        it( 'guest users cannot create', function () {
          guestAgent.post( '/api/v1/review' )
        } )
        it( 'admin users can create on behalf of any user', function () {
          adminAgent.post( '/api/v1/review' )
        } )
        it( 'creates a new review', function () {
          authdAgent.post( '/api/v1/review' )
        } )
        it( '/song/:songId/review creates a new review for a specific song', function () {
          adminAgent
        } )
        it( 'new reviews must be associated with a song', function () {
          authdAgent.post( '/api/v1/review' )
        } );
      } )
      describe( '/:reviewId', function () {
        describe( 'GET', function () {
          it( 'retrieves a review, for any user', function () {
            adminAgent.get( '/api/v1/review/1' )
            guestAgent.get( '/api/v1/review/2' )
            authdAgent.get( '/api/v1/review/3' )
          } );
        } )
        describe( 'DELETE', function () {
          it( 'deletes a review', function () {
            adminAgent.delete( '/api/v1/review/3' )
          } )
          it( 'an authenticated user can delete their own review', function () {
            authdAgent.delete( '/api/v1/review/1' )

          } )
          it( 'an admin can delete any review', function () {
            adminAgent.delete( '/api/v1/review/1' )
          } );
          it( 'a user cannot delete the review of another user', function () {
            authdAgent.delete( '/api/v1/reviw/3' )
          } )
          it( 'a guest cannot delte a review', function () {
            guestAgent.delete( '/api/v1/review/3')
          } )
        } )
        describe( 'PUT', function () {
          it( 'updates a review', function () {
            adminAgent.put( '/api/v1/review/1' )
          } )
          it( 'an authenticated user can update their own review', function () {
            authdAgent.put( '/api/v1/review/1' )
          } )
          it( 'an admin can update any review', function () {
            adminAgent.put( '/api/v1/review/2' )
          } );
          it( 'a user cannot update the review of another user', function () {
            adminAgent.put( '/api/v1/review/3' )
          } )
        } )
      } )
    } )
  } )
  describe( '/genre', function () {
    describe( 'POST', function () {
      it( 'admins can create a genre', function () {
        adminAgent.post('/api/v1/genre')
      } )
      it( 'admin-only', function () {
        authdAgent.post( '/api/v1/genre' )
        guestAgent.post( '/api/v1/genre' )
      } );
    } )
    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'retrieves information about a specific genre including list of songs and composers', function () {
          adminAgent.get( '/api/v1/genre/1' )
          authdAgent.get( '/api/v1/genre/2' )
          guestAgent.get( '/api/v1/genre/3' )
        } )
      } )
      describe( 'DELETE', function () {
        it( 'deletes a genre', function () {
          adminAgent.delete( '/api/v1/genre/1' )
        } )
        it( 'admin-only', function () {
          authdAgent.delete( '/api/v1/genre/2' )
          guestAgent.delete( '/api/v1/genre/3' )
        } );
      } )
      describe( 'PUT', function () {
        it( 'updates a genre', function () {
          adminAgent.put( '/api/v1/genre/1' )
        } )
        it( 'admin-only', function () {
          authdAgent.put( '/api/v1/genre/2' )
          guestAgent.put( '/api/v1/genre/3' )
        } );
      } )
    } )
  } )
  describe( '/genres', function () {
    describe( 'GET', function () {
      it( 'retrieves a list of all genres, accessible by all user roles', function () {
        adminAgent.get( '/api/v1/genres' )
        authdAgent.get( '/api/v1/genres' )
        guestAgent.get( '/api/v1/genres' )
      } );
    } )
    describe( '?', function () {
      it( 'supports queries', function () {
        adminAgent.get( '/api/v1/genres?id=classical')
        adminAgent.get( '/api/v1/genres?id=Classical')
      } )
    } )
  } )
} )
} )
