// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', [
    // ionic specific
    'ionic',
    'starter.controllers',
    'starter.services',

    'ngResource',
    // 3rd party lib
    'angular-contentful'

])

    .run(function ($ionicPlatform, contentfulConfig) {


        // configure angular-contentful
        contentfulConfig.spaceId = "lx12mec53sjz";
        contentfulConfig.accessToken = "ba94d6d0af027b1effcc78cb13fea789be20b8b211991a33bb4a06d09a46e9dd";


        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
      .state('sidemenu', {
          url: "/side",
          abstract: true,
          templateUrl: "side-menu.html"
      })
      .state('sidemenu.home', {
          url: "/home",
          views: {
              'menuContent' :{
                  templateUrl: "templates/views/home.html"
              }
          }
      })
//    .state('tab', {
//      url: "/tab",
//      abstract: true,
//      templateUrl: "templates/tabs.html"
//    })
//
//
//    // Each tab has its own nav history stack:
//
//    .state('tab.dash', {
//      url: '/dash',
//      views: {
//        'tab-dash': {
//          templateUrl: 'templates/tab-dash.html',
//          controller: 'DashCtrl'
//        }
//      }
//    })
//
//    .state('tab.friends', {
//      url: '/friends',
//      views: {
//        'tab-friends': {
//          templateUrl: 'templates/tab-friends.html',
//          controller: 'FriendsCtrl'
//        }
//      }
//    })
//    .state('tab.friend-detail', {
//      url: '/friend/:friendId',
//      views: {
//        'tab-friends': {
//          templateUrl: 'templates/friend-detail.html',
//          controller: 'FriendDetailCtrl'
//        }
//      }
//    })
//
//    .state('tab.account', {
//      url: '/account',
//      views: {
//        'tab-account': {
//          templateUrl: 'templates/tab-account.html',
//          controller: 'AccountCtrl'
//        }
//      }
//    })

//        start: side menu

//        end: side menu

  // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise("/side/home");

})

//.config(function(){
//
//        contentfulConfig.spaceId = "lx12mec53sjz";
//        contentfulConfig.accessToken = "ba94d6d0af027b1effcc78cb13fea789be20b8b211991a33bb4a06d09a46e9dd";
//
//
//    })

;

