"use strict";
angular.module('app-controllers', [

])
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

            var deferred2 = $q.defer();

            var spaceid, type, id, query

            spaceid = $routeParams['spaceId'];
            type = $routeParams['type'];
            id = $routeParams['id'];
            query = $location.search();


            contentful.contentManagement.httpGet(
                spaceid,
                type,
                id,
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

        }])

    .controller('AuthCtrl', ['$scope', '$location', 'cache', function ($scope, $location, cache) {

        $scope.name = 'AuthCtrl';

        $scope.authenticate = function(){

            // todo: break up the following url into manageable chunks.
//            var url = "https://be.contentful.com/oauth/authorize?response_type=token&client_id=6f4a0ec6ecc6c8d3f44e768503c70f71080b1bd1d1d7bcfb195f0fdabf6d9752&redirect_uri=http://localhost/~furrm/angular-contentful-management/auth.html&scope=content_management_manage";
            var url = "https://be.contentful.com/oauth/authorize?response_type=token&client_id=1aa879a4ba56af0c3de77ff4875dd50fdc55a2c6359817d8c6aed99b94302039&redirect_uri=http://angular-contentful-management.azurewebsites.net/app/auth.html&scope=content_management_manage";
            window.location.assign(url);

        };

        var tokenString;
        var accessToken;

        // first thing to test is whether the access_token already exists in the cache.
        accessToken = cache.readPermanentCache('access_token');

        if(accessToken !== null){ // we have an access token

            // redirect user to app.html
            window.location.assign('app.html');

        }
        else{

            // if we reach this point, the user should have clicked on the authenticate button.

            // Get the access token from the url.

            // tokenString will be null if the access_token hash is unavailable.
            tokenString = location.hash.match(/access_token=(\w+)/);

            if(tokenString !== null){

                // TODO: Error handling required if localStore is full
                // TODO: Error handling if Web Storage is not supported.
                cache.writeToPermanent('access_token', tokenString[1]);

                window.location.assign('app.html');


            }else{

            }

//        $scope.accessToken = tokenString[1];
        }
    }])
;