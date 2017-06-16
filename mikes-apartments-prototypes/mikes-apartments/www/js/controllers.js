angular.module('mikes-controllers', [])
    .controller('AppCtrl', ['$scope', '$location', '$ionicModal', '$ionicSideMenuDelegate', '$state',
        function ($scope, $location, $ionicModal, $ionicSideMenuDelegate, $state) {
            $scope.name = 'AppCtrl';

        }])

    .controller('SettingsCtrl', ['$scope', function ($scope) {
        $scope.name = 'SettingsCtrl';

        $scope.settingsMenu =
            [
                {"title": "Device", "link": "app.device"},
                {"title": "File", "link": "app.file"}
            ]


    }])

    .controller('DeviceCtrl', ['$scope', 'DeviceService', function ($scope, DeviceService) {
        $scope.name = 'DeviceCtrl';

        $scope.deviceVersion = DeviceService.getVersion();
        $scope.deviceCordova = DeviceService.getCordova();
        $scope.deviceModel = DeviceService.getModel();
        $scope.deviceName = DeviceService.getName();
        $scope.devicePlatform = DeviceService.getPlatform();
        $scope.deviceUUID = DeviceService.getUUID();


//            $scope.deviceVersion = DeviceService.getDeviceVersion();
    }])

    .controller('FileCtrl', ['$scope', '$cordovaFile', function ($scope, $cordovaFile) {

        var dirName = "MyDirectory";

        $scope.name = 'FileCtrl';

        $scope.status = "waiting...";

        $scope.createDir = function(){
            $scope.status = "attempting to crete directory...";

            try {
                $cordovaFile.createDir("Mikes", false).then(function (result) {
                    $scope.status = "It worked!!";
                }, function (err) {
                    $scope.status = "It didn't work!";

                });
            } catch (e) {
                console.log(e); // todo: delete me
            } finally {
                $scope.status = "EXCEPTION!!!";

            }


        }




    }])

    .controller('PageCtrl', ['$scope', function ($scope) {
        $scope.name = 'PageCtrl';



        $scope.screenWidth = screen.width;

        $scope.pageTopStyle = "height:" + screen.width + "px; width:" + screen.width + "px;";



    }])
;