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
    self.sprite = function () {
        return "img/pokemon/" + self.id + ".png";
    }
    self.updateEvolveInfo = function (chain) {
        self.chain = chain;
        self.evolveLoaded = true;
    }

    self.loadFromAPI = function (info) {
        self.id = info.entry_number;
        self.name = CapatalizeName(info.pokemon_species.name);
        self.seen = 0;
        self.caught = 0;
    }

    self.loadFromStorage = function (data) {
        self.id = data.id;
        self.name = data.name;
        self.pokemonLoaded = data.pokemonLoaded;
        self.evolveLoaded = data.evolveLoaded;
        if (data.seen === undefined) {
            self.seen = 0;
        } else {
            self.seen = data.seen;
        }
        if (data.caught === undefined) {
            self.caught = 0;
        } else {
            self.caught = data.caught;
        }

        if (self.pokemonLoaded) {
            self.types = data.types;
            self.stats = data.stats;
            self.moves = data.moves;
            self.height = data.height;
            self.weight = data.weight;
            self.speciesId = data.speciesId;
            // add here more info from the evolve update
        }
        if (self.evolveLoaded) {
            self.chain = data.chain;
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

    self.getObjectForStoring = function () {
        var p = {};
        p.id = self.id;
        p.name = self.name;
        p.pokemonLoaded = self.pokemonLoaded;
        p.evolveLoaded = self.evolveLoaded;
        p.seen = self.seen;
        p.caught = self.caught;
        if (self.pokemonLoaded) {
            p.types = self.types;
            p.stats = self.stats;
            p.moves = self.moves;
            p.height = self.height;
            p.weight = self.weight;
            p.speciesId = self.speciesId;
        }
        if (self.evolveLoaded) {
            p.chain = self.chain;
        }
        return p;
    }

    self.getEvolutionChain = function () {
        return self.chain.chain;
    }

    function setMoves(moves) {

    };

    function getIdFromURL(url) {
        var pattern = /http:\/\/pokeapi\.co\/api\/v2\/.*?\/(\d+)\//;
        var ids = url.match(pattern);
        return parseInt(ids[1]);
    }

    function CapatalizeName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

}