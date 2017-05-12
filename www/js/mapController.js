angular.module('pokemon.controllers', [])

    .controller('MapCtrl', function ($scope, $cordovaGeolocation, $ionicLoading, PlayerFactory) {
        var posOptions = { timeout: 1000, enableHighAccuracy: true };
        $scope.player = PlayerFactory.getPlayerInfo();

        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                $scope.coords = position.coords;
            }, function (err) {
                // error
            });


        var watchOptions = {
            timeout: 1000,
            enableHighAccuracy: false // may cause errors if true
        };

        var watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(
            null,
            function (err) {
                // error
            },
            updateLocation(position));


        function updateLocation(position) {
            var location = {};
            location.lat = position.coords.latitude;
            location.long = position.coords.longitude;
            $scope.player = PlayerFactory.updateLocation(location);
        
        }
    })