app.factory('UsersFactory', function ($http) {
  return {
    getUsers: function () {
      return $http.get('/api/v1/users')
      .then(function (res) {
        return res.data;
      });
    },

    fetchUser: function(id){
      return $http.get('/api/v1/users/' + id)
      .then(function(user){
        return user.data;
      })
    },

    createOrUpdateUser: function (user) {
      if(user.id) {
        return $http.get('api/v1/users/' + user.id)
          .then(function (response) {
            let foundUser = response.data;
              return $http.put('api/v1/users/' + foundUser.id, user);
          });
        } else {
          delete user.id;
          return $http.post('api/v1/users/', user);
        }
    },

    deleteUser: function (id) {
      return $http.delete('api/v1/users/' + id);
    }
  };
});