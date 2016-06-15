/**
 * @name shopping-cart
 * @type {directive}
 * @memberof directives
 * @summary The shopping cart contains shopping cart functionality
 * @requires ui-bootstrap
 * @requires app.controller.TypeaheadCtrl
 */

app.directive('shoppingCart', function (CartFactory) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/shopping-cart/shopping-cart.html',
        scope: {
            theCart: "="
        },
        link: function(scope) {
        	scope.removeFromCart = function(item) {
    			return CartFactory.removeFromCart(item)
  			};

  			scope.getCartTotal = function () {
     			return CartFactory.getCartTotal();
  			};

  			scope.inventory = [1,2,3,4,5,6,7,8,9,10];

  			scope.updateCart = function(song, quantity) {
		        CartFactory.updateCart(song, quantity)
		        .then(function(response) {
		            scope.cart = response;
            	});
    		};
       }
   }
});
