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
  })

  .state('adminDash.orders', {
    url: '/orders',
    templateUrl: 'js/adminDash/orders/adminDash.orders.html',
    controller: 'adminDashOrdersCtrl'
  })

  .state('orderForm', {
    url: '/orderForm/:id',
    templateUrl: 'js/adminDash/orders/adminDash.orderForm.html',
    controller: 'orderFormCtrl',
    resolve: {
      theOrder: function($stateParams, OrdersFactory) {
        return OrdersFactory.fetchOrder($stateParams.id);
      }
    }
  });
});