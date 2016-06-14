app.config(function ($stateProvider) {
    $stateProvider.state('myAccount', {
        url: '/my-account/:userId',
        templateUrl: 'js/my-account/my-account.html',
        controller: 'myAccountCtrl',
    });
});

app.controller('myAccountCtrl', function ($scope, Session, OrdersFactory, $stateParams, ReviewFactory, UsersFactory) {
    $scope.userSess = Session
    console.log(Session);
    let userId = $stateParams.userId

    OrdersFactory.getUserOrders(userId)
    .then(function(orders){
        // console.log(orders);
        $scope.orders = orders;
    })

    ReviewFactory.getUserReviews(userId)
    .then(function(reviews){
        $scope.userReviews = reviews;
    })

    UsersFactory.fetchUser(userId)
    .then(function(user){
        $scope.userWithAddress = user;
    })

    $scope.reviewing = false;

    $scope.submitReview = function(stars, review, songId){
        $scope.reviewMade = true;
        ReviewFactory.createReview(stars, review, songId, userId)
        .then(function(review){
            console.log(review)
        })
    }

    $scope.infoChanged = function(){
        UsersFactory.updateUserInfo(userId, $scope.firstName, $scope.lastName, $scope.streetAddress, $scope.city, $scope.state, $scope.zipCode)
        .then(function(updatedUser){});
    }

});