angular.module('pokemon.controllers', [ionic, ngCordova])

    .controller('DexCtrl', function ($scope, PokemonFactory) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        $scope.pokemon = PokemonFactory.all;

    })

    .controller('DexDetailCtrl', function ($scope, $stateParams, PokemonFactory) {
        var pokemonPromise = PokemonFactory.get($stateParams.pokeId);
        pokemonPromise.then(function(result){
            $scope.pokemon = result;
        });
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })
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
    });
