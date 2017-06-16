angular.module('app', [
    'ngMaterial'
])
.controller('AppCtrl', ['$scope', '$mdBottomSheet', function($scope, $mdBottomSheet){
        $scope.name = 'AppCtrl';


    }])
;
