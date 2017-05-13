angular.module('pokemon.services')

    .factory('PlayerFactory', function ($localStorage) {
        var player = {};
        var avglocation;
        var locations = [];
        var spawnDistance = 10;

        var getPlayerInfo = function () {
            if ($localStorage["player"] !== undefined) {
                player = JSON.parse($localStorage["player"]);
                avglocation = null;
                locations = [];
                return player;
            } else {
                player.distanceWalked = 0;
                avglocation = null;
                locations = [];
            }
        }

        var updateLocation = function (location) {
            if (locations.length === 10) {
                var newAvgLocation = getAverageLocation();
                if (avglocation != null) {
                    var dist = calculateDistance(newAvgLocation);
                    if (player.distanceWalked != 0 && player.distanceWalked % spawnDistance > (player.distanceWalked + dist) % spawnDistance) {
                        // spawnPoke();
                        console.log('spawnPoke');
                        var div = document.getElementById('pokespawn');
                        div.innerHTML = div.innerHTML + "spawnPoke\n";
                    }
                    player.distanceWalked += dist;
                }
                avglocation = newAvgLocation;
                locations = [];
            }
            player.location = location;
            locations.push(location);
            savePlayer();
            return player;
        }

        function getAverageLocation() {
            var lat = 0;
            var long = 0;
            var loc = {};
            for (var i = 0; i < locations.length; i++) {
                lat += locations[i].lat;
                long += locations[i].long;
            }
            loc.lat = (lat / locations.length);
            loc.long = (long / locations.length);
            return loc;
        }

        function savePlayer() {
            $localStorage["player"] = JSON.stringify(player);
        }

        function calculateDistance(location) {
            var R = 6371000; // m
            var dLat = toRad(location.lat - avglocation.lat);
            var dLon = toRad(location.long - avglocation.long);
            var lat1 = toRad(avglocation.lat);
            var lat2 = toRad(location.lat);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        }

        function toRad(Value) {
            return Value * Math.PI / 180;
        }

        return {
            getPlayerInfo: getPlayerInfo,
            updateLocation: updateLocation
        };
    })