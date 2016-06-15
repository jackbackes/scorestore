/**
 * @name footer
 * @type {directive}
 * @memberof directives
 * @summary The footer
 * @requires footer.html
 */
app.directive('footer', function () {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/footer/footer.html'
  }
});
