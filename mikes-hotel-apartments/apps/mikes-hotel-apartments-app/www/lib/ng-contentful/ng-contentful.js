"use strict";

angular.module('ng.contentful', [])

    .factory('contentDeliveryApi', ['contentfulBaseUrls', 'contentfulConfig', 'contentfulDataAccess',
        function (contentfulBaseUrls, contentfulConfig, contentfulDataAccess) {
            return{
                syncType: {
                    all: "all", entry: "Entry", asset: "Asset", deletion: "Deletion", deletedAsset: "DeletedAsset", deletedEntry: "DeletedEntry"
                },
                getContentTypes: function () {

                    var url = contentfulBaseUrls.contentDeliveryUrl + "/spaces/" + contentfulConfig.spaceId + '/content_types';

                    console.log("url", url); // todo: delete me
                    
                    return contentfulDataAccess.getContentTypes(url);

                },
                sync: function (type) {

                    var url = contentfulBaseUrls.contentDeliveryUrl + "/spaces/" + contentfulConfig.spaceId + "/sync";

                    return contentfulDataAccess.syncData(url, type);

                }
            };

        }])

    .factory('contentfulDataAccess', ['$http', '$q', function ($http, $q) {
        return{
            "syncData": syncData,
            "getContentTypes":getContentTypes
        }

        function getContentTypes(url) {

            return getData(url);

            var deferred = $q.defer();

            getData(url).then(
                function (response) {

                    deferred.resolve(response);

                },
                function (error) {

                    deferred.reject(error);

                }
            );

            return deferred.promise;

        }

        function getData(url, params) {
            return $http({
                method: 'GET',
                url: url,
                params: params
            });
        }

        function syncData(url, what) {

            var deferred = $q.defer();

            var params;
            try {
                params = utility.searchParamBuilder(what);
            } catch (e) {
                deferred.reject(e);
            }

            getData(url, params)
                .then(function (response) {

                    console.log(response); // todo: delete me

                    var pages = [];
                    var retVal = [];

                    // process pages and notify caller when complete
                    getNextPage(response);

                    // recursive function to get all pages
                    function getNextPage(response) {

                        // add the page data from contentful to the array
                        pages.push(response.data);

                        if (response.data.nextPageUrl) { // get the next page

                            getData(response.data.nextPageUrl)
                                .then(function (nextresponse) {

                                    getNextPage(nextresponse);

                                }, function (error) {

                                    deferred.reject(error);


                                });

                        }
                        else { // no more pages to get, so respond

                            if (response.data.nextSyncUrl) {

                                // check the pages for errors.
                                _.forEach(pages, function (page) {

                                    var hasErrors = utility.dataHasErrors(page);

                                    if (hasErrors) {

                                        deferred.reject("cms data contained errors");
                                    }

                                });

                                // process the response
                                _.forEach(pages, function (page) {

                                    _.forEach(page.items, function (item) {

                                        retVal.push(item);

                                    });

                                });

//                                resource.writeLocal("temp", JSON.stringify(retVal));
//                                    resource.writeLocal("nextSyncUrl", JSON.stringify(response.nextSyncUrl));


                                deferred.resolve({"data": retVal, "nextSyncUrl": response.data.nextSyncUrl});


                            }
                            else {
                                // todo: handle the scenario where there is no nextSyncUrl
                                alert("No sync URL");
                            }
                        }


                    }

                }
                , function (error) {

                    deferred.reject(error);

                });

            return deferred.promise;
        }

    }])
;
