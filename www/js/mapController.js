angular.module('pokemon.controllers')

    .controller('MapCtrl', function ($scope, $cordovaGeolocation, $ionicLoading, PlayerFactory, $ionicPlatform) {
        var posOptions = { timeout: 10000, enableHighAccuracy: true };
        $scope.player = PlayerFactory.getPlayerInfo();

        $ionicPlatform.ready(function () {


            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    updateLocation(position);
                }, function (err) {
                    // error
                    console.warn(err.code + '::::' + err.message);
                });


            var watchOptions = {
                timeout: 10000,
                enableHighAccuracy: true // may cause errors if true
            };

            var watch = $cordovaGeolocation.watchPosition(watchOptions);
            watch.then(
                null,
                function (err) {
                    // error
                    console.warn(err.code + '::::' + err.message);
                },
                function (position) {
                    updateLocation(position);
                });
        });


        function updateLocation(position) {
            var location = {};
            location.lat = position.coords.latitude;
            location.long = position.coords.longitude;
            $scope.player = PlayerFactory.updateLocation(location);

        }
    })