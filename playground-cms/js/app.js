"use strict";
angular.module('app', [
        'ngResource',
        'services-content'
    ])
    .controller('AppCtrl', function ($scope) {
        $scope.name = 'AppCtrl'
    })
;