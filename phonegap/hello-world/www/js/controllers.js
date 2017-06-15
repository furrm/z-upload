angular.module('App.controllers', [])
    .controller('AppCtrl', function ($scope, phoneGap) {

        phoneGap.bindToEvents();

//        $scope.phoneStatus = phoneGap.getEvents();

        $scope.displayPhoneStatus = function () {
//            $scope.phoneStatus = phoneGap.getEvents();
            $scope.$digest();
        };

//        $scope.phoneStatus = phoneGap.getEvents();


//        $scope.$watchCollection('phoneStatus', function (newValue, oldValue) {
//            $scope.newValue = newValue;
//            $scope.oldValue = oldValue;
//        });

        $scope.$watchCollection(phoneGap.allEvents, function (newValue, oldValue) {
            $scope.newValue = newValue;
            $scope.oldValue = oldValue;
        });

//        $scope.phoneStatus = phoneGap.getEvents();

    })
    .controller('MainCtrl', function ($scope, $rootScope, $log, phoneGap) {
        $log.info('Main Controller Initialized');


    })
    .controller('ViewCtrl', ['$scope', , function ($scope) {
        $scope.status = "Also totally works!";

        $scope.writeToLog = function () {
            console.log('Hello from PhoneGap');
        };
    }]);
