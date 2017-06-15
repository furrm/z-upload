"use strict";
angular.module('app-controller', [])
.controller('AppCtrl', ['$scope', '$timeout', function($scope, $timeout){
        $scope.name = 'AppCtrl';

        $scope.items = [];


        $timeout(function(){
            $scope.items.push(
                {id:1, title:'tile1'},
                {id:2, title:'tile2'},
                {id:3, title:'tile3'}
            );
        }, 5000);



    }])
;