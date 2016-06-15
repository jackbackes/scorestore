app.factory('OneSongFactory', function($http){

	var obj;

	obj = {

		fetchSong: function(id){
			return $http.get('/api/v1/songs/' + id)
			.then(function(song){
				return song.data;
			});
		},
		fetchBySimilarInstruments: function(id){
			return $http.get('/api/v1/songs/' + id + '/similarInstruments')
			.then(function(similarSongs){
				return similarSongs.data;
			});
		}

	};

	return obj;

});