app.config(function ($stateProvider) {
    $stateProvider.state('order', {
        url: '/order',
        templateUrl: 'js/order/order.html',
        controller: 'OrderCtrl'
    });
});

app.controller('OrderCtrl', function ($scope, Session, $state, OrderFactory, CartFactory) {
	var total;
	$scope.session = Session;

	CartFactory.getCart()
	.then(function(data) {
		$scope.cart = data;
	});

	CartFactory.getAddress()
	  .then(function(data) {
	    $scope.shippingAddress = data;
	});

	$scope.getCartTotal = function () {
		total = CartFactory.getCartTotal();
		if (total) {
			total = total.toFixed(2);
			return total;
		}
		else {
			return 0;
		}
	};

	$scope.submitPayment = function(status, response) {
		console.log("total", total)
		OrderFactory.submitPayment(response, total)
		.then(function () {
			$state.go('thankyou');
		})
		.catch(function (error) {
            $scope.orderError = error.message;
        });
	};

})