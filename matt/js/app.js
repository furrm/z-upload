angular.module('app', [])
    .controller('appCtrl', ['$scope', function($scope){
            $scope.name = 'Matt';
        }])
.directive('matt', function(){
        return{
            restrict:'E',
            templateUrl:'templates/matt.html'
        }
    })
;