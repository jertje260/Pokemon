angular.module('pokemon.controllers')

    .controller('MapCtrl', function ($scope, $cordovaGeolocation, $ionicLoading, PlayerFactory, $ionicPlatform) {
        var posOptions = { timeout: 1000, enableHighAccuracy: true };
        $scope.player = PlayerFactory.getPlayerInfo();

        $ionicPlatform.ready(function () {


            navigator.geolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    updateLocation(position);
                }, function (err) {
                    // error
                });


            var watchOptions = {
                timeout: 1000,
                enableHighAccuracy: false // may cause errors if true
            };

            var watch = navigator.geolocation.watchPosition(watchOptions);
            watch.then(
                null,
                function (err) {
                    // error
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