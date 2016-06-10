app.factory('SongsFactory', function ($http) {
  return {
    getSongs: function () {
      return $http.get('/api/v1/songs')
      .then(function (res) {
        return res.data;
      });
    },

    deleteSong: function (id) {
      return $http.delete('api/v1/songs/' + id);
    }
  };
});