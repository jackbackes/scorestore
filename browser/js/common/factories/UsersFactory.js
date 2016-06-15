/**
 * @name UsersFactory
 * @type {factory}
 * @memberof factories
 * @summary The users factory
 * @requires $http, $q
 */
app.factory('UsersFactory', function ($http, $q) {

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
        return user.data;
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
      return $http.delete('api/v1/users/' + id)
      .then()
      .catch(errorFunc);
    }
  };
});
