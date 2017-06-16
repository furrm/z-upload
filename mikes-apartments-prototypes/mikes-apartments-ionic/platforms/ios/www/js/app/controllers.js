angular.module('starter.controllers', [])

    .controller('AppCtrl', ['$scope', '$ionicSideMenuDelegate', function ($scope, $ionicSideMenuDelegate) {
        $scope.name = 'AppCtrl';
        $scope.toggleLeft = function () {
            console.log("Trying to slide menu..."); // todo: delete me
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.toggleRight = function () {
            $ionicSideMenuDelegate.toggleRight();
        };

    }])

    .controller('MainCtrl', function ($scope, $ionicSideMenuDelegate) {
        $scope.attendees = [
            { firstname: 'Nicolas', lastname: 'Cage' },
            { firstname: 'Jean-Claude', lastname: 'Van Damme' },
            { firstname: 'Keanu', lastname: 'Reeves' },
            { firstname: 'Steven', lastname: 'Seagal' }
        ];

    })
    .controller('HomeCtrl', ['$scope', "$q", "contentfulConfig", "contentful", function ($scope, $q, contentfulConfig, contentful) {
        $scope.name = 'HomeCtrl';

//        var spaceid, type, id, query
//
//        spaceid = contentfulConfig.spaceId;
//        type = "entries"
//        query = {"content_type":"Rkkf7Ild2mUaooya86a0w"};
//
//
//        contentful.contentDelivery.httpGet(
//            spaceid,
//            type,
//            undefined,
//            query
//        ).then(
//            function (response) { // SUCCESS CALLBACK
//                var log = {
//                    data: response.data,
//                    status: response.status,
//                    headers: response.headers,
//                    config: response.config
//                };
//
//                console.log('SUCCESS CALLBACK', log);
//                $scope.serviceOutput = response.data;
//
//                // todo: prettify the JSON output ...
//                // ... see: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
//
//            },
//            function (data, status, headers, config) { // ERROR CALLBACK
//                var log = {
//                    data: data,
//                    status: status,
//                    headers: headers,
//                    config: config
//                };
//
//                console.log('ERROR CALLBACK', log);
//            }
//        );

    }])
;
