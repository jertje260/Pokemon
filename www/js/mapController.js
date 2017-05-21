angular.module('pokemon.controllers')

    .controller('MapCtrl', function ($scope, $cordovaGeolocation, $ionicLoading, PlayerFactory, $ionicPlatform, GameFactory, PokemonFactory) {
        var posOptions = { timeout: 10000, enableHighAccuracy: true };
        $scope.player = PlayerFactory.getPlayerInfo();
        $scope.poke = null;

        $ionicPlatform.ready(function () {


            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    updateLocation(position);
                    initialize();
                    createMarker();
                    center();
                }, function (err) {
                    // error
                    console.warn(err.code + '::::' + err.message);
                });


            var watchOptions = {
                timeout: 10000,
                enableHighAccuracy: true // may cause errors if true
            };

            var watch = $cordovaGeolocation.watchPosition(watchOptions);
            watch.then(
                null,
                function (err) {
                    // error
                    console.warn(err.code + '::::' + err.message);
                },
                function (position) {
                    updateLocation(position);
                    updateMarker();
                    center();
                    if($scope.player.spawnPoke){
                        spawnPoke();
                    }
                });
        });


        function updateLocation(position) {
            var location = {};
            location.lat = position.coords.latitude;
            location.long = position.coords.longitude;
            $scope.player = PlayerFactory.updateLocation(location);

        }

        function center(){
            $scope.map.setCenter(new google.maps.LatLng($scope.player.location.lat, $scope.player.location.long));
        }

        function initialize() {
            var myLatlng = new google.maps.LatLng($scope.player.location.lat, $scope.player.location.long);

            var mapOptions = {
                center: myLatlng,
                zoom: 18,
                styles: [
                    { "featureType": "administrative", "elementType": "all", "stylers": [{ "visibility": "off" }] }, 
                    { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#AFFFA0" }] },
                    { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },  
                    { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, 
                    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#59A499" }] }, 
                    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#F0FF8D" }, { "weight": 2.2 }] }, 
                    { "featureType": "water", "elementType": "all", "stylers": [{ "visibility": "on" }, { "color": "#1A87D6" }] }],
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false,
                scaleControl: false,
                draggable: false,
                disableDefaultUI: true,
                disableDoubleClickZoom: true
            };
            map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            $scope.map = map;
        }

        function createMarker() {
            var markerImage = new google.maps.MarkerImage('img/ash.png',
                new google.maps.Size(60, 86),
                new google.maps.Point(0, 0),
                new google.maps.Point(30, 43));
            $scope.locationMarker = new google.maps.Marker({
                position: new google.maps.LatLng($scope.player.location.lat, $scope.player.location.long),
                map: $scope.map,
                icon: markerImage
            });
        }

        function updateMarker() {
            $scope.locationMarker.setPosition(new google.maps.LatLng($scope.player.location.lat, $scope.player.location.long));
        }


        function spawnPoke(){
            var pokeid = GameFactory.spawnPoke();
            $scope.poke = PokemonFactory.getById(pokeid);
            console.log('new poke: '+ $scope.poke.name);
            PlayerFactory.pokeActive(true);
            PlayerFactory.pokeSpawned();
            GameFactory.doGamePlay($scope.poke, resetPoke);
        }

        function resetPoke(){
            $scope.poke = null;
            PlayerFactory.pokeActive(false);
        }

        $scope.triggerPokeSpawn = function(){
            spawnPoke();
        }

    })