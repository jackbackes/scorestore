app.factory('SongsFactory', function ($http) {
  return {
    getSongs: function () {
      return $http.get('/api/v1/songs')
      .then(function (res) {
        console.log(res.data);
        return res.data;
      });
    }
  };
});