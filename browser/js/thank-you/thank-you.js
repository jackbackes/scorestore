app.config(function ($stateProvider) {
    $stateProvider.state('thankyou', {
        url: '/thankyou',
        templateUrl: 'js/thank-you/thank-you.html',
        controller: 'ThankYouCtrl'
    });
});

app.controller("ThankYouCtrl", function($scope) {
	$scope.name = "Jon";
})