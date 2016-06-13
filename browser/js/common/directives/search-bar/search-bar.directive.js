app.directive( 'searchBar', function ( $rootScope, AuthService, AUTH_EVENTS, $state ) {

  return {
    controller: 'TypeaheadCtrl',
    template: searchBarTemplate
  }
} );

app.controller( 'TypeaheadCtrl', function ( $scope, $http ) {

  var _selected;

  $scope.selected = undefined;

  $scope.goToSelection = function()

  // Any function returning a promise object can be used to load values asynchronously
  $scope.getSongs = function ( searchQuery ) {
    console.log(searchQuery);
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
    $scope.getSongs( customSelected ).then( songs => $scope.songs = songs );
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

  $scope.selectOption = function(item, model, label){
    console.log('selected',item, model, label)
    thisScope.selected = item;
  }


} );

let searchBarTemplate = `
<div class="row" >
    <!-- /.col-lg-6 -->
    <div class="col-lg-6">
        <div class="input-group">
            <h4>Custom templates for results</h4>
            <pre>Model: {{selected | json}}</pre>
            <input type="text" ng-model="queryString" placeholder="Custom template" uib-typeahead="song as song.name for song in songs" typeahead-on-select="selectOption($item, $model, $label)"  typeahead-template-url="/js/common/directives/search-bar/typeahead-template.html" class="form-control" typeahead-show-hint="true"
                typeahead-min-length="0" ng-keyUp = "updateSongs(queryString)" >
            <span class="input-group-btn">
      </span>
        </div>
        <!-- /input-group -->
    </div>
    <!-- /.col-lg-6 -->
</div>
<!-- /.row -->
`
