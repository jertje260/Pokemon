function pokemon() {
    var self = this;

    self.pokemonLoaded = false;
    self.evolveLoaded = false;

    self.update = function (moreInfo) {
        setTypes(moreInfo.types);
        setStats(moreInfo.stats);
        self.height = moreInfo.height;
        self.weight = moreInfo.weight;
        setMoves(moreInfo.moves);
        self.sprite = moreInfo.sprites["front_default"];
        self.speciesId = getIdFromURL(moreInfo.species.url);

        self.pokemonLoaded = true;
    }

    self.updateEvolveInfo = function (evolveData) {
        self.evolveLoaded = true;
    }

    self.loadFromAPI = function (info) {
        self.id = info.entry_number;
        self.name = info.pokemon_species.name;
    }

    self.setLocalSprite = function(location){
        self.localSprite = location;
    }

    self.loadFromStorage = function (data) {
        self.id = data.id;
        self.name = data.name;
        self.pokemonLoaded = data.pokemonLoaded;

        if (self.pokemonLoaded) {
            self.types = data.types;
            self.stats = data.stats;
            self.moves = data.moves;
            self.height = data.height;
            self.weight = data.weight;
            self.sprite = data.sprite;
            self.speciesId = data.speciesId;
            // add here more info from the evolve update
        }
    }

    function setTypes(types) {
        self.types = [];
        for (var i = 0; i < types.length; i++) {
            self.types.push(types[i].type.name);
        }
    }

    function setStats(stats) {
        self.stats = [];
        for (var i = 0; i < stats.length; i++) {
            var stat = {};
            stat.name = stats[i].stat.name;
            stat.base = stats[i].base_stat;
            self.stats.push(stat);
        }
    }

    function setMoves(moves) {

    };

    function getIdFromURL(url) {
        var pattern = /http:\/\/pokeapi\.co\/api\/v2\/.*?\/(\d+)\//;
        var id = url.match(pattern)[0];
        return id;
    }

    self.CapatalizeName = function () {
        return self.name.charAt(0).toUpperCase() + self.name.slice(1);
    }

}