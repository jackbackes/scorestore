/**
 * @name scorestore-logo
 * @type {directive}
 * @memberof directives
 * @summary logo
 * @requires ui-bootstrap app.controller.TypeaheadCtrl
 */
app.directive('scorestoreLogo', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/scorestore-logo/scorestore-logo.html'
    };
});
