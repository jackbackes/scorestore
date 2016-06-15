app.factory('UsersFactory', function ($http, $q) {

  var cachedUser = [];
  
  var errorFunc = function(error) {
      return $q.reject(error.statusText);
  };

  return {
    getUsers: function () {
      return $http.get('/api/v1/users')
      .then(function (res) {
        return res.data;
      })
      .catch(errorFunc);
    },

    fetchUser: function(id){
      return $http.get('/api/v1/users/' + id)
      .then(function(user){
        angular.copy(user.data,cachedUser);
        return cachedUser;
      })
      .catch(errorFunc);
    },

    createOrUpdateUser: function (user) {
      if(user.id) {
          return $http.put('api/v1/users/' + user.id, user)
          .then()
          .catch(errorFunc);
      } else {
        return $http.post('api/v1/users/', user)
                  .then()
                  .catch(errorFunc);
      }
    },

    deleteUser: function (id) {
      return $http.delete('api/v1/users/' + id);
    },

    updateUserInfo: function(id, fN, lN, sA, c, s, zC) {
      return $http.put('api/v1/users/myAccount/' + id, {firstName:fN, lastName:lN, address:sA, city:c, state:s, zipCode:zC})
      .then(function(data){
        angular.copy(data.data, cachedUser);
        return cachedUser;
      });
    }

  };
});