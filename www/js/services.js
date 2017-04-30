angular.module('pokemon.services', ['ngStorage', 'ngCordovaFile'])

    .factory('PokemonFactory', function ($http, $localStorage, $q, $cordovaFile) {
        var url = 'http://pokeapi.co/api/v2/'
        var pokemonList = [];

        function load() {
            loadPokemon();
            if(pokemonList.length === 0){
                getAllPokemonFromAPI();
            }
        }

        function getAllPokemonFromAPI() {
            pokemonList.$promise = $http.get(url + 'pokedex/2/').then(function (response) {
                for (var i = 0; i < response.data.pokemon_entries.length; i++) {
                    var p = new pokemon();
                    p.loadFromAPI(response.data.pokemon_entries[i])
                    pokemonList.push(p);
                }
                var promises = [];
                for(var i = 0; i < pokemonList.length; i++){
                    promises.push(loadPokemonInfo(pokemonList[i].id));
                }
                $q.all(promises).then(function(data){
                    savePokemon();
                    return pokemonList;
                });
            });
        }



        function savePokemon() {
            $localStorage.PokeDex = JSON.stringify(pokemonList);
        }

        function loadPokemon() {
            if($localStorage.PokeDex !== undefined){
                var pokes = JSON.parse($localStorage.PokeDex);
                for(var i =0 ; i < pokes.length ; i++){
                    var p = new pokemon();
                    p.loadFromStorage(pokes[i]);
                    pokemonList.push(p);
                }
            }
        }

        function loadPokemonInfo(id){
            return $http.get(url + 'pokemon/' + id + '/').then(function(data){
                var p = getPokemonById(id)
                p.update(data.data);
                var name = p.sprite.substr(p.sprite.lastIndexOf('/') + 1);
                var namePath = p.sprite.substr(0, p.sprite.lastIndexOf('/') + 1);
                p.localSprite.$promise = $cordovaFile.copyFile(namePath, name, cordova.file.dataDirectory, name).then(function(info){
                    p.localSprite = cordova.file.dataDirectory + '/' + name;
                    return cordova.file.dataDirectory + '/' + name;
                });
                return pokemonList[id];
            });
        }

        load();

        var getPokemonById = function (pokeId) {
            var poke = parseInt(pokeId);
            for (var i = 0; i < pokemonList.length; i++) {
                if (pokemonList[i].id === poke) {
                    return pokemonList[i];
                    // get extra info of pokemon
                    //pokemonList[i].$promise = loadPokemonInfo(pokemonList[i].id);
                }
            }
            return null;
        }


        return {
            all: pokemonList,
            get: getPokemonById
        };
    })


