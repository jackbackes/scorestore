app.factory('OrderFactory', function($http){
	return {
		getOrder: function () {
			return $http.get('/api/v1/order')
			.then(function(response) {
				return response.data;
			});
		},
	};

});