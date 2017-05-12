angular.module('pokemon.services', ['ngStorage'])

    .factory('PlayerFactory', function ($localstorage) {
        var player = {};

        var getPlayerInfo = function () {
            if ($localStorage["player"] !== undefined) {
                player = JSON.parse($localStorage["player"]);
                return player;
            }
        }

        var updateLocation = function (location) {
            if (player.location === undefined) {
                player.location = location;
                player.distanceWalked = 0;
            } else {
                player.distanceWalked += calculateDistance(location);
                player.location = location;
            }
            savePlayer();
            return player;
        }

        function savePlayer() {
            $localStorage["player"] = JSON.stringify(player);
        }

        function calculateDistance(location) {
            var R = 6371000; // m
            var dLat = toRad(location.lat - player.location.lat);
            var dLon = toRad(location.long - player.location.long);
            var lat1 = toRad(player.location.lat);
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