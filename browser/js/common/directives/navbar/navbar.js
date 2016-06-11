app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.loggedInButtons = [
                 {label: 'Logout', state: 'logout', auth: true},
                 { label: 'My Account', state: 'myAccount', auth: true }
            ];

            scope.loggedOutButtons = [
                 {label: 'Login', state: 'login', auth: false},
                 {label: 'Sign Up', state: 'signup', auth: false}
            ];

            scope.home = { label: 'Home', state: 'home' };

            scope.user = null;
            scope.guest = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;

                });
            };

            // var setGuest = function () {
            //     console.log('Here Guest');
            //     AuthService.getGuest().then(function (guest) {
            //         scope.guest = guest;
            //     })
            // }

            var removeUser = function () {
                scope.user = null;
            };

            setUser();
            // setGuest();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
            // $rootScope.$on(GUEST_EVENTS.loginSuccess, setGuest);

        }

    };

});
