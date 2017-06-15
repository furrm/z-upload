"use strict";
angular.module('MyApp',[
        'ngRoute',
//        'app-controller',
        'masonry'
    ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'views/main.html'
//            template:'<div>In the main!!</div>'
            })
            .otherwise({redirectTo: '/main'});

//        $locationProvider.html5Mode(true);
    }])
    .controller('AppCtrl', ['$scope', '$timeout', function($scope, $timeout){
        $scope.name = 'AppCtrl';

        $scope.items = [];

        // Emulate a service call
        $timeout(function(){
            $scope.items.push(
                {id:1, title:'tile1'},
                {id:2, title:'tile2'},
                {id:3, title:'tile3'}
            );
        }, 1000);

    }])
;
