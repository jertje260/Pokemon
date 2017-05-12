function chain() {
    var self = this;

    self.setData = function (data) {
        self.evolvesTo = [];
        var id = getIdFromURL(data.species.url);
        if (id < 152) {
            self.speciesId = id;
        }

        for (var i = 0; i < data.evolves_to.length; i++) {
            var c = new chain();
            c.setData(data.evolves_to[i]);
            if (c.speciesId < 152) { // pokemon in first gen
                self.evolvesTo.push(c);
            }
        }
    }

    self.getSpeciesIds = function () {
        var species = [];
        species.push(parseInt(self.speciesId));
        for (var i = 0; i < self.evolvesTo.length; i++) {
            var evolveIds = self.evolvesTo[i].getSpeciesIds();
            for (var j = 0; j < evolveIds.length; j++) {
                species.push(evolveIds[j]);
            }
        }
        return species;
    }

    self.getChainDepth = function () {
        var depth = 1;
        var moreDepth = 0;
        for (var i = 0; i < self.evolvesTo.length; i++) {
            var x = self.evolvesTo[i].getChainDepth();
            if (x > moreDepth) {
                moreDepth = x;
            }
        }
        return depth + moreDepth;
    }

    function getIdFromURL(url) {
        var pattern = /http:\/\/pokeapi\.co\/api\/v2\/.*?\/(\d+)\//;
        var ids = url.match(pattern);
        return ids[1];
    }
}