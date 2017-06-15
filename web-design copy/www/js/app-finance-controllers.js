'use strict';

angular.module('app.finance.controllers', [])
    .controller('TestCtrl', function($scope){
        $scope.name = 'Test Controller';
    })
    .controller('MatterInfoCtrl', function($scope){
        $scope.name = 'MatterInfoCtrl';
//      ToDo: Call the finance service from here.
    });
