"use strict";
angular.module('MyApp',[
        'ngRoute',
        'app-controller',
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
    }]);
