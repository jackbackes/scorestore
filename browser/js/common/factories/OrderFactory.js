app.factory('OrderFactory', function($http, $q){
	return {
		getOrder: function () {
			return $http.get('/api/v1/order')
			.then(function(response) {
				return response.data;
			});
		},

		submitPayment: function(response, total) {
			return $http.post('/api/v1/order', {response: response, total: total})
			.then(function(response) {
				return response.data;
			})
			.catch(function () {
                return $q.reject({ message: 'Stripe Card Error' });
            });
 		}
	};

});