"use strict";

angular.module('app', [
    // Angular
        'ngRoute',
        'ngResource',
    // Custom
        // Sevices
        'common-utils',
        'services-generic',
        'services-data-context',
        'services-contentful',
        //Controllers
        'controllers-contentful'
    ])
    .config(function($routeProvider){
        $routeProvider
            .when('/main', {
                templateUrl: 'content/main.html'
            })
            .when('/general', {
                templateUrl: 'content/general.html'
            })
            .when('/controllers', {
                templateUrl: 'content/controllers.html'
            })
            .when('/services', {
                templateUrl: 'content/services.html'
            })
            .when('/talking-to-the-server', {
                templateUrl: 'content/talking-to-the-server.html'
            })
            .otherwise({redirectTo:'/main'})
    })
    .controller('AppCtrl', function ($scope, valueStringSvc, valueObjSvc, factoryObjSvc,providerSvc, peopleSvc) {
        $scope.name = 'AppCtrl';
        $scope.valueStringSvc = valueStringSvc;
        $scope.valueObjSvc = valueObjSvc;
        $scope.factoryObjSvc = factoryObjSvc;
//        $scope.serviceObjSvc= serviceObjSvc;
        $scope.providerSvc= providerSvc;
        $scope.peopleSvc = peopleSvc;

    })
;
