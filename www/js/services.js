angular.module('pokemon.services', ['ngStorage'])

    .factory('PokemonFactory', function ($http, $localStorage, $q) {
        var url = 'http://pokeapi.co/api/v2/'
        var pokemonList = [];

        function load() {
            loadPokemon();
            if (pokemonList.length === 0) {
                getAllPokemonFromAPI();
            }
        }

        function getAllPokemonFromAPI() {
            pokemonList.$promise = $http.get(url + 'pokedex/2/')
                .then(function (response) {
                    for (var i = 0; i < response.data.pokemon_entries.length; i++) {
                        var p = new pokemon();
                        p.loadFromAPI(response.data.pokemon_entries[i])
                        pokemonList.push(p);
                    }
                    savePokemon();
                    return pokemonList;
                });
        }



        function savePokemon() {
            var pokes = [];
            for(var j = 0; j < pokemonList.length; j++){
                pokes.push(pokemonList[j].getObjectForStoring());
            }
            $localStorage["PokeDex"] = JSON.stringify(pokes);
        }

        function loadPokemon() {
            if ($localStorage["PokeDex"] !== undefined) {
                var pokes = JSON.parse($localStorage.PokeDex);
                for (var i = 0; i < pokes.length; i++) {
                    var p = new pokemon();
                    p.loadFromStorage(pokes[i]);
                    pokemonList.push(p);
                }
            }
        }

        function loadPokemonInfo(id) {
            return $http.get(url + 'pokemon/' + id + '/').then(function (data) {
                var p = getPokemon(data.data.id);
                p.update(data.data);
                return pokemonList[data.data.id];
            });
        }

        load();

        function loadEvolvePokemon(evolveChainId) {

        }
        function getPokemon(id) {
            for (var i = 0; i < pokemonList.length; i++) {
                if (pokemonList[i].id === id) {
                    return pokemonList[i];
                }
            }
            return null;
        }

        var getPokemonById = function (pokeId) {
            var poke = parseInt(pokeId);
            var found = false;
            for (var i = 0; i < pokemonList.length; i++) {
                if (pokemonList[i].id === poke) {
                    found = true;
                    var p1 = {}, p2 = {};
                    var id = i;
                    var updating = false;
                    if (!pokemonList[i].pokemonLoaded) {
                        updating = true;
                        p1.$promise = loadPokemonInfo(pokeId);
                    }
                    if (!pokemonList[i].evolveLoaded) {
                        updating = true;
                        p2.$promise = loadEvolvePokemon(pokemonList[i].speciesId);
                    }
                    return pokemonList[id].$promise = $q.all([p1, p2, id, updating]).then(function (promises) {
                        if (promises[3]) {
                            savePokemon();
                        }
                        return pokemonList[id];
                    });
                }
            }
            if (!found) {
                return null;
            }
        }


        return {
            all: pokemonList,
            get: getPokemonById
        };
    })


