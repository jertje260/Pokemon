// Ionic Pokemon App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'pokemon' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'pokemon.services' is found in services.js
// 'pokemon.controllers' is found in controllers.js
angular.module('pokemon', ['ionic', 'pokemon.controllers', 'pokemon.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.map', {
    url: '/map',
    views: {
      'map': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.dex', {
      url: '/dex',
      views: {
        'dex': {
          templateUrl: 'templates/pokedex.html',
          controller: 'DexCtrl'
        }
      }
    })
    .state('tab.dex-detail', {
      url: '/dex/:pokeId',
      views: {
        'dex': {
          templateUrl: 'templates/dex-detail.html',
          controller: 'DexDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');

})
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
});

