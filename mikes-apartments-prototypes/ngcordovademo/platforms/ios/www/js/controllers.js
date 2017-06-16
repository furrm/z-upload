angular.module('demoApp.controllers', [])

    .controller('VibrateCtrl', function($scope, $state ,$cordovaVibration) {

        $scope.duration = 100;
        $scope.vibrate = function() {
            console.log('Vibrating', $scope.duration);
            $cordovaVibration.vibrate($scope.duration);
        }
    })


    .controller('DeviceCtrl', function($scope, $state , $cordovaDevice) {
        var init = function() {
            $scope.device = $cordovaDevice.getDevice();
            $scope.cordova = $cordovaDevice.getCordova();
            $scope.model = $cordovaDevice.getModel();
            $scope.platform = $cordovaDevice.getPlatform();
            $scope.uuid = $cordovaDevice.getUUID();
            $scope.version = $cordovaDevice.getVersion();
        }
    })

/*
    .controller('BarcodeScannerCtrl', function($scope, $cordovaBarcodeScanner) {

    $scope.scan = function() {
        $cordovaBarcodeScanner.scan().then(function(result) {
            $scope.scanResult = JSON.stringify(result);
        }, function(err) {
            $scope.scanResult = 'SCAN ERROR (see console)'
            console.error(err);
        });
    }

    // NOTE: encoding not functioning yet
    $scope.encodeData = function() {
        $cordovaBarcodeScanner.encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com").then(function(success) {
            // Success!
        }, function(err) {
            // An error occured. Show a message to the user

        });
    }

*/

        .controller('AboutCtrl', function($scope ) {
            var init = function() {
                $scope.version = "01.01"
            }
            init();
        });