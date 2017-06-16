angular.module('mf-ionic-controls', [])
    .controller('mfSlideBox', ['$scope', '$ionicSlideBoxDelegate', function($scope, $ionicSlideBoxDelegate){
        $scope.name = 'mfSlideBox';
        $scope.nextSlide = function() {
            $ionicSlideBoxDelegate.next();
        }
    }])
;
