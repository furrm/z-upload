// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mikes', [
    'ionic',
    'ngCordova',
    'mikes-services',
    'mikes-controllers'
])

    .run(function ($ionicPlatform, $rootScope, $state) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // Set the statusbar to use the default style, tweak this to
                // remove the status bar on iOS or change it to use white instead of dark colors.
                StatusBar.styleDefault();
            }


        });


    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/content/level-1/app-menu.html"
            })
            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/content/level-1/home.html"
                    }
                }
            })
            .state('app.checkin', {
                url: "/check-in",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/content/level-1/check-in.html"
//                        controller: "CheckinCtrl"
                    }
                }
            })

            //SETTINGS
            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/content/level-1/settings.html",
                        controller: "SettingsCtrl"
                    }
                }
            })

            .state('app.device', {
                url: "/device",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/content/level-2/settings-device.html",
                        controller:"DeviceCtrl"
                    }
                }
            })

            .state('app.file', {
                url: "/file",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/content/level-2/settings-file.html",
                        controller:"FileCtrl"
                    }
                }
            })

            .state('app.nextpage', {
                url: "/nextpage",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/content/level-2/next-page.html"
                    }
                }
            })

            .state('app.page', {
                url: "/page",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/content/page.html",
                        controller: "PageCtrl"
                    }
                }
            })



        ;


        $urlRouterProvider.otherwise("/app/home");

    })
;
