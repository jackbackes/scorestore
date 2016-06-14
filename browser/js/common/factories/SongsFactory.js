app.factory('SongsFactory', function ($http, $q) {
  
  var errorFunc = function(error) {
      return $q.reject(error.statusText);
  };

  return {
    getSongs: function () {
      return $http.get('/api/v1/songs')
      .then(function (res) {
        return res.data;
      })
      .catch(errorFunc);
    },

    createOrUpdateSong: function (song, composer, genre) {
      if(song.id) {
        return $http.put('api/v1/songs/' + song.id, {song: song, composer: composer, genre: genre})
        .then()
        .catch(errorFunc);
      } else {
        return $http.post('api/v1/songs/', {song: song, composer: composer, genre: genre})
        .then()
        .catch(errorFunc);
      }
    },

    deleteSong: function (id) {
      return $http.delete('api/v1/songs/' + id)
      .then()
      .catch(errorFunc);
    }
  };
});