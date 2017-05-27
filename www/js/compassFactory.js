angular.module('pokemon.services')

    .factory('CompassFactory', function () {
        var watchId;
        var startWatching = function(update){
            if(watchId !== undefined || watchId != null){
                stopWatching();
            }
            watchId = navigator.compass.watchHeading(function(heading){
                if(typeof update === 'function' && heading.magneticHeading !== 0){
                    update(heading);
                }
            },
            function(error){
                console.error(error);
            })
        }

        var stopWatching = function(){
            navigator.compass.clearWatch(watchId);
            watchId = null;
        }
        return {
            startWatching : startWatching,
            stopWatching : stopWatching
        }
    })