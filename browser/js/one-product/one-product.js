app.config(function ($stateProvider) {
    $stateProvider.state('oneSong', {
        url: '/song/:songId',
        controller: 'oneSongController',
        templateUrl: 'js/one-product/one-product.html',
        resolve:{
            oneSong: function(OneSongFactory, $stateParams){
                return OneSongFactory.fetchSong($stateParams.songId)
            }
        }
    });
});

app.controller('oneSongController', function($scope, oneSong, OneSongFactory, ComposerFactory){
    $scope.song = oneSong;
    OneSongFactory.fetchBySimilarInstruments(oneSong.id)
        .then(function(similarSongs){
            $scope.similarSongsByInstrument = similarSongs
        })
    ComposerFactory.fetchSimilarComposers(oneSong.composer.id)
        .then(function(similarComposersSongs){
            $scope.similarSongsByComposer = similarComposersSongs
        })
})

