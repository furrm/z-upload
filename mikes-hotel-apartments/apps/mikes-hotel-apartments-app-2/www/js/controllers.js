angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout, appData, $mdBottomSheet, $ionicActionSheet) {

        $scope.showActionSheet = function(args)
        {
            console.log("Ionic Action Sheet Click", args); // todo: delete me

            $ionicActionSheet.show({
                titleText: 'ActionSheet Example',
                cancelText: 'Cancel',
                buttons: [
                    { text: 'Share' },
                    { text: '<i class="icon ion-arrow-move"></i> Move' },
                ],
                buttonClicked: function(index) {
                    console.log("Ionic Action Sheet Button Click", index); // todo: delete me

                    //return true;
                }
            });
        };

        $scope.showAccommodationBottomSheet = function ($event, what) {
            console.log('BottomSheetAlert', $event); // todo: delete me
            console.log('BottomSheetAlert', what); // todo: delete me


            if (what) {
                switch (what.type) {
                    case "bottom-sheet":
                        $mdBottomSheet.show({
                            templateUrl: 'templates/bottom-sheets/generic.html',
                            controller: 'BottomSheetCtrl',
                            locals: {Link: what},
                            targetEvent: $event
                        }).then(function (clickedItem) {
                            //$scope.alert = clickedItem.name + ' clicked!';
                        });
                        break;
                    default :
                        alert('Bugger!');
                }


            }


        };
        


        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('HomeCtrl', function ($scope) {

        //$scope.testData = {title:"123"};
        $scope.playlists = [
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3},
            {title: 'Indie', id: 4},
            {title: 'Rap', id: 5},
            {title: 'Cowbell', id: 6}
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })

    .controller('TilesCtrl', ['$scope', 'Tiles', function ($scope, Tiles) {

        $scope.name = 'TilesCtrl';

        $scope.items = Tiles.data;

    }])
    .controller('BottomSheetExample', function ($scope, $timeout, $mdBottomSheet, $element) {

        console.log('BottomSheetElement', $element); // todo: delete me

        $scope.alert = '';
        $scope.showListBottomSheet = function ($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'components/masonry/bottom-sheet-list-template.html',
                controller: 'ListBottomSheetCtrl',
                targetEvent: $event,
                parent: $element
            }).then(function (clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        $scope.showGridBottomSheet = function ($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'components/masonry/bottom-sheet-grid-template.html',
                controller: 'GridBottomSheetCtrl',
                targetEvent: $event,
                parent: $element
            }).then(function (clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };

        $scope.showHomeBottomSheet = function ($event) {
            $scope.alert = '';
            $mdBottomSheet.show({
                templateUrl: 'components/masonry/bottom-sheet-grid-home.html',
                controller: 'ListBottomSheetCtrl',
                targetEvent: $event,
                parent: $element
            }).then(function (clickedItem) {
                $scope.alert = clickedItem.name + ' clicked!';
            });
        };
    })
    .controller('ListBottomSheetCtrl', function ($scope, $mdBottomSheet) {
        $scope.items = [
            {name: 'Share', icon: 'share'},
            {name: 'Upload', icon: 'cloud_upload'},
            {name: 'Copy', icon: 'content_copy'},
            {name: 'Print this page', icon: 'print'},
        ];
        $scope.listItemClick = function ($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
    })
    .controller('GridBottomSheetCtrl', function ($scope, $mdBottomSheet) {
        $scope.items = [
            {name: 'Hangout', icon: 'hangout'},
            {name: 'Mail', icon: 'mail'},
            {name: 'Message', icon: 'message'},
            {name: 'Copy', icon: 'copy2'},
            {name: 'Facebook', icon: 'facebook'},
            {name: 'Twitter', icon: 'twitter'},
        ];
        $scope.listItemClick = function ($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
    })


    .controller('AccommodationCtrl', ['$scope', function ($scope) {
        $scope.name = 'AccommodationCtrl';
    }])

    .controller('AccommodationBottomSheetCtrl', function ($scope, $mdBottomSheet) {
        $scope.items = [
            {name: 'Share', icon: 'share'},
            {name: 'Upload', icon: 'cloud_upload'},
            {name: 'Copy', icon: 'content_copy'},
            {name: 'Print this page', icon: 'print'},
        ];
        $scope.listItemClick = function ($index) {
            var clickedItem = $scope.items[$index];
            $mdBottomSheet.hide(clickedItem);
        };
    })

    .controller('BottomSheetCtrl', ['$scope', 'BottomSheet', 'Link', function ($scope, BottomSheet, Link) {

        // Link is injected into this controller.
        $scope.linkInfo = Link;
        $scope.filter = Link.ref;

        $scope.name = 'BottomSheet';
        $scope.data = BottomSheet.data;

        $scope.navigateTo = function(to, event) {

        };

    }])
;



