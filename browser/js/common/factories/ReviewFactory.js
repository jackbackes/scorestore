app.factory('ReviewFactory', function ($http) {
  return {
    createReview: function (stars, review) {
      return $http.post('/api/v1/reviews', {rating:stars, description:review})
      .then(function (res) {
        return res.data;
      });
    },

    getReviews: function(songId){
      return $http.get('/api/v1/reviews')
      .then(function(res){
        return res.data;
      })
    }
  };
});