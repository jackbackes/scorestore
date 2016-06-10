app.controller('adminDashCtrl', function ($scope, SongsFactory) {
  SongsFactory.getSongs()
  .then(function (songs) {
    $scope.songs = songs;
  });


});