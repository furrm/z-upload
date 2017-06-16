// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mikes', [
    'ionic',
    'ngCordova',
    'ngResource',
    'angular-contentful',
    'mikes-services',
    'mikes-controllers',
    'mikes-directives'

])
    .value('appSettings', {
        appId: ''
    })

    .run(function ($ionicPlatform, $rootScope, $state, contentfulConfig) {
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
//                StatusBar.hide();
            }


        });

        contentfulConfig.spaceId = "lx12mec53sjz";
        contentfulConfig.accessToken = "ba94d6d0af027b1effcc78cb13fea789be20b8b211991a33bb4a06d09a46e9dd";


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
                templateUrl: "templates/content/level-1/app-menu.html",
                controller: "AppCtrl"
            })
            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "templates/content/home-page.html",
                        controller: "PageCtrl"
                    }
                }
            })
            .state('app.webcam', {
                url: "/webcam/:pageId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/content/web-cam.html",
                        controller: "WebCamCtrl"
                    }
                }
            })
            .state('app.page', {
                url: "/page/:pageId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/content/page.html",
                        controller: "PageCtrl"
                    }
                }
            })
            .state('app.slider', {
                url: "/slider/:pageId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/content/page-slider.html",
                        controller: "PageCtrl"
                    }
                }
            })

            //SETTINGS
            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContent': {
                        templateUrl: "templates/content/level-1/settings.html",
                        controller: "SettingsCtrl"
                    }
                }
            })

            .state('app.device', {
                url: "/device",
                views: {
                    'menuContent': {
                        templateUrl: "templates/content/level-2/settings-device.html",
                        controller: "DeviceCtrl"
                    }
                }
            })

            .state('app.file', {
                url: "/file",
                views: {
                    'menuContent': {
                        templateUrl: "templates/content/level-2/settings-file.html",
                        controller: "FileCtrl"
                    }
                }
            })

            .state('app.nextpage', {
                url: "/nextpage",
                views: {
                    'menuContent': {
                        templateUrl: "templates/content/level-2/next-page.html"
                    }
                }
            })


        ;


        $urlRouterProvider.otherwise("/app/home");

    })
;
