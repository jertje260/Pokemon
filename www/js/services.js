angular.module('pokemon.services', ['ngStorage'])

    .factory('PokemonFactory', function ($http, $localStorage) {
        // Might use a resource here that returns a JSON array
        var url = 'http://pokeapi.co/api/v2/'
        // Some fake testing data, later fetching from pokemon api
        var pokemonList = [];
            //   {
            //   id: 0,
            //   name: 'Bulbasaur',
            //   info: 'Im a grass pokemon',
            //   image: 'img/ben.png'
            // }, {
            //   id: 1,
            //   name: 'Charmander',
            //   info: 'Im a fire pokemon',
            //   image: 'img/ben.png'
            // }, {
            //   id: 2,
            //   name: 'Squirtle',
            //   info: 'Im a water pokemon',
            //   image: 'img/ben.png'
            // }, {
            //   id: 3,
            //   name: 'Pikachu',
            //   info: 'Im an electric pokemon',
            //   image: 'img/ben.png'
            // }
        

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
                savePokemon();
                return pokemonList;
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
            var p1 =  $http.get(url + 'pokemon-species/' + id + '/').then(function(data){
                pokemonList[id].update(data);
                
            });
        }

        load();

        var get = function (pokeId) {
            var poke = parseInt(pokeId);
            for (var i = 0; i < pokemonList.length; i++) {
                if (pokemonList[i].id === poke) {
                    // get extra info of pokemon
                    loadPokemonInfo(pokemonList[i].id);
                    return pokemonList[i];
                }
            }
            return null;
        }


        return {
            all: pokemonList,
            get: get
        };
    })


