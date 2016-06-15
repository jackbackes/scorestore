/**
 * @name about
 * @type {state}
 * @memberof states
 * @summary The search-bar directive can be placed on any page or in the navbar, and searches songs for similar titles.
 * @requires ui-bootstrap
 * @requires app.controller.TypeaheadCtrl
 */

app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('about', {
        url: '/about',
        controller: 'AboutController',
        templateUrl: 'js/about/about.html'
    });

});

app.controller('AboutController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);

});
