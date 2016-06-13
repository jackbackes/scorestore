app.controller('adminDashUsersCtrl', function ($scope, UsersFactory) {

  UsersFactory.getUsers()
    .then(function (users) {
      $scope.users = users;
    });

  $scope.getUsers = function () {
    UsersFactory.getUsers()
    .then(function (users) {
      $scope.users = users;
    });
  };

  $scope.deleteUser = function (id) {
    UsersFactory.deleteUser(id)
    .then(function () {
      $scope.getUsers();
    });
  };

});

app.controller('userFormCtrl', function ($scope, UsersFactory, $stateParams, $state) {
  $scope.updateOrCreate = function (user) {
    UsersFactory.createOrUpdateUser(user)
    .then(function () {
      $state.go('adminDash.users');
    });
  };
  
  if ($stateParams.id) {
    UsersFactory.fetchUser($stateParams.id)
    .then(function (user) {
      $scope.user = user;
    });
  } else {
    $scope.newUser = true;
  }
});