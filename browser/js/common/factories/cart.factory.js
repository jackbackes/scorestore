app.factory('CartFactory', function($http){
	var cachedCartItems = [];
	return {

		getCart: function () {
			return $http.get('/api/v1/cart')
			.then(function(response) {
				angular.copy(response.data, cachedCartItems);
				return cachedCartItems;
			});
		},

		addToCart: function(song, quantity){
			return $http.post('/api/v1/cart', {song: song, quantity: quantity})
			.then(function(response) {
				cachedCartItems.push(response.data);
				return response.data;
			});
		},

		removeFromCart: function(item) {
			console.log(item);
			return $http.delete('/api/v1/cart/' + item.song.id)
			.then(function(response) {
				angular.copy(response.data, cachedCartItems);
			})
		}
	};

});