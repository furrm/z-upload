(function () {
    angular.module('app', ['angular-contentful', 'ngResource', 'mikes-services', 'mikes-directives'])
        .run(function (contentfulConfig) {

            contentfulConfig.spaceId = "e5stj606lc0z";
            contentfulConfig.accessToken = "66b4a15bec378af12f285da96c9743c8ab18892464706321bd624d18de48f22a";

        })
        .controller('Application', ['$scope', 'contentful', 'contentfulConfig', 'utilityService', function ($scope, contentful, contentfulConfig, utilityService) {

            var spaceId, id, query;

            spaceId = contentfulConfig.spaceId;

//            appSettings.appId = "5rzOrLJdHqYEqA2mMgEQY2";

            var pageId = "1Whl3oULFq68CS2eGIu6uW" // VISION
            var pageId = "5rTEpG3iNyiKaE0oS6ocqw" // TRAINING

            query = {
                "sys.id": pageId,
                "include": "10"
            };

            contentful.contentDelivery.httpGet(
                spaceId,
                "entries",
                undefined,
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

                    var data = response.data;
                    var page = data.items[0];
                    var contents = [];

                    _.forEach(page.fields.contents, function (content) {

                        var foundEntry = utilityService.getEntryById(content.sys.id, data.includes.Entry);


                        contents.push(foundEntry);

                    });

                    page.fields.contents = contents;


                    $scope.page = page;
//                    $scope.sections = page.fields.contents;


//                    $rootScope.$broadcast('got-data', appSettings.appId);


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

            $scope.name = 'Application';

        }])
    ;
})();