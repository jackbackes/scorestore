app.config(function ($stateProvider) {
    $stateProvider.state('myAccount', {
        url: '/my-account/:userId',
        templateUrl: 'js/my-account/my-account.html',
        controller: 'myAccountCtrl',
    });
});

app.controller('myAccountCtrl', function ($scope, Session, OrdersFactory, $stateParams) {
    $scope.userSess = Session


    OrdersFactory.getUserOrders($stateParams.userId)
    .then(function(orders){
        console.log(orders);
        $scope.orders = orders;
    })


});