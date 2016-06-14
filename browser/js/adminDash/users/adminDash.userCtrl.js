app.controller('adminDashUsersCtrl', function ($scope, UsersFactory, growl) {

  var errorFunc = function(error) { growl.error(error)};

  UsersFactory.getUsers()
    .then(function (users) {
      $scope.users = users;
    })
    .catch(errorFunc);

  $scope.getUsers = function () {
    UsersFactory.getUsers()
    .then(function (users) {
      $scope.users = users;
    })
    .catch(errorFunc);
  };

  $scope.deleteUser = function (id) {
    UsersFactory.deleteUser(id)
    .then(function () {
      $scope.getUsers();
    })
    .catch(errorFunc);
  };

});

app.controller('userFormCtrl', function ($scope, UsersFactory, $stateParams, $state, growl) {
  
  var errorFunc = function(error) { growl.error(error)};

  $scope.updateOrCreate = function (user) {
    UsersFactory.createOrUpdateUser(user)
    .then(function () {
      $state.go('adminDash.users');
    })
    .catch(errorFunc);
  };
  
  if ($stateParams.id) {
    UsersFactory.fetchUser($stateParams.id)
    .then(function (user) {
      $scope.user = user;
    })
    .catch(errorFunc);
  } else {
    $scope.newUser = true;
  }
});