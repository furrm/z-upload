"use strict";
angular.module('controllers-contentful', [])
    .controller('spacesCtrl', function ($scope, spacesSvc, notifier) {
        $scope.name = 'spacesCtrl'
//        $scope.serviceName = spacesSvc.name;

        // Using $resource
        var space = spacesSvc.getResource('3iz8fe39hhkf');
        var space = spacesSvc.getHttp();

        space.then(function(data){
             notifier.notify.success('The controller has the data...');
            console.log(data);
            $scope.space = data;
        },
        function(response){
            notifier.notify.error('The controller encountered an error...');
            console.log(response);
        })

        // Using $http
//        var space = spacesSvc.get().success(function(data){
//            notifier.notify.success('Got the data via $http...');
//            $scope.space = data;
//
//        })

    })
;