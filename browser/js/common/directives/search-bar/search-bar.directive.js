app.directive( 'searchBar', function ( $rootScope, AuthService, AUTH_EVENTS, $state ) {
  return {
    controller: 'TypeaheadCtrl',
    template: searchBarTemplate
  }
} );

app.controller( 'TypeaheadCtrl', function ( $scope, $http, $state, $rootScope ) {

  // $rootScope.$on( "$routeChangeSuccess", function ( event, currentRoute, previousRoute ) {
  //   window.scrollTo( 0, 0 );
  // } );

  var _selected;

  $scope.selected = undefined;

  // $scope.goToSelection = function ( songId ) {
  //   console.log('going to selection', $scope.selected.id);
  //   $state.go( 'oneSong', {
  //     songId: $scope.selected.id
  //   } )
  // };

  // Any function returning a promise object can be used to load values asynchronously
  $scope.getSongs = function ( searchQuery ) {
    console.log( searchQuery );
    let config = {
      params: {
        where: {
          title: {
            like: '%' + searchQuery + '%'
          }
        }
      }
    }
    return searchQuery ? $http.get( '/api/v1/songs/s', config )
      .then( response => response.data ) : [];
  };

  $scope.updateSongs = function ( customSelected ) {
    $scope.getSongs( customSelected )
      .then( songs => $scope.songs = songs );
  }

  $scope.ngModelOptionsSelected = function ( value ) {
    if ( arguments.length ) {
      _selected = value;
    } else {
      return _selected;
    }
  };

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };
  let thisScope = $scope;

  $scope.selectOption = function ( item, model, label ) {
    console.log( 'selected', item, model, label )
    $state.go( 'oneSong', {
      songId: item.id
    } )
  }


} );

let searchBarTemplate = `
        <div class="input-group">
            <input
              type="text"
              ng-model="queryString"
              placeholder="...search for a song"
              uib-typeahead="song as song.title for song in songs"
              typeahead-on-select="selectOption($item, $model, $label)"
              typeahead-template-url="/js/common/directives/search-bar/typeahead-template.html" class="form-control" typeahead-show-hint="true"
              typeahead-min-length="0"
              ng-keyUp = "updateSongs(queryString)" >
            </input>
            <span class="input-group-btn">
            </span>
        </div>
`
