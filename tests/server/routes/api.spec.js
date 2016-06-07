// Instantiate all models
var expect = require( 'chai' )
  .expect;

var Sequelize = require( 'sequelize' );
var dbURI = 'postgres://localhost:5432/testing-fsg';
// var db = new Sequelize( dbURI, {
//   logging: false
// } );
// require( '../../../server/db/models/user' )( db );
var supertest = require( 'supertest' );


describe( '/api/v1', function () {
  var app, User;

  beforeEach( 'Sync DB', function () {
    return db.sync( {
      force: true
    } );
  } );

  beforeEach( 'Create app', function () {
    app = require( '../../../server/app' )( db );
    User = db.model( 'user' );
  } );

  beforeEach( 'Create admin agent', function () {
    adminAgent         = supertest.agent( app );
    guestAgent         = supertest.agent( app );
    authenticatedAgent = supertest.agent( app );
  } );

  describe( '/user', function () {
    describe( 'POST', function () {
      it( 'creates a new user and returns user data', function () {
        throw 'not working'
      } )
    } )
    describe( '/:userId', function () {
      describe( 'GET', function () {
        it( 'returns a user with the specified id', function () {
          throw 'not working'
        } )
      } )
      describe( 'DELETE', function () {
        it( 'admin can delete a user with the specified id', function () {
          throw 'not working'
        } )
        it( 'a user can delete their own account' )
        it( "a user cannot delete another user's account" )
      } )
      describe( 'PUT', function () {
        it( 'admin can update a user with the specified id', function () {
          throw 'not working'
        } )
        it( 'a user can update their own account' )
      } )
    } )
  } )
  describe( '/users', function () {
    describe( "GET", function () {
      it( 'returns a list of all users', function () {
        throw 'not working'
      } )

    } )
    describe( "?", function () {
      it( 'takes query parameters', function () {
        throw 'not working'
      } )
    } )
  } )
  describe( '/composer', function () {
    describe( 'POST', function () {
      it( 'an admin can creates a new composer', function () {
        throw 'not working'
      } )
      it( 'an admin can create and associated through song/:songId/composer' )
    } )
    describe( '/:composerId', function () {
      describe( 'GET', function () {
        it( 'returns composer with specific id', function () {
          throw 'not working'
        } )
      } )
      describe( 'DELETE', function () {
        it( 'admin can delete a composer', function () {
          throw 'not working'
        } )
      } )
      describe( 'PUT', function () {
        it( 'admin can update a composer', function () {
          throw 'not working'
        } )
      } )
    } )
  } )
  describe( '/composers', function () {
    describe( 'GET', function () {
      it( 'returns a list of composers', function () {
        throw 'not working'
      } )
    } )
    describe( '?', function () {
      it( 'correctly handles query strings', function () {
        throw 'not working'
      } )
    } )
  } )
  describe( '/cart', function () {
    it( 'user can only use these routes for their own cart' )
    it( 'admin can use these routes for any cart' )
    it( 'POST /save saves the cart and returns the cart instance' )
    it( 'PUT /:cartId updates the cart in the database' )
    it( 'POST /add/song/:songId adds a specific song to the cart' )
    it( 'DELETE /remove/song/:songId removes a specific song from the cart' )
    it( 'DELETE /clear clears the current cart' )
    it( 'GET /:cartId returns data for a specific cart' )
  })
  describe( '/order', function () {
    it( 'user can only use these routes for their own account' )
    it( 'admin can use these routes for any account' )
    describe( 'POST', function () {
      it( 'creates a new order', function () {
        throw 'not working'
      } )
    } )
    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'works', function () {
          throw 'not working'
        } )
      } )
      describe( 'DELETE', function () {
        it( 'works', function () {
          throw 'not working'
        } )
      } )
      describe( 'PUT', function () {
        it( 'works', function () {
          throw 'not working'
        } )
      } )
    } )
  } )
  describe( '/orders', function () {
    describe( 'GET', function () {
      it( 'returns an array of all orders', function () {
        throw 'not working'
      } )
      it( 'can be nested as user/:userId/orders' )
      it( "only returns a user's own orders if not admin" )
    } )
    describe( '?', function () {
      it( 'works', function () {
        throw 'not working'
      } )
    } )
  } )
  describe( '/songs', function () {
    describe( 'GET', function () {
      it( 'retrieves a list of songs', function () {
        throw 'not working'
      } )
    } )
    describe( '?', function () {
      it( 'can take query parameters', function () {
        throw 'not working'
      } )
    } )
  } )
  describe( '/song', function () {
    describe( 'POST', function () {
      it( 'admin-only' )
      it( 'adds a song', function () {
        throw 'not working'
      } )
    } )
    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'retrieves a specific song', function () {
          throw 'not working'
        } )
      } )
      describe( 'DELETE', function () {
        it( 'admin-only' )
        it( 'deletes a specific song', function () {
          throw 'not working'
        } )
      } )
      describe( 'PUT', function () {
        it( 'admin-only' )
        it( 'updates a specific song', function () {
          throw 'not working'
        } )
      } )
    } )
    describe( '/reviews', function () {
      describe( 'GET', function () {
        it( 'returns a list of all reviews', function () {
          throw 'not working'
        } )
        it( 'song/:songId/reviews retrieves a list of reviews for a specific song' )
      } )
      describe( '?', function () {
        it( 'correctly interprets query parameters', function () {
          throw 'not working'
        } )
      } )
    } )
    describe( '/review', function () {
      describe( 'POST', function () {
        it( 'authenticated users can create for their own account' )
        it( 'guest users cannot create' )
        it( 'admin users can create on behalf of any user' )
        it( 'creates a new review', function () {
          throw 'not working'
        } )
        it( '/song/:songId/review creates a new review for a specific song' )
        it( 'new reviews must be associated with a song' );
      } )
      describe( '/:reviewId', function () {
        describe( 'GET', function () {
          it( 'works for everyone' );
          it( 'retrieves a review', function () {
            throw 'not working'
          } )
        } )
        describe( 'DELETE', function () {
          it( 'deletes a review', function () {
            throw 'not working'
          } )
          it( 'an authenticated user can delete their own review' )
          it( 'an admin can delete any review' );
          it( 'a user cannot delete the review of another user' )
        } )
        describe( 'PUT', function () {
          it( 'updates a review', function () {
            throw 'not working'
          } )
          it( 'an authenticated user can update their own review' )
          it( 'an admin can update any review' );
          it( 'a user cannot update the review of another user' )
        } )
      } )
    } )
  } )
  describe( '/genre', function () {
    describe( 'POST', function () {
      it( 'creates a genre', function () {
        throw 'not working'
      } )
      it( 'admin-only' );
    } )
    describe( '/:id', function () {
      describe( 'GET', function () {
        it( 'retrieves information about a specific genre including list of songs and composers', function () {
          throw 'not working'
        } )
        describe( '?', function () {
          it( 'supports queries' )
        })
      } )
      describe( 'DELETE', function () {
        it( 'deletes a genre', function () {
          throw 'not working'
        } )
        it( 'admin-only' );
      } )
      describe( 'PUT', function () {
        it( 'updates a genre', function () {
          throw 'not working'
        } )
        it( 'admin-only' );
      } )
    } )
  } )
  describe( '/genres', function () {
    it( 'works for all users' );
    describe( 'GET', function () {
      it( 'retrieves a list of all genres', function () {
        throw 'not working'
      } )
    } )
    describe( '?', function () {
      it( 'supports queries', function () {
        throw 'not working'
      } )
    } )
  } )
} )
