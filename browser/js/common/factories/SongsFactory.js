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
        return $http.put('api/v1/songs/' + song.id, song);
      } else {
        return $http.post('api/v1/songs/', song);
      }
    },

    deleteSong: function (id) {
      return $http.delete('api/v1/songs/' + id);
    }
  };
});