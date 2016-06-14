app.config(function ($stateProvider) {
    $stateProvider.state('myAccount', {
        url: '/my-account/:userId',
        templateUrl: 'js/my-account/my-account.html',
        controller: 'myAccountCtrl',
    });
});

app.controller('myAccountCtrl', function ($scope, Session, OrdersFactory, $stateParams, ReviewFactory) {
    $scope.userSess = Session
    let theUser = $stateParams.userId

    OrdersFactory.getUserOrders(theUser)
    .then(function(orders){
        // console.log(orders);
        $scope.orders = orders;
    })

    ReviewFactory.getUserReviews(theUser)
    .then(function(reviews){
        $scope.userReviews = reviews;
    })

    $scope.reviewing = false;

    $scope.submitReview = function(stars, review, songId){
        $scope.reviewMade = true;
        ReviewFactory.createReview(stars, review, songId, theUser)
        .then(function(review){
            console.log(review)
        })
    }

});