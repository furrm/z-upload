// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', [
    'ionic',
    'app.controllers',
    'app.services',
    'ng.kanbanery.config',
    'ng.kanbanery'
])

    .run(function ($ionicPlatform, $rootScope) {
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

        // Add the config...
//        kanbaneryConfig.apiToken = "c0c5e2812d5fed2057869610e91c697d95110c7d";
//
//        $rootScope.globalSettings = kanbaneryConfig;
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            // archived tasks
            .state('app.archive', {
                url: "/archive",
                views: {
                    'menuContent': {
                        templateUrl: "templates/archive.html",
                        controller: 'ArchiveCtrl'
                    }
                }
            })

            // icebox tasks
            .state('app.icebox', {
                url: "/icebox",
                views: {
                    'menuContent': {
                        templateUrl: "templates/icebox.html",
                        controller: 'IceboxCtrl'
                    }
                }
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    "menuContent": {
                        "templateUrl": "templates/settings.html",
                        "controller": "SettingsCtrl"
                    }
                }
            })

            .state('app.settings-url', {
                url: "/url",
                views: {
                    "menuContent": {
                        "templateUrl": "templates/settings.url.html",
                        "controller": "SettingsCtrl"
                    }
                }
            })

            .state('app.settings-project', {
                url: "/project",
                views: {
                    "menuContent": {
                        "templateUrl": "templates/settings.project.html",
                        "controller": "SettingsProjectCtrl"
                    }
                }
            })

            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html"
                    }
                }
            })
            .state('app.playlists', {
                url: "/playlists",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlists.html",
                        controller: 'PlaylistsCtrl'
                    }
                }
            })

            .state('app.single', {
                url: "/playlists/:playlistId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/playlist.html",
                        controller: 'PlaylistCtrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/playlists');
    });

