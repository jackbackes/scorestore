app.config(function ($stateProvider) {
  $stateProvider.state('adminDash', {
    url: '/adminDash',
    templateUrl: 'js/adminDash/adminDash.html'
  })

  .state('adminDash.songs', {
    url: '/songs',
    templateUrl: 'js/adminDash/song/adminDash.songs.html',
    controller: 'adminDashSongsCtrl'
  })

  .state('songForm', {
    url: '/songForm/:id',
    templateUrl: 'js/adminDash/song/adminDash.songForm.html',
    controller: 'songFormCtrl'
  })

  .state('adminDash.users', {
    url: '/users',
    templateUrl: 'js/adminDash/users/adminDash.users.html',
    controller: 'adminDashUsersCtrl'
  })

  .state('userForm', {
    url: '/userForm/:id',
    templateUrl: 'js/adminDash/users/adminDash.userForm.html',
    controller: 'userFormCtrl'
  });
});