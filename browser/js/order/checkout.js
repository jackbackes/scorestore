app.config(function ($stateProvider) {
    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl: 'js/order/checkout.html',
        controller: 'CheckoutCtrl'
    });
});

app.controller('CheckoutCtrl', function ($scope, Session, $state, CartFactory, AUTH_EVENTS) {
	// $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event) {
	// 	console.log(event.data);
	// })
	// AuthService.getLoggedInUser()
	// .then(function(user) {
	// 	if (user) {
	// 		$scope.user = user;
	// 	}
	// 	else { $scope.user = null}
			
	// });

	$scope.session = Session;

	CartFactory.getCart()
	  .then(function(data) {
	    $scope.cart = data || null;
	  });
})

app.controller('UserLoginCtrl', function ($scope, AuthService, $state) {
	console.log("Here")
    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {
    	console.log("In sendLogin")
        $scope.error = null;

        AuthService.login(loginInfo).then(function (response) {
        	console.log(response);
        	$scope.$parent.user = response;
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});