app.config(function ($stateProvider) {
    $stateProvider.state('order', {
        url: '/order',
        templateUrl: 'js/order/order.html',
        controller: 'OrderCtrl'
    });
});

app.controller('OrderCtrl', function ($scope, Session, $state, OrderFactory, CartFactory) {

	$scope.session = Session;

	CartFactory.getCart()
	.then(function(data) {
		$scope.cart = data;
	});

	CartFactory.getAddress()
	  .then(function(data) {
	  	console.log('data', data)
	    $scope.shippingAddress = data;
	});

	$scope.getCartTotal = function () {
		return CartFactory.getCartTotal();
	};

})