// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('demoApp', ['ionic','demoApp.controllers'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })
    })

    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider

            // try out vibrate
            .state('mainmenu', {
                url: "/mainmenu",
                templateUrl: "templates/mainmenu.html"
            })

            // try out vibrate
            .state('vibratepage', {
                url: "/vibrate",
                templateUrl: "templates/vibrate.html",
                controller: 'VibrateCtrl'
            })

            // use device
            .state('devicepage', {
                url: '/device',
                templateUrl: 'templates/device.html',
                controller: "DeviceCtrl"
            })

            // barcode scanner
            /*
            .state('barcodescanpage', {
                url: '/barcode',
                templateUrl: 'templates/barcode.html',
                controller: "BarcodeScannerCtrl"
            })

             // toast control
             .state('toastpage', {
             url: "/toast",
             templateUrl: "templates/toast.html",
             controller: 'ToastCtrl'
             })
             // authenticate user to app
             .state('geolocationpage', {
             url: "/geolocation",
             templateUrl: "templates/geolocation.html",
             controller: 'GeolocationCtrl'
             })
             */
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/mainmenu');
    });



