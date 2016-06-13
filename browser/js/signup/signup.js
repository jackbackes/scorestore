app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup/:checkingOut',
        templateUrl: 'js/signup/signup.html',
        controller: 'signupCtrl',
        resolve: {
            checkingOut: function ($stateParams) {
                return $stateParams.checkingOut;
            }
        }
    });

});

app.controller('signupCtrl', function ($scope, AuthService, $state, checkingOut) {

    $scope.signup = {};
    $scope.error = null;

    $scope.sendSignup = function (signupInfo) {

        $scope.error = null;

        AuthService.signup(signupInfo)
        .then(function () {
            return AuthService.login({email: signupInfo.user.email, password: signupInfo.user.password});
        })
        .then(function () {
            if (checkingOut) {
                $state.go('checkout');
            } else {
                $state.go('home');
            }
        })
        .catch(function () {
            $scope.error = 'Invalid signup credentials.';
        });

    };

    $scope.states = ["", "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

});