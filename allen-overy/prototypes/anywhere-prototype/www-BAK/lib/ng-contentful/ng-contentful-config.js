angular.module('ng.contentful.config', [])

    // contentful base uri's
    .constant('contentfulBaseUrls', {
        "contentDeliveryUrl": 'https://cdn.contentful.com',
        "contentManagementUrl": 'https://api.contentful.com'
        // TODO: Image URL and any others
    })

    // contentful configuration
    // best to set this at app.run
    .value('contentfulConfig', {
        spaceId: '',
        accessToken: ''
    })

    .config(function ($provide, $httpProvider) {

        // Intercept http calls.
        $provide.factory('contentfulInterceptor', ['$q', 'contentfulConfig', function ($q, contentfulConfig) {
            return {
                // On request success
                request: function (config) {

                    // Add the Contentful API token to the header.
                    config.headers['Authorization'] = 'Bearer ' + contentfulConfig.accessToken;

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
;