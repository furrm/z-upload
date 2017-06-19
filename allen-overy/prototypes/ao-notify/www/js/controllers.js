angular.module('starter.controllers', [])

    .controller('BootstrapCtrl',
    ['$scope', 'CacheService', '$state',
        function ($scope, CacheService, $state) {
            $scope.name = 'bootstrap';

            var cachedView = JSON.parse(CacheService.localStorage.read('view'));

            if (cachedView) {

                $state.go(cachedView.stateId);

            }
            else{

                $state.go("app.home");

            }

        }])
    .controller('AppCtrl',
    ['$scope', '$timeout', '$ionicLoading', '$ionicHistory', '$ionicPopup', 'CacheService',
        function ($scope, $timeout, $ionicLoading, $ionicHistory, $ionicPopup, CacheService) {

            // cache the current view.

            var view = $ionicHistory.currentView();
            var cachedView = JSON.parse(CacheService.localStorage.read('view'));


            if (cachedView) {

                if (view != cachedView) {

                    CacheService.localStorage.write('view', JSON.stringify(view));

                }

            }
            else {

                CacheService.localStorage.write('view', JSON.stringify(view));

            }


            console.log($ionicHistory.currentView()); // todo: delete me

            $scope.isOn = false;
            $scope.wifiOn = false;

            $scope.turnOff = function () {

                $ionicLoading.show({

                    "template": "Powering down workstation.  Please wait..."

                });

                $timeout(function () {

                    $ionicLoading.hide();

                    $scope.isOn = false;

                }, 3000);

            };

            $scope.turnOn = function () {

                $ionicLoading.show({

                    "template": "Powering on workstation.  Please wait..."

                });

                $timeout(function () {

                    $ionicLoading.hide();

                    $scope.isOn = true;

                }, 3000);

            };

            $scope.wifiToggle = function(){

                $scope.wifiOn = !$scope.wifiOn;

            };

            $scope.$watch("wifiOn", function(newVal, oldVal){


                if (newVal) {
                    $ionicPopup.confirm({
                        "title": "Wifi Pass Code",
                        "template": "<div style='text-align: center'>Your Wifi pass code is:\n\n123456</div>",
                        "buttons": [
//                            {
//                                "text": "Cancel",
//                                "onTap": function (e) {
//
//                                    return false;
//
//                                }
//
//                            },
                            {
                                "text": "<b>Copy Pass Code</b>",
                                "type": "button-positive",
                                "onTap": function (e) {

                                    return true;

                                }
                            }
                        ]
                    }).then(
                        function (res) {

                            var copy = res;

                            if (copy) { // copy clicked


                            }
                            else { // cancel clicked


                            }
                        });
                } else {
                }

            });



        }])

;


//.controller('DashCtrl', function($scope) {})
//
//.controller('ChatsCtrl', function($scope, Chats) {
//  $scope.chats = Chats.all();
//  $scope.remove = function(chat) {
//    Chats.remove(chat);
//  }
//})
//
//.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//  $scope.chat = Chats.get($stateParams.chatId);
//})
//
//.controller('FriendsCtrl', function($scope, Friends) {
//  $scope.friends = Friends.all();
//})
//
//.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
//  $scope.friend = Friends.get($stateParams.friendId);
//})
//
//.controller('AccountCtrl', function($scope) {
//  $scope.settings = {
//    enableFriends: true
//  };
//});
