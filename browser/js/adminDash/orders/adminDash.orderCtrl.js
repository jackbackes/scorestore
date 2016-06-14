app.controller('adminDashOrdersCtrl', function ($scope, growl, OrdersFactory) {


  OrdersFactory.getOrders()
    .then(function (orders) {
      $scope.orders = orders;
    })
    .catch(function(error) {
      growl.error(error)
    });

  $scope.getOrders = function () {
    OrdersFactory.getOrders()
    .then(function (orders) {
      $scope.orders = orders;
    });
  };

  
});

app.controller('orderFormCtrl', function ($scope, CartFactory, OrdersFactory, $stateParams, growl, $state) {

   var errorFunc = function(error) { growl.error(error)}
   var statusFunc = function(data) { $scope.status = data}
   OrdersFactory.fetchOrder($stateParams.id)
   .then(function(data) {
      $scope.order = data;
   })
   .catch(errorFunc)

  $scope.markAsShipped = function(id) {
    OrdersFactory.markAsShipped(id)
    .then(statusFunc)
    .catch(errorFunc);
  };

  $scope.markAsDelivered = function(id) {
    OrdersFactory.markAsDelivered(id)
    .then(statusFunc)
    .catch(errorFunc);
  };

  $scope.markAsCancelled = function(id) {
    OrdersFactory.markAsCancelled(id)
    .then(statusFunc)
    .catch(errorFunc);
  };

  $scope.deleteOrder = function (id) {
    OrdersFactory.deleteOrder(id)
    .then(function () {
      $state.go('adminDash.orders');
    })
    .catch(errorFunc);
  };

  // Save for implementing admin updating address functionality
  // $scope.updateAddress = function(address, order) {
  //     CartFactory.updateAddress(address, order)
  //     .then(function (data) {
  //       $scope.editAddress = false;
  //       $scope.editing = false;
  //     });
  // };
});
