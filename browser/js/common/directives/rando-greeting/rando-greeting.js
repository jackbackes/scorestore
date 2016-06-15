/**
 * @name rando-greeting
 * @deprecated since version 1.0
 * @type {directive}
 * @memberof directives
 * @summary The shopping cart contains shopping cart functionality
 * @requires ui-bootstrap app.controller.TypeaheadCtrl
 */
app.directive('randoGreeting', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/rando-greeting/rando-greeting.html',
        link: function (scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };

});
