"use strict";
angular.module('app-controller', [])
.controller('AppCtrl', ['$scope', function($scope){
        $scope.name = 'AppCtrl';

        $scope.items = [
                    {id:1, title:'tile1'},
                    {id:2, title:'tile2'},
                    {id:3, title:'tile3'}
                ];
    }])
;