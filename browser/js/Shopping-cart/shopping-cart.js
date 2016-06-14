app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/Shopping-cart/shopping-cart.html',
        controller: 'cartCtrl'
    });
});

app.controller('cartCtrl', function ($scope, CartFactory) {
  CartFactory.getCart()
  .then(function(data) {
    $scope.cart = data || null;
  });
});