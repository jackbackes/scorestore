app.config(function ($stateProvider) {
    $stateProvider.state('one-product', {
        url: '/product',
        controller: 'OneProductController',
        templateUrl: 'js/one-product/one-product.html'
    });
});


app.factory('ProductImages', function () {
    return [
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Allofmejohnlegend.jpg/220px-Allofmejohnlegend.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/Happy_Xmas_%28War_is_Over%29.jpg/220px-Happy_Xmas_%28War_is_Over%29.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Wearethechampions.jpg/220px-Wearethechampions.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/DreamOnsingle.jpg/220px-DreamOnsingle.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/0/07/LeanOnMe_Single_cover.jpg/220px-LeanOnMe_Single_cover.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Elton_john-can_you_feel_the_love_tonight_s_1.jpg/220px-Elton_john-can_you_feel_the_love_tonight_s_1.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/Hey_Jude_Beatles.jpg/220px-Hey_Jude_Beatles.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Letitbe_single.jpg/220px-Letitbe_single.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/Stairwaytoheavenpromo.jpg/220px-Stairwaytoheavenpromo.jpg",
		"https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/Elvis_-_Rock_a_Hula.jpg/220px-Elvis_-_Rock_a_Hula.jpg"
    ];
});

app.controller('OneProductController', function ($scope, ProductImages) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(ProductImages);
});
