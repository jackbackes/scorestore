app.controller('adminDashCtrl', function ($scope, SongsFactory) {

  SongsFactory.getSongs()
    .then(function (songs) {
      $scope.songs = songs;
    });

  $scope.getSongs = function () {
    SongsFactory.getSongs()
    .then(function (songs) {
      $scope.songs = songs;
    });
  };

  $scope.deleteSong = function (id) {
    SongsFactory.deleteSong(id)
    .then(function () {
      $scope.getSongs();
    });
  };

});

app.controller('songFormCtrl', function ($scope, OneSongFactory, SongsFactory, $stateParams) {
  $scope.updateOrCreate = function (song) {
    SongsFactory.createOrUpdateSong(song);
  };
  
  if ($stateParams.id) {
    OneSongFactory.fetchSong($stateParams.id)
    .then(function (song) {
      $scope.song = song;
    });
  } else {
    $scope.newSong = true;
  }
});
