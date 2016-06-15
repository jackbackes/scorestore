/**
 * @name ComposerFactory
 * @type {factory}
 * @memberof factories
 * @summary The composer factory
 * @requires $http
 */
app.factory('ComposerFactory', function($http){

	var obj;

	obj = {

		fetchSimilarComposers: function(id){
			return $http.get('/api/v1/composer/' + id + '/similarComposers')
			.then(function(similarComposers){
				return similarComposers.data
			})
		}

	}

	return obj;

})
