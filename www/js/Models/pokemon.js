function pokemon(){
    var self = this;

    self.updated = false;

    self.update = function(moreInfo){
        self.captureRate = moreInfo.capture_rate;
        self.evolvesFromId = getIdFromURL(moreInfo.evolves_from_species.url);
        self.evolvesFromName = moreInfo.evolves_from_species.name;
        self.evolutionChainId = getIdFromURL(moreInfo.evolution_chain.url);
        
    }

    self.updateEvolveInfo = function(evolveData){
        self.updated = true;
    }

    self.loadFromAPI = function(info){
        self.id = info.entry_number;
        self.name = info.pokemon_species.name;
    }

    self.loadFromStorage = function(data){
        self.id = data.id;
        self.name = data.name;
        self.updated = data.updated;

        if(self.updated){
            self.captureRate = data.captureRate;
            self.evolvesFromId = data.evolvesFromId;
            self.evolvesFromName = data.evolvesFromName;
            // add here more info from the evolve update
        }
    }

    function getIdFromURL(url){
        var pattern = /http:\/\/pokeapi\.co\/api\/v2\/.*?\/(\d+)\//;
        var id = url.match(pattern)[0];
        return id;
    }

    self.CapatalizeName = function(){
        return self.name.charAt(0).toUpperCase() + self.name.slice(1);
    }
    
}