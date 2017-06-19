"use strict";

angular.module('angular-contentful', [])
    // config for contentful
    // spaceId and accessToken will need to be set by the application.
    .constant('contentfulBaseUrls',
    {
        "contentDeliveryUrl": 'https://cdn.contentful.com',
        "contentManagementUrl": 'https://api.contentful.com'
        // TODO: Image URL and any others
    })
    .value('contentfulConfig', {
        spaceId: '',
        accessToken: ''
    })
    // ADD A HTTP INTERCEPTOR TO APPEND THE AUTH TOKEN IN THE HTTP HEADER
    // start:http interceptor
    .config(function ($provide, $httpProvider) {

        // Intercept http calls.
        $provide.factory('contentfulInterceptor', ['$q', function ($q) {
            return {
                // On request success
                request: function (config) {
                    console.log(config); // Contains the data about the request before it is sent.

                    config.headers['Authorization'] = 'Bearer 99d1c0825184b1a9928f3eb1816faa36be82b170692e3540e8a0e223be1884ad';
                    console.log(config);

                    // Return the config or wrap it in a promise if blank.
                    return config || $q.when(config);

                },

                // On request failure
                requestError: function (rejection) {
                    // console.log(rejection); // Contains the data about the error on the request.

                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response success
                response: function (response) {
                    // console.log(response); // Contains the data from the response.

                    // Return the response or promise.
                    return response || $q.when(response);
                },

                // On response failture
                responseError: function (rejection) {
                    // console.log(rejection); // Contains the data about the error.

                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        }]);

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('contentfulInterceptor');

    })
    // end:http interceptor
    .factory('contentManagement', ['$resource', '$q', '$location', function ($resource, $q, $location) {
        return{
            "name": 'contentManagement',
            "getData": function (baseUrl, spaceId, type, id, query) {

                var urlTemplate = baseUrl + '/spaces/:spaceId/:type/:id';


                console.log('query', query);


                var deferred = $q.defer();

                $resource(urlTemplate,
                    { // default pramaters
                        spaceId: spaceId, type: type, id: id
                    },
                    {
                        //actions
                        query: {
                            method: 'GET',
                            params: $location.search(),
                            isArray: false}

                    }
                )
                    .get('', function (data) {
                        deferred.notify('Calling Contentful...');
                        console.log(data);
                        deferred.resolve(data);
                    },
                    function (response) {
                        deferred.notify('Damn, just encountered and error...');
                        console.log(response);
                        deferred.reject(response);
                    });

                return deferred.promise;

            }
        }
    }])
    .factory('contentManagement', ['$resource', '$location', '$q', 'contentfulBaseUrls',
        function ($resource, $location, $q, contentfulBaseUrls) {

            var urlTemplate = contentfulBaseUrls.contentDeliveryUrl + '/spaces/:spaceId/:type/:id';
//            var urlTemplate = 'https://cdn.contentful.com/spaces/:spaceId/:type/:id';

            return $resource(urlTemplate,
                {   // default pramaters
//                    spaceId: $routeParams.spaceId, type: $routeParams.type, id: $routeParams.id
                },
                {
                    //actions
                    query: {method: 'GET',
                        params: $location.search(),
//                            interceptor: {
//
//                                response: function (data) {
//                                    console.log('response in interceptor', data);
//                                },
//                                responseError:function(data){
//                                    console.log('error in interceptor', data)
//                                }
//                            },
                        isArray: false}

                }
            );


        }])
    .factory('contentDelivery3', ['$resource', '$q', '$location', 'contentfulBaseUrls',
        function ($resource, $q, $location, contentfulBaseUrls) {
        return{
            "name": 'contentManagement',
            "getData": function (baseUrl, spaceId, type, id, query) {

                var urlTemplate = contentfulBaseUrls.contentDeliveryUrl + '/spaces/:spaceId/:type/:id';

                return $resource(urlTemplate,
                    {   // default pramaters
                        spaceId: spaceId, type: type, id: id
                    },
                    {
                        //actions
                        query: {method: 'GET',
                            params: query,
//                            interceptor: {
//
//                                response: function (data) {
//                                    console.log('response in interceptor', data);
//                                },
//                                responseError:function(data){
//                                    console.log('error in interceptor', data)
//                                }
//                            },
                            isArray: false}

                    }
                );

            }
        }
    }])

;

