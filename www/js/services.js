angular.module('pokemon.services', ['ngStorage'])

    .factory('PokemonFactory', function ($http, $localStorage, $q) {
        var url = 'http://pokeapi.co/api/v2/'
        var pokemonList = [];
        var chains = [];

        function load() {
            loadPokemon();
            if (pokemonList.length === 0) {
                getAllPokemonFromAPI();
            }
        }

        function getAllPokemonFromAPI() {
            var p = $http.get(url + 'pokedex/2/')
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
            for (var j = 0; j < pokemonList.length; j++) {
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

                if (!p.evolveLoaded) {
                    if (!updateEvolveChains(p)) {
                        return loadEvolvePokemon(p.speciesId).then(function (data) {
                            return getPokemon(p.id);
                        });
                    } else {
                        return getPokemon(p.id);
                    }
                } else {
                    return getPokemon(p.id);
                }
            });
        }

        function updateEvolveChains(poke) {
            for (var i = 0; i < chains.length; i++) {
                var speciesIds = chains[i].chain.getSpeciesIds();
                if (speciesIds.indexOf(poke.speciesId) !== -1) {
                    poke.updateEvolveInfo(chains[i]);
                    return true;
                }
            }
            return false;
        }

        load();

        function loadPokemonSpecies(id) {
            return $http.get(url + 'pokemon-species/' + id + '/')
        }

        function loadEvolvePokemon(id) {
            return loadPokemonSpecies(id).then(function (data) {
                return $http.get(data.data.evolution_chain.url).then(function (data) {
                    var chain = createEvolveChain(data.data);
                    updateEvolves(chain);
                    chains.push(chain);
                    return chain;
                });
            });
        }

        function createEvolveChain(data) {
            c = {};
            c.id = data.id;
            c.chain = new chain();
            c.chain.setData(data.chain);
            return c;
        }

        function updateEvolves(chain) {
            var speciesIds = chain.chain.getSpeciesIds();
            for (var i = 0; i < pokemonList.length; i++) {
                if (speciesIds.indexOf(pokemonList[i].speciesId) !== -1) {
                    pokemonList[i].updateEvolveInfo(chain);
                }
            }
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
                    var p1 = {};
                    var id = i;
                    var updating = false;
                    if (!pokemonList[i].pokemonLoaded) {
                        updating = true;
                        p1 = loadPokemonInfo(pokeId);
                    }
                    return promise = $q.all([p1, id, updating]).then(function (promises) {

                        if (promises[2]) {
                            savePokemon();
                        }
                        return pokemonList[id];
                    });
                }
            }
            return null;
        }


        return {
            all: pokemonList,
            get: getPokemonById
        };
    })


