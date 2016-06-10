app.factory('SongsFactory', function ($http) {
  return {
    getSongs: function () {
      return $http.get('/api/v1/songs')
      .then(function (res) {
        return res.data;
      });
    },

    createOrUpdateSong: function (song) {
      if(song.id) {
        return $http.get('api/v1/songs/' + song.id)
          .then(function (response) {
            let foundSong = response.data;
              return $http.put('api/v1/songs/' + foundSong.id, song);
          });
        } else {
          delete song.id;
          return $http.post('api/v1/songs/', song);
        }
    },

    deleteSong: function (id) {
      return $http.delete('api/v1/songs/' + id);
    }
  };
});