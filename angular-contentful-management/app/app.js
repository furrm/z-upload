"use strict";

angular.module('app', [
    'ngRoute',
    'ngResource',
    'angular-contentful',
    'app-controllers',
    'caching-service'
])

    // start:application routes
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'templates/views/home.html',
                controller: 'EndpointCtrl'
            })
            .when('/auth', {
                templateUrl: 'templates/views/json-output.html',
                controller: 'AuthCtrl'
            })
            .when('/json-output', {
                templateUrl: 'templates/views/json-output.html',
                controller: 'EndpointCtrl'
            })
            .when('/json-output/spaces', {
                templateUrl: 'templates/views/json-output.html',
                controller: 'EndpointCtrl'
            })
            .when('/json-output/spaces/:spaceId', {
                templateUrl: 'templates/views/json-output.html',
                controller: 'EndpointCtrl'
            })
            .when('/json-output/spaces/:spaceId/:type', {
                templateUrl: 'templates/views/json-output.html',
                controller: 'EndpointCtrl'
            })
            .when('/json-output/spaces/:spaceId/:type/:id', {
                templateUrl: 'templates/views/json-output.html',
                controller: 'EndpointCtrl'
            })
            .otherwise({redirectTo: '/main'});

//        $locationProvider.html5Mode(true);
    }])
    // end:application routes

    .run(function (contentfulConfig, cache) {

        // Populate the angular-contentful configuration.
//        contentfulConfig.spaceId = '70oeg2af4yo7';
//        contentfulConfig.accessToken = '99d1c0825184b1a9928f3eb1816faa36be82b170692e3540e8a0e223be1884ad';
//        console.log('cache', cache);
        // Allen & Overy: Mike - Playground
        contentfulConfig.spaceId = 'zpp0viuq4x1e';

        // TODO: Handle the scenario where the key is unavailable
        // Get the access token from the permanent cache.
        contentfulConfig.accessToken = cache.readPermanentCache('access_token');



//        contentfulConfig.accessToken = '9a1508dd1d7de70287bbfe3e5b54c99b777abd863f73d9f5e6fa0eb78c6e09bc';

        console.log('contentfulConfig',contentfulConfig);
    })

;