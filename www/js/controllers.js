angular.module('pokemon.controllers', [])

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
    });
