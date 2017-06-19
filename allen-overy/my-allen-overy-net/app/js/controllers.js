'use strict';

/* Controllers */

landingApp.controller('CountryPickerCtrl', function (myService, $scope, $log, $cookieStore, contentfulConfig, contentful, utilityService, helperService, $window, $filter) {

    $scope.name = "CountryPickerCtrl";
    $scope.isDesktop = helperService.isDesktop;
    $scope.isAndroid = helperService.isAndroid;
    $scope.isIos = helperService.isIos;


    // check that the config is set
    $scope.spaceId = contentfulConfig.spaceId;
    $scope.accessToken = contentfulConfig.accessToken;
    $scope.version = helperService.version;

    var spaceid, query, contentTypes;


    spaceid = contentfulConfig.spaceId;


    // get the content types first
//    $scope.ctrlOutput = utilityService.getItemByName("Mike");


//    if(IE){
//
//    }

    contentful.contentDelivery.httpGet(spaceid, "content_types").then(
        function (response) { // SUCCESS CALLBACK

            console.log('SUCCESS CALLBACK', response); // todo: delete me

            contentTypes = response.data.items;

            var contentType = utilityService.getItemByName('Country', contentTypes);

            console.log("contentType", contentType); // todo: delete me

            // set up the querystring params that get sent to contentful
            query = {
                "content_type": contentType.sys.id,
                "include": 2
            };


            // get countries
            // chaining promises: https://egghead.io/lessons/angularjs-chained-promises
            contentful.contentDelivery.httpGet(spaceid, "entries", undefined, query).then(
                function (countryResponse) { // SUCCESS CALLBACK

                    console.log("SUCCCESS countryResponse:", countryResponse); // todo: delete me

                    console.log("COUNTRIES PRE PROCESS", countryResponse.data); // todo: delete me

                    // START: POST PROCESS
                    var items = countryResponse.data.items;
                    var entries = countryResponse.data.includes.Entry;
                    var assets = countryResponse.data.includes.Asset;

                    //seans change - specifically error handling from contentful
                    var error = countryResponse.data.includes.errors;
                    if (error !== undefined) {
                        $log.info(error);
                    }
                    //end of error handling

                    //Seans change - Need to get all assets only for mobile only page
                    $scope.assets = assets;
                    $log.info(assets);
                    //end of seans change

                    // roll up entries and assets into the country items...
                    _.forEach(items, function (item) {


                        //sean
                        var foundFlag = utilityService.getAssetById(item.fields.flag.sys.id, assets);
                        item.fields.flag = foundFlag;
                        //end sean


                        // roll up office entries for the item...
                        var foundOffices = [];

                        _.forEach(item.fields.office, function (office) {



                            var foundOffice = utilityService.getEntryById(office.sys.id, entries);

                            // get the netscaler for the office
                            var foundNetscaler = utilityService.getEntryById(foundOffice.fields.netscaler.sys.id, entries);

                            // get the config files
                            var foundConfigs = [];

                            _.forEach(foundNetscaler.fields.config, function (config) {

                                var foundConfig = utilityService.getAssetById(config.sys.id, assets);

                                foundConfigs.push(foundConfig);

                            });

                            foundNetscaler.fields.config = foundConfigs;

                            foundOffice.fields.netscaler = foundNetscaler;

                            foundOffices.push(foundOffice);


                        });

                        item.fields.office = foundOffices;



                    });
                    // END: POST PROCESS

                    console.log("COUNTRIES POST PROCESS", countryResponse.data.items); // todo: delete me
//                    console.log(JSON.stringify(countryResponse.data.items));

                    $scope.countries = countryResponse.data.items;


                }, function (data, status, headers, config) { // ERROR CALLBACK

                    console.log("ERROR country get:" + data); // todo: delete me


                });


        },
        function (data, status, headers, config) { // ERROR CALLBACK
            console.log("ERROR content type get:" + data); // todo: delete me

        }
    ).then();

    $scope.pushCookie = function(officeUrl) {
        $cookieStore.put('aoCookie', { message: officeUrl });
        $log.info($cookieStore.get('aoCookie').message);
    };

    //Can't use generic filter as can't discern between office and country (both fields.name)
    $scope.countrySearch = function(country) {
        var countryName = [country.fields.name]; // Wrapping in array since the 'filter' $filter expects an array.
        var matches = $filter('filter')(countryName, $scope.searchTerm); // Running country name through filter searching for $scope.searchTerm
        return matches.length > 0;
    }

});