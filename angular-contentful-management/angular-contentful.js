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
        $provide.factory('contentfulInterceptor', ['$q', 'contentfulConfig', function ($q, contentfulConfig) {
            return {
                // On request success
                request: function (config) {
                    console.log(config); // Contains the data about the request before it is sent.

                    // Add the Contentful API token to the header.
                    config.headers['Authorization'] = 'Bearer ' + contentfulConfig.accessToken;
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
    .factory('contentful', ['$resource', '$http', '$q', '$location', 'contentfulBaseUrls',
        function ($resource, $http, $q, $location, contentfulBaseUrls) {
            return{
                contentManagement: function (spaceId, type, id, query) {

                    var urlTemplate = contentfulBaseUrls.contentDeliveryUrl + '/spaces/:spaceId/:type/:id';

                    return $resource(urlTemplate,
                        {   // default pramaters
                            spaceId: spaceId, type: type, id: id
                        },
                        {
                            //actions
                            query: {method: 'GET',
                                params: query,
                                isArray: false}
                        }
                    );

                },
                contentManagement2:{
                    resource:function (spaceId, type, id, query) {

                        var urlTemplate = contentfulBaseUrls.contentDeliveryUrl + '/spaces/:spaceId/:type/:id';

                        return $resource(urlTemplate,
                            {   // default pramaters
                                spaceId: spaceId, type: type, id: id
                            },
                            {
                                //actions
                                query: {method: 'GET',
                                    params: query,
                                    isArray: false}
                            }
                        );

                    },
                    httpGet:function(spaceId, type, id, query){


//                        var spaceId = undefined;
//                        var type = undefined;
//                        var id = undefined;
//                        var query = undefined;

                        console.log('id', id);

                        var url = contentfulBaseUrls.contentDeliveryUrl + '/spaces';

                        if(typeof spaceId != 'undefined')
                        {
                            url = url + '/' + spaceId;
                        }

                        if(typeof type != 'undefined')
                        {
                            url = url + '/' + type;
                        }

                        if(typeof id != 'undefined')
                        {
                            url = url + '/' + id;
                        }

                        return $http({
                            method: 'GET',
                            url: url,
                            params:query
                        });
                    },
                    restangular:function(){}
                }
            }
        }])

;

