app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/Shopping-Cart/shopping-cart.html',
        controller: 'cartCtrl'
    });
});

app.controller('cartCtrl', function ($scope, CartFactory) {

  CartFactory.getCart()
  .then(function(data) {
    $scope.cart = data || null;
  });

  $scope.removeFromCart = function(item) {
    return CartFactory.removeFromCart(item)
  };

  $scope.getCartTotal = function () {
     return CartFactory.getCartTotal();
  };

  $scope.inventory = [1,2,3,4,5,6,7,8,9,10];

  $scope.updateCart = function(song, quantity) {
        CartFactory.updateCart(song, quantity)
        .then(function(response) {
            $scope.cart = response;
            $scope.getCartTotal();
        });
    };

});