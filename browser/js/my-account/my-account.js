app.config(function ($stateProvider) {
    $stateProvider.state('myAccount', {
        url: '/my-account',
        templateUrl: 'js/my-account/my-account.html',
        controller: 'myAccountCtrl',
    });
});

app.controller('myAccountCtrl', function ($scope, Session, OrdersFactory) {
    $scope.userSess = Session

    // console.log($scope.userSess.user.id);
    var allOrders;
    var userOrders = [];

    OrdersFactory.getOrders()
    .then(function(orders){
        allOrders = orders;
    })

    $scope.showOrders = function(id){
        allOrders.forEach(function(elem){
            if(elem.userId === id)
                userOrders.push(elem)
        })
    }

    $scope.orders = userOrders;


});
