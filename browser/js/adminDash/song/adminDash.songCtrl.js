app.controller('adminDashSongsCtrl', function ($scope, SongsFactory, growl) {

  var errorFunc = function(error) { growl.error(error)};
  
  SongsFactory.getSongs()
    .then(function (songs) {
      $scope.songs = songs;
    })
    .catch(errorFunc)

  $scope.getSongs = function () {
    SongsFactory.getSongs()
    .then(function (songs) {
      $scope.songs = songs;
    })
    .catch(errorFunc)
  };

  $scope.deleteSong = function (id) {
    SongsFactory.deleteSong(id)
    .then(function () {
      $scope.getSongs();
    })
    .catch(errorFunc)

  };

});

app.controller('songFormCtrl', function ($scope, OneSongFactory, SongsFactory, growl, $stateParams, $state) {
  var errorFunc = function(error) { growl.error(error)};

  $scope.updateOrCreate = function (song, composer, genre) {
    SongsFactory.createOrUpdateSong(song, composer, genre)
    .then(function () {
      $state.go('adminDash.songs');
    })
    .catch(errorFunc);
  };
  
  if ($stateParams.id) {
    OneSongFactory.fetchSong($stateParams.id)
    .then(function (song) {
      $scope.song = song;
    })
    .catch(errorFunc)
  } else {
    $scope.newSong = true;
  }
});
