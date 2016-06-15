app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('changePassword', {
        url: '/changePassword',
        templateUrl: 'js/login/changePassword.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function (user) {
            if (user.resetPassword) {
                console.log('need to change password');
                $state.go('changePassword');
            } else {
                $state.go('home');
            }
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

    $scope.changePassword = function (password) {
        AuthService.changePassword(password)
        .then(function () {
            $state.go('home');
        });
    };

});