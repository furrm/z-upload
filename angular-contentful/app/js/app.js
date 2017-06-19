"use strict";

angular.module('app', [
        'ngRoute',
        'ngResource',
        'angular-contentful'
    ])
    // start:application routes
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/main', {
                template: '<div>Main</div>'
            })
            .when('/spaces', {
                template: '<div>Please supply a spaceId in the URL</div>'
            })
            .when('/spaces/:spaceId', {
                templateUrl: 'templates/content/output.html',
                controller: 'EndpointCtrl'
            })
            .when('/spaces/:spaceId/:type', {
                templateUrl: 'templates/content/output.html',
                controller: 'EndpointCtrl'
            })
            .when('/spaces/:spaceId/:type/:id', {
                templateUrl: 'templates/content/output.html',
                controller: 'EndpointCtrl'
            })
            .otherwise({redirectTo: '/main'});

//        $locationProvider.html5Mode(true);
    }])
    // end:application routes
    .run(function (contentfulConfig) {

        // Populate the angular-contentful configuration.
        contentfulConfig.spaceId = '70oeg2af4yo7';
        contentfulConfig.accessToken = '99d1c0825184b1a9928f3eb1816faa36be82b170692e3540e8a0e223be1884ad';

        console.log(contentfulConfig);
    })
    .controller('AppCtrl', ['$scope', 'contentfulConfig', function ($scope, contentfulConfig) {
        $scope.name = 'angular-contentful app';
        $scope.contentfulConfig = contentfulConfig;
    }])
    // The following endpoints are currently supported as of 11/02/2014
    // Documentation: https://www.contentful.com/developers/documentation/content-delivery-api/#endpoints
    // GET: /spaces/:space_id
    // GET: /spaces/:space_id/content_types
    // GET: /spaces/:space_id/content_types/:id
    // GET: /spaces/:space_id/entries
    // GET: /spaces/:space_id/entries/:id
    // GET: /spaces/:space_id/assets
    // GET: /spaces/:space_id/assets/:id
    // GET: /spaces/:space_id/sync
    .controller('EndpointCtrl', ['$scope', '$routeParams', '$location', '$q', 'contentful',
        function ($scope, $routeParams, $location, $q, contentful) {

            // start:contentDelivery
//        var promise = contentDelivery.getData(
//            contentfulBaseUrls.contentDeliveryUrl,
//            $routeParams['spaceId'],
//            $routeParams['type'],
//            $routeParams['id'],
//            $location.search()
//        );
//
//        console.log('promise', promise);
//
//        promise.then(
//            function (data) // successCallback
//            {
//                console.log('successCallback');
//                console.log('data', data);
//                $scope.serviceOutput = data;
//            },
//            function (error) // errorCallback
//            {
//                console.log('errorCallback');
//                console.log('error', error);
//            },
//            function (notify) // notifyCallback
//            {
//                console.log('notifyCallback');
//                console.log('notify', notify);
//            }
//        )
            // end:contentDelivery

            // start:contentDelivery2
//            contentDelivery2.query({spaceId: $routeParams.spaceId, type: $routeParams.type, id: $routeParams.id}).$promise.then(
//                function (data) // successCallback
//                {
//                    console.log('successCallback');
//                    console.log('data', data);
//                    $scope.serviceOutput = data;
//                },
//                function (error) // errorCallback
//                {
//                    console.log('errorCallback');
//                    console.log('error', error);
//                },
//                function (notify) // notifyCallback
//                {
//                    console.log('notifyCallback');
//                    console.log('notify', notify);
//                }
//            );

//            var deferred = $q.defer();
//
//            contentDelivery2.query({spaceId: $routeParams.spaceId, type: $routeParams.type, id: $routeParams.id},
//                function (data) {
//                    deferred.notify('Calling Contentful...');
//                    console.log(data);
//                    deferred.resolve(data);
//                },
//                function (response) {
//                    deferred.notify('Damn, just encountered and error...');
//                    console.log(response);
//                    deferred.reject(response);
//                });
//
//            deferred.promise.then(
//                function (data) // successCallback
//                {
//                    console.log('successCallback');
//                    console.log('data', data);
//                    $scope.serviceOutput = data;
//                },
//                function (error) // errorCallback
//                {
//                    console.log('errorCallback');
//                    console.log('error', error);
//                },
//                function (notify) // notifyCallback
//                {
//                    console.log('notifyCallback');
//                    console.log('notify', notify);
//                }
//            )
            // end:contentDelivery2

            // start:contentful
//            var deferred = $q.defer();
//
//            contentful.contentDelivery2.resource(
//                    $routeParams['spaceId'],
//                    $routeParams['type'],
//                    $routeParams['id'],
//                    $location.search()
//                ).query(function (data) {
//                    deferred.notify('Calling Contentful...');
//                    console.log(data);
//                    deferred.resolve(data);
//                },
//                function (response) {
//                    deferred.notify('Damn, just encountered and error...');
//                    console.log(response);
//                    deferred.reject(response);
//                });
//
//
//
//            deferred.promise.then(
//                function (data) // successCallback
//                {
//                    console.log('successCallback');
//                    console.log('data', data);
//                    $scope.serviceOutput = data;
//                },
//                function (error) // errorCallback
//                {
//                    console.log('errorCallback');
//                    console.log('error', error);
//                },
//                function (notify) // notifyCallback
//                {
//                    console.log('notifyCallback');
//                    console.log('notify', notify);
//                }
//            )

            var deferred2 = $q.defer();

            var spaceid, type, id, query

            spaceid = $routeParams['spaceId'];
            type = $routeParams['type'];
            id = $routeParams['id'];
            query = $location.search();

//            console.log('contentDelivery2',contentful.contentDelivery2.get());
            contentful.contentDelivery2.httpGet(
                    spaceid,
                    type,
                    id,
                    query
                ).then(
                function(response){ // SUCCESS CALLBACK
                    var log = {
                        data:response.data,
                        status:response.status,
                        headers:response.headers,
                        config:response.config
                    };

                    console.log('SUCCESS CALLBACK', log);
                    $scope.serviceOutput = response.data;

                },
                function(data, status, headers, config){ // ERROR CALLBACK
                    var log = {
                        data:data,
                        status:status,
                        headers:headers,
                        config:config
                    };

                    console.log('ERROR CALLBACK', log);
                }
            );
             // end:contentful


//        console.log('$routeParams', $routeParams);
//        console.log('$location.url', $location.url());
//        console.log('window.location.search', window.location.search);

//        alert($location);
//        var split = $location.url().split('?');
//
//        console.log('split', split);
//        console.log('split length', split.length);
//        console.log('split[1]', split[1]);


//        angular.forEach(qs, function (value, key) {
////            alert(key);
//            }
//        );


        }])
;