angular.module('pokemon.controllers', ['ionic', 'ngCordova'])

    .controller('DexCtrl', function ($scope, PokemonFactory) {
        $scope.pokemon = PokemonFactory.all;

    })

    .controller('DexDetailCtrl', function ($scope, $stateParams, PokemonFactory) {
        var pokemonPromise = PokemonFactory.get($stateParams.pokeId);
        pokemonPromise.then(function(result){
            $scope.pokemon = result;
        });
    });
