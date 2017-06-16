angular.module('app.controllers', [
    "ng.contentful"
])

    .controller('BootstrapCtrl',
    ['$scope', '$state', '$timeout', '$ionicLoading', '$ionicPopup', '$q', '$ionicViewService', 'contentDeliveryApi',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopup, $q, $ionicViewService, contentDeliveryApi) {

            $scope.name = 'BootstrapCtrl';

            $ionicLoading.show({

                // todo: manage connectivity status?
                "template": "Getting Data..."

            });

            // set up the confirmation message should the sync operation fail.
            $scope.showPopOver = function () {
                var myPopup = $ionicPopup.confirm({
                    templateUrl: 'templates/bootstrap-modal.html',
                    title: 'Failure',
                    subTitle: 'Sorry, we encountered an issue while downloading data from the Internet',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<b>Try Again</b>',
                            type: 'button-positive',
                            onTap: function (e) {

                                return "Yo!";

//                                if (!$scope.data.wifi) {
//                                    //don't allow the user to close unless he enters wifi password
//                                    e.preventDefault();
//                                } else {
//                                    return $scope.data.wifi;
//                                }
                            }
                        }
                    ]
                });
                myPopup.then(function (res) {
//
                    getContentTypes();

                });
            };


//            $ionicModal.fromTemplateUrl('templates/bootstrap-modal.html', {
//                scope: $scope,
//                animation: 'slide-in-up'
//            }).then(function(modal) {
//                $scope.modal = modal;
//            });
//            $scope.openModal = function() {
//                $scope.modal.show();
//            };
//            $scope.closeModal = function() {
//                $scope.modal.hide();
//            };
//            //Cleanup the modal when we're done with it!
//            $scope.$on('$destroy', function() {
//                $scope.modal.remove();
//            });
//            // Execute action on hide modal
//            $scope.$on('modal.hidden', function() {
//                // Execute action
//            });
//            // Execute action on remove modal
//            $scope.$on('modal.removed', function() {
//                // Execute action
//            });

            // pseudo code:
            // get contenttypes
            // if success, save to cache
            // if failure, check for cached content items
            // if cached content items does not exist then display critical error
            // allow user to try again
            // if cached content items do exist, redirect user to home page

            // get content types


            getContentTypes();

            function getContentTypes() {

//                var promise1 = contentDeliveryApi.getContentTypes();
//                var promise2 = contentDeliveryApi.getContentTypes();

                $ionicLoading.show({

                    "template": "Getting Content Types..."

                });

                contentDeliveryApi.getContentTypes().then(
                    function (response) { // fulfilled


                        console.log("response", response); // todo: delete me

                        $ionicLoading.hide();

                        syncData();


                    },
                    function (reason) { // rejected


                        console.log("reason", reason); // todo: delete me

                        $ionicLoading.hide();

                        $scope.showPopOver();


                    },
                    function (notification) { // progress

                    }
                )


            };

            function syncData() {

                $ionicLoading.show({

                    "template": "Synchronising Data..."

                });

                $timeout(function () {

                    $ionicLoading.hide();

                    $state.go("app.home");


                }, 1000)


            };


            // use the following code for testing only
//            $timeout(function () {
//
////                $ionicLoading.hide();
//
////                showModal();
////                $state.go("app.home");
//
//
//            }, 1000)

//            function showModal(){
//                $timeout(function () {
//
//                    $scope.openModal();
//
//                }, 3000)
//            }


        }])

    .controller('HomeCtrl',
    ['$scope', '$ionicHistory', '$timeout',
        function ($scope, $ionicHistory, $timeout) {

            $ionicHistory.clearHistory(); // prevents the back button being displayed.

            $scope.name = 'HomeCtrl';

            $scope.doRefresh = function () {
                $timeout(function () {

                    $scope.$broadcast('scroll.refreshComplete');

                }, 1000)
            }

            $scope.isScrolling = function (args) {
                console.log("is scrolling", args); // todo: delete me
            }


        }])

