app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/Shopping-Cart/shopping-cart.html',
        controller: 'cartCtrl'
    });
});

app.controller('cartCtrl', function ($scope) {
  $scope.orders= [
  		{id: 1, quantity: 2, song: {title: 'Song1', image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/DreamOnsingle.jpg/220px-DreamOnsingle.jpg"}, composer: {fullName: 'John Smith'}},
  		{id: 2, quantity: 1, song: {title: 'Song2', image: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Wearethechampions.jpg/220px-Wearethechampions.jpg"
		}, composer: {fullName: 'James Smith'}}
  ];

  $scope.isCartEmpty = function () {
  	// if (!req.session.cart) return true;
  	return false;
  };
});