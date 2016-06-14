app.config(function ($stateProvider) {
    $stateProvider.state('oneSong', {
        url: '/songs/:songId',
        controller: 'oneSongController',
        templateUrl: 'js/one-product/one-product.html',
        resolve:{
            oneSong: function(OneSongFactory, $stateParams){
                return OneSongFactory.fetchSong($stateParams.songId);
            },
            similarSongsByInstrument: function(OneSongFactory, $stateParams) {
                return OneSongFactory.fetchBySimilarInstruments($stateParams.songId);
            }
        }
    });

    $stateProvider.state('sheetMusic', {
        url: '/songs/sheetMusic/:songId',
        controller: 'sheetMusicCtrl',
        templateUrl: 'js/one-product/sheet-music.html'
    });
});

app.controller('oneSongController', function($scope, oneSong, $state, similarSongsByInstrument, OneSongFactory, ComposerFactory, CartFactory){
    $scope.song = oneSong;
    $scope.similarSongsByInstrument = similarSongsByInstrument;
    $scope.inventory = [];
   
        for (var i = 1; i <= $scope.song.inventoryQuantity; i++) {
         $scope.inventory.push(i);
    }

    $scope.stars = [1, 2, 3];
    $scope.emptyStars = [4, 5];

    ComposerFactory.fetchSimilarComposers(oneSong.composer.id)
        .then(function(similarComposersSongs){
            $scope.similarSongsByComposer = similarComposersSongs;
        });

    $scope.addToCart = function(song, quantity) {
        CartFactory.addToCart(song, quantity)
        .then(function(response) {
            $scope.cart = response;
        });
    };

});

app.controller('sheetMusicCtrl', function($scope, $stateParams, OneSongFactory){

    OneSongFactory.fetchSong($stateParams.songId)
    .then(function(data) {
        $scope.song = data;
    });

});

