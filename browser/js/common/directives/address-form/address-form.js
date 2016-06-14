app.directive('addressForm', function (CartFactory, $state) {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/address-form/address-form.html',
        scope: {
          address: "=",
        },
        link: function(scope) {
        	scope.submitAddress = function (address, user) {
				scope.addressError = null;
				CartFactory.submitAddress(address)
				.then(function() {
					$state.go('order')
				})
				.catch(function (error) {
		            scope.addressError = error.message;
		        });
			}

            scope.updateAddress = function(address, order) {
                CartFactory.updateAddress(address, order)
            }

            // scope.getAddressHistory=function() {
            //     CartFactory.getAddressHistory()
            //     .then(function(data) {
            //         scope.pastAddresses=true;
            //         scope.addressHistory = data;
            //     })
            // }
        }
    };
});