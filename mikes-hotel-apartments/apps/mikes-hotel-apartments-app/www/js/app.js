// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', [
    'ionic',
    'ng.contentful.config',
    'ng.contentful',
    'app.controllers',
    'app.components',
    'app.services'])

    .run(function ($ionicPlatform, contentfulConfig) {
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

            // contentful configuration
            contentfulConfig.spaceId = "lx12mec53sjz";
            contentfulConfig.accessToken = "ba94d6d0af027b1effcc78cb13fea789be20b8b211991a33bb4a06d09a46e9dd";
            


        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // initial state for bootstrapping the app
//            .state('bootstrap', {
//                url: '/bootstrap',
//                templateUrl: 'templates/bootstrap.html',
//                controller: 'BootstrapCtrl'
//
//            })

            // abstract state for app side menu and content
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/app.html"
            })



            // LEVEL 1 NAVIGATION

            .state('app.home', {
                url: "/home",
                views: {
                    'appContent': {
                        templateUrl: 'templates/level-1.html',
                        resolve: {
                            pageData: function () {
                                return {
                                    "title": "Welcome to Mike's Hotel and Apartments",
                                    "headerImage":"img/pool-chair.jpg"
                                };
                            }
                        },
                        controller: function ($scope, pageData) {

                            $scope.pageData = pageData;

                        }
                    }
                }
            })


            .state('app.accommodation', {
                url: "/accommodation",
                views: {
                    'appContent': {
                        templateUrl: 'templates/level-1.html',
                        resolve: {
                            pageData: function () {
                                return {
                                    "title": "Accommodation",
                                    "headerImage":"img/MikeStudiosApartmentsCreteTop.jpg",
                                    "cards": [
                                        {"displayName": "Hotel", "url": "app.hotel"},
                                        {"displayName": "Apartments", "url": "app.apartments"}
                                    ]
                                };
                            }
                        },
                        controller: function ($scope, pageData) {

                            $scope.pageData = pageData;

                        }

                    },
                    "accommodationContent":{
                        "template":"<div>app.accommodation.accommodationContent</div>"
                    }
                }
            })

            // LEVEL 2 NAVIGATION
//            .state('page', {
//                url: "/page",
//                abstract: true,
//                templateUrl: "templates/page.html"
//            })


//            .state('app.accommodation.hotel', {
//                url: "/accommodation/hotel",
//                views: {
//                    'appContent': {
//                        templateUrl: 'templates/hotel.html',
//                        resolve: {
//                            pageData: function () {
//                                return {"title": "Hotel"};
//                            }
//                        },
//                        controller: function ($scope, $stateParams, pageData) {
//
//                            $scope.title = pageData.title;
//
//
//
//                        }
//                    }
//                }
//            })

            .state('app.apartments', {
                url: "/accommodation/apartments",
                views: {
                    'appContent': {
                        templateUrl: 'templates/level-2.html',
                        resolve: {
                            pageData: function () {
                                return {"title": "Apartments"};
                            }
                        },
                        controller: function ($scope, pageData) {

                            $scope.title = pageData.title;

                        }
                    }
                }
            })

        ;


        // if none of the above states are matched, use this as the fallback
//        $urlRouterProvider.otherwise('/bootstrap');
  $urlRouterProvider.otherwise('/app/home');

    });
