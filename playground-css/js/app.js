"use strict";

angular.module('cssPlayground', [
        // Angular modules
        'ngRoute',      //routing
        'ngAnimate',     //animations

        // Custom modules go here...
        'common-utils',   //logging, notifications...
        'components',
        'isoTest'


        // 3rd party modules go here...
        // 'ui.bootstrap'
    ])
    .config(function ($provide) {
        // View the Exception Service Decorator section of the 'Angular from Scratch with Hot Towel' module
        // from the 'Building Apps with Angular and Breeze course.
        // $provide decorator allows you decorate an newly created of existing angular service.
        //$provide.decorator
    })
    .config(function ($locationProvider) {
//        $locationProvider.html5Mode(true);
//        $locationProvider.hashPrefix('!');
    })
    // config is executed before run
    .config(function ($routeProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'content/main.html'
            })
            .when('/fonts', {
                templateUrl: 'content/fonts.html'
            })
            .when('/transitions', {
                templateUrl: 'content/transitions.html'
            })
            .when('/animations', {
                templateUrl: 'content/animations.html'
            })
            .when('/hellofromrouteprovider', {
                template: '<div><h1>Hello from the $routeProvider</h1></div>'
            })
            .when('/flat-ui-swatches', {
                templateUrl:'content/flat-ui-swatches.html'
            })
            .when('/flat-ui-swatches', {
                templateUrl:'content/flat-ui-swatches.html'
            })
            .when('/isotope', {
                templateUrl:'content/isotope2.html'
            })
            .when('/yahoo-slider', {
                templateUrl:'content/yahoo-slider.html'
            })
            // DEFAULT ROUTE
            .otherwise({redirectTo: '/main'});

    })
    // run is executed after config
    .run(function () {
    })
    .controller('AppCtrl', function ($scope, notifier) {
        $scope.name = 'AppCtrl'

        $scope.testNotify = function () {
            notifier.notify('Test');
        }

        $("#slider").on("scroll", function() {
            $(".slides").css({
                "background-position": $(this).scrollLeft()/6-100+ "px 0"
            });
        });

    })
;