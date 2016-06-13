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

  
});

app.controller('orderFormCtrl', function ($scope, CartFactory, OrdersFactory, theOrder, $state) {
  // $scope.updateOrCreate = function (order) {
  //   OrdersFactory.createOrUpdateOrder(order)
  //   .then(function () {
  //     $state.go('adminDash.orders');
  //   });
  // };

  $scope.order = theOrder;
  var statusInventory = ['Created', 'Processing', 'Cancelled', 'Completed']


  $scope.updateAddress = function(address, order) {
      CartFactory.updateAddress(address, order)
      .then(function (data) {
        $scope.editAddress = false;
        $scope.editing = false;
      });
  };

  $scope.markAsShipped = function(id) {
    OrdersFactory.markAsShipped(id)
    .then(function(data) {
      $scope.status = data;
    });
  };

  $scope.deleteOrder = function (id) {
    OrdersFactory.deleteOrder(id)
    .then(function () {
      $state.go('adminDash.orders');
    });
  };

   $scope.markAsDelivered = function(id) {
    OrdersFactory.markAsDelivered(id)
    .then(function(data) {
      $scope.status = data
    });
  };
});
