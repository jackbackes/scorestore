app.config(function ($stateProvider) {
    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl: 'js/order/checkout.html',
        controller: 'CheckoutCtrl'
    });
});

app.controller('CheckoutCtrl', function ($scope, Session, $state, CartFactory) {

	$scope.session = Session;

	$scope.submitAddress = function (address, user) {
		$scope.addressError = null;
		CartFactory.submitAddress(address)
		.then(function () {
			$state.go('order');
		})
		.catch(function (error) {
            $scope.addressError = error.message;
        });
	}
})

app.controller('UserLoginCtrl', function ($scope, AuthService) {
    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {
        $scope.error = null;
        AuthService.login(loginInfo).then()
       	.catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});

app.controller('GuestLoginCtrl', function ($scope, AuthService) {
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