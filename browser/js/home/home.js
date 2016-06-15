app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'homeCtrl',
        resolve:{
        	allSongs:function(SongsFactory){
        		return SongsFactory.getSongs();
        	}
        }
    });
});

app.controller('homeCtrl', function ($scope, allSongs, CartFactory) {
  $scope.songs = allSongs;

  $scope.addToCart = function(song) {
        CartFactory.addToCart(song, 1)
        // .then(function(response) {
        //     $scope.cart = response;
        // });
    };

});