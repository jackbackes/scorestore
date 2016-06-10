app.config(function ($stateProvider) {
  $stateProvider.state('adminDash', {
    url: '/adminDash',
    templateUrl: 'js/adminDash/adminDash.html'
  })

  .state('adminDash.songs', {
    url: '/songs',
    templateUrl: 'js/adminDash/adminDash.songs.html',
    controller: 'adminDashCtrl'
  })

  .state('songForm', {
    url: '/songForm',
    templateUrl: 'js/adminDash/adminDash.songForm.html'
  });
});