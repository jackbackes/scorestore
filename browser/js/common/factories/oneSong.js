app.factory('OneSongFactory', function($http){

	var obj;

	obj = {

		fetchSong: function(id){
			return $http.get('/api/v1/song/' + id)
			.then(function(song){
				return song.data;
			})
		},
		fetchBySimilarInstruments: function(id){
			return $http.get('/api/v1/song/' + id + '/similarInstruments')
			.then(function(similarSongs){
				console.log(similarSongs);
				return similarSongs.data
			})
		}

	}

	return obj;

})