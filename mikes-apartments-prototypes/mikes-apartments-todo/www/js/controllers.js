angular.module('mikes-controllers', ['ionic'])
    .controller('AppCtrl',
    ['$scope', '$location', '$ionicModal', '$ionicSideMenuDelegate', '$state', '$rootScope', 'contentful','contentfulConfig', 'utilityService', 'appSettings',
        function ($scope, $location, $ionicModal, $ionicSideMenuDelegate, $state, $rootScope, contentful, contentfulConfig, utilityService, appSettings) {
            $scope.appname = 'AppCtrl';

            $scope.doBroadcast = function(){
                $rootScope.$broadcast('IONIC-PLATFORM-READY-BROADCAST');
                $rootScope.$emit('IONIC-PLATFORM-READY-EMIT');
            };

            var spaceId, id, query;

            spaceId = contentfulConfig.spaceId;

            appSettings.appId = "5rzOrLJdHqYEqA2mMgEQY2";


            query = {
                "sys.id": appSettings.appId,
                "include": "10"
            };
            


            getData();

            function getData(){
                contentful.contentDelivery.httpGet(
                    spaceId,
                    "entries",
                    undefined,
                    query
                ).then(
                    function (response) { // SUCCESS CALLBACK
                        var log = {
                            data: response.data,
                            status: response.status,
                            headers: response.headers,
                            config: response.config
                        };

                        console.log('SUCCESS CALLBACK', log);
                        $scope.serviceOutput = response.data;

                        localStorage.setItem(appSettings.appId, JSON.stringify(response.data));

                        $rootScope.$broadcast('got-data', appSettings.appId);

                        //todo: bind menu items
                        var leftMenuItems = utilityService.menuBuilder("left-menu", appSettings.appId);
                        var rightMenuItems = utilityService.menuBuilder("right-menu", appSettings.appId);
                        $scope.leftMenu = leftMenuItems;
                        $scope.rightMenu = rightMenuItems;


                        // todo: prettify the JSON output ...
                        // ... see: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript

                    },
                    function (data, status, headers, config) { // ERROR CALLBACK
                        var log = {
                            data: data,
                            status: status,
                            headers: headers,
                            config: config
                        };

                        console.log('ERROR CALLBACK', log);
                    }
                );
            };


            // styling for the image container at the top of each page
            $scope.pageTopStyle = "height: " + screen.width + "px; width: " + screen.width + "px;";

            $scope.doRefresh = function(){
                console.log("RERESHING!!"); // todo: delete me
                utilityService.removeLocalCache(appSettings.appId);
                getData();
            };


        }])

    .controller('SettingsCtrl', ['$scope', function ($scope) {
        $scope.name = 'SettingsCtrl';

        $scope.settingsMenu =
            [
                {"title": "Device", "link": "app.device"},
                {"title": "File", "link": "app.file"}
            ]


    }])

    .controller('DeviceCtrl', ['$scope', 'DeviceService', '$cordovaDevice', function ($scope, DeviceService, $cordovaDevice) {
        $scope.name = 'DeviceCtrl';

        $scope.deviceVersion = DeviceService.getVersion();
        $scope.deviceCordova = DeviceService.getCordova();
        $scope.deviceModel = DeviceService.getModel();
        $scope.deviceName = $cordovaDevice.getVersion();
        $scope.devicePlatform = DeviceService.getPlatform();
//        $scope.deviceUUID = DeviceService.getUUID();
        $scope.deviceUUID = $cordovaDevice.getUUID();


//            $scope.deviceVersion = DeviceService.getDeviceVersion();
    }])

    .controller('FileCtrl', ['$scope', '$ionicPlatform', '$cordovaFile', function ($scope, $ionicPlatform, $cordovaFile) {

        var directory;
        var file = "mike.txt";

        $ionicPlatform.ready(function(){
            $scope.status = "READY!!!";

            directory = cordova.file.applicationStorageDirectory;

            try {
                $scope.status = cordova.file.dataDirectory
            } catch (e) {
                $scope.status = "Can't get directory!!"
            }

        });

        $scope.createFile = function(){



        };

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

        $scope.getDir = function(){

            var dir;

            try {
//                $scope.status = cordova.file.dataDirectory
                $scope.status = cordova.file.applicationStorageDirectory
            } catch (e) {
                $scope.status = "Can't get directory!!"
            }


        }




    }])

    // controller for all page templates
    .controller('PageCtrl', ['$scope', '$state', '$timeout', 'utilityService', 'appSettings', '$ionicSlideBoxDelegate',
        function ($scope, $state, $timeout, utilityService, appSettings, $ionicSlideBoxDelegate) {

            $scope.watchVar = Math.random();

            $scope.$on('got-data', function (theEvent, args) {

                $scope.watchVar = Math.random();
                $scope.$broadcast('scroll.refreshComplete');

            });

            function BuildPage() {
                if ($state.current.name == "app.home") { // we're on the home page

                    // get the home page pageId...
                    var leftMenuData = utilityService.menuBuilder("left-menu", appSettings.appId);

                    // find the menu item that has app.home as the url
                    var foundMenuItem = _.find(leftMenuData, function (menuItem) {
                        return menuItem.fields.url == "app.home";
                    });

                    var page = utilityService.pageBuilder(foundMenuItem.fields.page.sys.id);

                    console.log(page); // todo: delete me

                    $scope.page = page;

                    $ionicSlideBoxDelegate.update();

                }
                else {

                    var pageId = $state.params.pageId;

                    var page = utilityService.pageBuilder(pageId);

                    $scope.page = page;

                    $ionicSlideBoxDelegate.update();

                }
            }

            $scope.$watch('watchVar', function () {

                $timeout(function () {
                    $scope.$apply(function () {

                        BuildPage();

                    });

                });

            });


            $scope.getImageUrl = function (url) {
                return "http:" + url;
            };

            $scope.parseBody = function (bodyText) {
                return marked.parse(bodyText);
            };

    }])

    // controller for all page templates
    .controller('WebCamCtrl', ['$scope', '$state', '$timeout','utilityService',
        function ($scope, $state, $timeout, utilityService) {

            var webCamUrl;

            $scope.watchVar = Math.random();

            $scope.$on('got-data', function (theEvent, args) {

                $scope.watchVar = Math.random();
                $scope.$broadcast('scroll.refreshComplete');

            });

            function BuildPage(){
                $scope.pageId = $state.params.pageId;

                var pageData = utilityService.pageBuilder($scope.pageId);

                webCamUrl = pageData.fields.externalImage.fields.url;

                $scope.page = pageData;
            };

            $scope.$watch('watchVar', function () {

                $timeout(function () {
                    $scope.$apply(function () {

                        BuildPage();
                        $scope.page.fields.externalImage.fields.url = webCamUrl + '?decache=' + Math.random();
                    });

                });

            });

    }])
;