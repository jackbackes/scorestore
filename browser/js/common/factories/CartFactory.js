/**
 * @name cartFactory
 * @type {factory}
 * @memberof factories
 * @summary The cart factory
 * @requires $http, $q
 */
app.factory('CartFactory', function($http, $q){
	var cachedCartItems = [];
	var cachedAddress = [];
	return {

		getCart: function () {
			return $http.get('/api/v1/cart')
			.then(function(response) {
				angular.copy(response.data, cachedCartItems);
				return cachedCartItems;
			});
		},

		addToCart: function(song, quantity){

			return $http.post('/api/v1/cart/songs', {song: song, quantity: quantity})
			.then(function(response) {
				console.log(response.data)
				cachedCartItems.push(response.data);
				return response.data;
			});


		},

		updateCart: function(song, quantity){

			return $http.put('/api/v1/cart/songs/' + song.id, {song: song, quantity: quantity})
			.then(function(response) {
				angular.copy(response.data, cachedCartItems);
				return response.data;
			});


		},


		removeFromCart: function(item) {
			return $http.delete('/api/v1/cart/songs/' + item.song.id)
			.then(function(response) {
				angular.copy(response.data, cachedCartItems);
			})
		},

		getCartTotal: function() {
			if (!cachedCartItems.length) return null;
			else if (cachedCartItems.length < 2) {
				console.log(cachedCartItems[0])
				return cachedCartItems[0].song.price * cachedCartItems[0].quantity;
			}
			else {
				var sum = 0;
				console.log(cachedCartItems);
				for(var i = 0; i < cachedCartItems.length; i++){
					sum += (+cachedCartItems[i].song.price * cachedCartItems[i].quantity);
				}
				return sum;
			}

		},

		submitAddress: function(address){

			return $http.put('/api/v1/cart/address', address)
			.then(function(response) {
				return response.data;
			})
			.catch(function () {
                return $q.reject({ message: 'No items in shopping cart.' });
            });


		},

		getAddress: function() {
			return $http.get('/api/v1/cart/address')
			.then(function(response) {
				return response.data;
			});
		},

		updateAddress: function (address, order) {

			return $http.put('/api/v1/order/' + order.id + '/address', address)
				.then(function(response) {
					angular.copy(response.data, cachedAddress);
					return cachedAddress;
				})
		},

		// save for implementing address history
		// getOrderAddress: function (order) {
		// 	return $http.get('/api/v1/order/' + order.id + '/address')
		// 		.then(function(response) {
		// 			return response.data;
		// 		})
		// }

		// getAddressHistory: function() {
		// 	return $http.get('/api/v1/user/address-history')
		// 	.then(function(response) {
		// 		return response.data;
		// 	});
		// }
	};

});
