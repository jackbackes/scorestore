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

	$scope.submitPayment = function(status, response) {
		console.log("status", status);
		console.log('response', response);
		// console.log(billingInfo)
		// handler.open({
	 //      name: 'Stripe.com',
	 //      description: '2 widgets',
	 //      amount: 2000
  //   	});
	};



	// var handler = StripeCheckout.configure({
	//     key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
	//     image: '/img/documentation/checkout/marketplace.png',
	//     locale: 'auto',
	//     token: function(token) {
	//     	console.log("here", token)
	//       // You can access the token ID with `token.id`.
	//       // Get the token ID to your server-side code for use.
	//     }
	//   });

})