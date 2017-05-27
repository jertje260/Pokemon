angular.module('pokemon.services')
// unused service, since it doesnt support the canvas, used the canvas.tobase64() instead

.service('ScreenShotService', ['$q', function ($q){
	return {
		capture: function (filename, extension, quality){
			extension = extension || 'jpg';
			quality = quality || '100';

			var defer = $q.defer();
			
			navigator.screenshot.save(function (error, res){
				if (error) {
					console.error(error);
					defer.reject(error);
				} else {
					console.log('screenshot saved in: ', res.filePath);
					defer.resolve(res.filePath);
				}
			}, extension, quality, filename);
			
			return defer.promise;
		}
	};
}])