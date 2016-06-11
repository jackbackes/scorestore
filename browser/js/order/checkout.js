app.config(function ($stateProvider) {
    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl: 'js/order/checkout.html',
        controller: 'CheckoutCtrl'
    });
});

app.controller('CheckoutCtrl', function ($scope, Session, $state, CartFactory, AUTH_EVENTS) {

	$scope.session = Session;

	CartFactory.getCart()
	  .then(function(data) {
	    $scope.cart = data || null;
	  });
})

app.controller('UserLoginCtrl', function ($scope, AuthService, $state) {
    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {
    	console.log("In sendLogin")
        $scope.error = null;

        AuthService.login(loginInfo).then()
       	.catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});

app.controller('GuestLoginCtrl', function ($scope, AuthService, $state) {
    $scope.guest = {};
    $scope.error = null;

    $scope.sendGuest = function (guestInfo) {
        $scope.error = null;
        AuthService.guestLogin(guestInfo).then()
        .catch(function (error) {
        	$scope.error = error.message;
        })
    };

});