app.factory('ReviewFactory', function ($http) {
  return {
    createReview: function (stars, review, theSongId, theUserId) {
      return $http.post('/api/v1/reviews', {rating:+stars, description:review, songId:theSongId, userId:theUserId})
      .then(function (res) {
        return res.data;
      });
    },

    getAllReviews: function(){
      return $http.get('/api/v1/reviews')
      .then(function(res){
        return res.data;
      })
    },

    getUserReviews: function(userId){
      return $http.get('/api/v1/reviews/userReviews/' + userId)
      .then(function(res){
        return res.data;
      })
    },

    getReviewBySong: function(songId){
      return $http.get('/api/v1/reviews/songReviews/' + songId)
      .then(function(res){
        return res.data;
      })
    }
  };
});