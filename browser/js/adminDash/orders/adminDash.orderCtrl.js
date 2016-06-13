app.controller('adminDashOrdersCtrl', function ($scope, OrdersFactory) {


  OrdersFactory.getOrders()
    .then(function (orders) {
      $scope.orders = orders;
    });

  $scope.getOrders = function () {
    OrdersFactory.getOrders()
    .then(function (orders) {
      $scope.orders = orders;
    });
  };

  $scope.deleteOrder = function (id) {
    OrdersFactory.deleteOrder(id)
    .then(function () {
      $scope.getOrders();
    });
  };

});

app.controller('orderFormCtrl', function ($scope, OrdersFactory, $stateParams, $state) {
  $scope.updateOrCreate = function (order) {
    OrdersFactory.createOrUpdateOrder(order)
    .then(function () {
      $state.go('adminDash.orders');
    });
  };

  if ($stateParams.id) {
    OrdersFactory.fetchOrder($stateParams.id)
    .then(function (order) {
      $scope.order = order;
    });
  } else {
    $scope.newOrder = true;
  }
});
