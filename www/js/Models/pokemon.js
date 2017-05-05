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
        self.speciesId = getIdFromURL(moreInfo.species.url);

        self.pokemonLoaded = true;
    }
    self.sprite = function(){
        return "img/pokemon/" + self.id + ".png";
    }
    self.updateEvolveInfo = function (evolveData) {
        self.evolveLoaded = true;
    }

    self.loadFromAPI = function (info) {
        self.id = info.entry_number;
        self.name = info.pokemon_species.name;
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

    self.setEvolutionChain = function(chain){
        
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

    self.getObjectForStoring = function(){
        var p = {};
        p.id = self.id;
        p.name = self.name;
        p.pokemonLoaded = self.pokemonLoaded;
        if(self.pokemonLoaded){
            p.types = self.types;
            p.stats = self.stats;
            p.moves = self.moves;
            p.height = self.height;
            p.weight = self.weight;
            p.speciesId = self.speciesId;
        }
        
        return p;
    }

    function setMoves(moves) {

    };

    function getIdFromURL(url) {
        var pattern = /http:\/\/pokeapi\.co\/api\/v2\/.*?\/(\d+)\//;
        var ids = url.match(pattern);
        return ids[1];
    }

    self.CapatalizeName = function () {
        return self.name.charAt(0).toUpperCase() + self.name.slice(1);
    }

}