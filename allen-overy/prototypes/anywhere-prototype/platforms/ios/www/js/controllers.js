angular.module('app.controllers', [])

    .controller('DashCtrl', function ($scope) {
    })

    .controller('FriendsCtrl', function ($scope, Friends) {
        $scope.friends = Friends.all();
    })

    .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })

    .controller('AccountCtrl', function ($scope) {
    })

    .controller('ApplicationCtrl', ['$scope', '$ionicLoading', 'contentDeliveryApi', 'ContentTypeCacheFactory',
        function ($scope, $ionicLoading, contentDeliveryApi, ContentTypeCacheFactory) {

            var tiles = [
                {id: 1, title: '1by1', size: '4,4', template: 'image', imageUrl: "img/redHairWoman.jpg",
                    caption: "#Elevating Women\nA look inside eBay’s effort to encourage gender diversity"},
                {id: 1, title: '1by1', size: '2,2', template: 'image', imageUrl: "img/robot.jpg",
                    caption: "#Manager vs. machine\nTechnology is getting smarter and faster. Are you?"},
                {id: 1, title: '1by1', size: '2,2', template: 'image', imageUrl: "img/binary.jpg",
                    caption: "#Getting the CMO and CIO to work as partners\nTo turn new technologies into profits and growth, marketing and IT will need to change how they work—and how they work together."}
//            {id: 1, title: '1by1', size: '2,2', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '2,2', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '2,2', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: '1by1', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 1, title: 'ONE', size: '2,4', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 2, title: 'TWO', size: '2,4', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 3, title: 'THREE', size: '2,4', template: 'video', imageUrl: "img/bridge.jpg"},
//            {id: 4, title: 'FOUR', size: '2,4', template: 'video', imageUrl: "img/bridge.jpg"},
//            {id: 5, title: 'FIVE', size: '1,1', template: 'image', imageUrl: "img/westminster.jpg"},
//            {id: 5, title: 'SIX', size: '3,3', template: 'image', imageUrl: "img/westminster.jpg"}
            ];

            $scope.items = tiles;

//            $ionicLoading.show({template: "loading content types..."});


//            contentDeliveryApi.getContentTypes()
//                .then(function (response) {
//
//                    console.log("Response from getContentTypes:", response); // todo: delete me
//
//                    var contentTypes = response.data;
//
//                    var data = JSON.stringify(response.data);
//
//                    cacheFactory.writeLocal("contentTypes", data);
//
//                    $ionicLoading.show({template: "loading entries..."});
//
//                    contentDeliveryApi.sync(contentDeliveryApi.syncType.entry)
//                        .then(function (response) {
//
//                            console.log("Response from sync entry:", response); // todo: delete me
//
//                            var data = JSON.stringify(response.data);
//
//                            _.forEach(contentTypes.items, function (contentType) {
//
//                                ContentTypeCacheFactory.cacheDataByContentType(contentType, response.data);
//
//                            });
//
//                            cacheFactory.writeLocal(contentDeliveryApi.syncType.entry, data);
//                            cacheFactory.writeLocal("nextSyncUrl-" + contentDeliveryApi.syncType.entry, response.nextSyncUrl);
//
//                            $ionicLoading.show({template: "loading asset data..."});
//
//                            return contentDeliveryApi.sync(contentDeliveryApi.syncType.asset);
//
//
//                        })
//                        .then(function (response) {
//
//                            console.log("Response from sync asset:", response); // todo: delete me
//
//                            cacheFactory.writeLocal("nextSyncUrl-" + contentDeliveryApi.syncType.asset, response.nextSyncUrl);
//
//                            $ionicLoading.hide();
//
//                        },
//                        function (error) {
//                            syncErrorHandler(error);
//
//                        });
//
//                }, function (error) {
//
//
//                    // todo: do some sort of broadcast here
//                    syncErrorHandler(error);
//
//                });

            function syncErrorHandler(error){

                $ionicLoading.hide();


                if (error.status === 0) {
                    alert("You don't have an internet connection.");
                }
                else if(error.status == 404){
                    alert("There was a problem with the sync process. 404 err encountered");
                }


                console.log(error); // todo: delete me


            }


        }])
;


