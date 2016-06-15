/**
 * @overview your source for music!
 * @summary your source for music!
 * @author John Backes
 * @author Geoff Bass
 * @author Jon Perrelle
 * @author Kelvin Masilamani
 * @version 1.0
 * @license MIT
 * @example <caption>Getting Started</caption>
 * // npm install
 * // npm start
 * @example <caption>Generating Documentation</caption>
 * // jsdoc -c conf.json
 * @example <caption>Running Tests</caption>
 * # test server code
 * //
 * // gulp testServerJSWithCoverage
 *
 * # test brower code
 * //
 * // gulp testBrowserJS
 * @description
 * See our website [here]{@link http://162.243.27.75/}
 * See our repo [here]{@link https://github.com/thejohnbackes/scorestore}
 */


'use strict';
/**
* @module FullstackGeneratedApp
*/
window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngCookies', 'ngMessages', 'stripe', 'angular-growl']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    // Trigger page refresh when accessing an OAuth route
    $urlRouterProvider.when('/auth/:provider', function () {
        window.location.reload();
    });

    Stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh')
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

    // $stateChangeStart is an event fired
    // whenever the process of changing a state begins.
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if (!destinationStateRequiresAuth(toState)) {
            // The destination state does not require authentication
            // Short circuit with return.
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            return;
        }

        if (AuthService.isAuthenticated()) {
            // The user is authenticated.
            // Short circuit with return.
            return;
        }

        // Cancel navigating to new state.
        event.preventDefault();

        AuthService.getLoggedInUser().then(function (user) {
            // If a user is retrieved, then renavigate to the destination
            // (the second time, AuthService.isAuthenticated() will work)
            // otherwise, if no user is logged in, go to "login" state.
            if (user) {
                $state.go(toState.name, toParams);
            } else {
                $state.go('login');
            }
        });

    });

});
