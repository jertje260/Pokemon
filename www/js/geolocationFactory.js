angular.module('pokemon.services')

    .factory('GeolocationFactory', function ($cordovaGeolocation) {
        var options = {
            timeout: 10000,
            enableHighAccuracy: true // may cause errors if true
        };
        var watchId;

        var getCurrentPosition = function (update) {
            $cordovaGeolocation
                .getCurrentPosition(options)
                .then(function (position) {
                    if (typeof update === 'function') {
                        update(position);
                    }
                }, function (err) {
                    // error
                    console.warn(err.code + '::::' + err.message);
                });
        }


        var startWatching = function (update) {
            if (watchId !== undefined || watchId !== null) {
                stopWatching();
            }
            var watchId = $cordovaGeolocation.watchPosition(options);
            watchId.then(
                null,
                function (err) {
                    // error
                    console.warn(err.code + '::::' + err.message);
                },
                function (position) {
                    update(position);
                });
        }

        var stopWatching = function () {
            $cordovaGeolocation.clearWatch(watchId);
            watchId = null;
        }


        return {
            getCurrentPosition: getCurrentPosition,
            startWatching: startWatching,
            stopWatching: stopWatching
        }

    })