describe( 'Unit testing search bar', function () {
  var $compile,
    $rootScope,
    $httpBackend

  // Load the myApp module, which contains the directive
  beforeEach( module( 'FullstackGeneratedApp' ) );

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach( 'get tools', inject( function ( _$compile_, _$rootScope_, _$httpBackend_ ) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
  } ) );
  beforeEach( 'expect getting the main state', function () {
    $httpBackend.whenGET('js/home/home.html').respond();
    $httpBackend.whenGET( '/api/v1/songs' )
      .respond( [ {
        id: 1,
        title: "We Are The Champions"
      } ] );
  } );
  let scope, element;
  beforeEach( 'compile the search bar', function () {
    // Compile a piece of HTML containing the directive
    element = $compile( "<search-bar></search-bar>" )( $rootScope );
    // fire all the watches
    $rootScope.$digest();
    $httpBackend.flush();
  } );
  // beforeEach( 'flush preparatory requests', function() {
  //   $httpBackend.flush();
  // })
  afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
  });
  it( 'Replaces the element with the appropriate content', function () {
    // Check that the compiled element contains the templated content
    element.html().should.contain( `<div class="input-group">` );
    //$httpBackend.flush();
  } );
  describe('scope functions', function(){
    it( 'has a getSongs function', function () {
      element.scope().should.have.property( 'getSongs' );
      //$httpBackend.flush();
    } );
    it( 'getSongs gets songs', function(){
      let uri = new RegExp(/\/api\/v1\/songs\/s./)
      $httpBackend.expectGET( uri );
      $httpBackend.whenGET( uri )
        .respond( [ {
          id: 2,
          title: "All of Me"
        } ] );
      element.scope().getSongs("All").then( result => {
        result.should.be.an.array;
        result.should.have.lengthOf( 1 );
        result[0].title.should.equal( "All of Me" );
      });

      $httpBackend.flush();
    })
    it( 'has an updateSongs function', function () {
      element.scope().should.have.property( 'getSongs' );
    } );

  })
} );
