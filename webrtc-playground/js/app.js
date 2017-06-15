"use strict";

angular.module('app', [
        // Angular
        'ngRoute',
        // Custom
        'services-video',
        'components-video'
    ]).controller('AppCtrl', function ($scope) {
        $scope.name = 'Playground';

    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/single-video', {
                templateUrl: 'content/single-video'
            })
            .when('/peer-connection', {
                templateUrl: 'content/peer-connection.html'
            })
            .when('/simple-webrtc', {
                templateUrl: 'content/simple-webrtc.html'
            })
//            .when('/services', {
//                templateUrl: 'content/services.html'
//            })
//            .when('/talking-to-the-server', {
//                templateUrl: 'content/talking-to-the-server.html'
//            })
            .otherwise({redirectTo: '/single-video'})
    })
;