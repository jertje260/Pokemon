angular.module('pokemon.services')

    .factory('ShareFactory', function ($cordovaSocialSharing) {
        var share = function(body, sub, file){
            $cordovaSocialSharing.share(body, sub, file, null ,function(result){
                //success
            }, function(err){
                console.error('error while sharing');
                console.error(err);
            })
        }

        return{
            share:share
        }
    })