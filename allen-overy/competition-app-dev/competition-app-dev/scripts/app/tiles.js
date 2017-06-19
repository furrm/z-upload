/**
 * Tiles view model
 */

var app = app || {};

app.Tiles = (function () {
    'use strict'

    var tilesModel = (function () {

        var url = appSettings.contentful.url + '/' + appSettings.contentful.space + '/entries';
        var token = appSettings.contentful.apiKey;

        var contentTypeHeader = appSettings.contentful.contentType;
        var contentType = appSettings.contentful.contentTypes.tile;


        function onChange() {
            //     $("#about").html(kendo.render(template, this.view()));

            console.log('In Change function');
//
//
            var $container = $('#tiles');
            // initialize
            $container.masonry({
                columnWidth: 200,

                itemSelector: '.tile'
            });


        }


        var cachedRead = function (operation) {

            var cashedData = localStorage.getItem(contentType);

            cashedData = null;

            if (cashedData != null || cashedData != undefined) {
                console.log('Reading ' + contentType + ' from cache');
                operation.success(JSON.parse(cashedData));

            } else {
                $.ajax({
                    url: url,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', token),
                            xhr.setRequestHeader('Content-Type', contentTypeHeader)
                    },
                    dataType: "json",
                    data: {
                        content_type: contentType,
                        include: "1"
                    },
                    //cache : false,
                    success: function (response) {
                        console.log('Writing ' + contentType + ' to cache');
                        localStorage.setItem(contentType, JSON.stringify(response));
                        operation.success(response);
                    }
                });
            }
        }

        var assetDS = new kendo.data.DataSource({
            transport: {
                read: cachedRead
            },
            schema: {
                data: "includes.Asset",
                type: "json",
                model: {
                    fields: {
                        imageId: "sys.id",
                        imageUrl: "fields.file.url"
                    }
                }
            }
        });

        var entryDS = new kendo.data.DataSource({
            transport: {
                read: cachedRead
            },
            schema: {
                data: "includes.Entry",
                type: "json",
                model: {
                    fields: {
                        pageId: "sys.id",
                        pageContentTypeId: "sys.contentType.sys.id"
                    }
                }
            }
        });

        var tilesDataSource = new kendo.data.DataSource({
            transport: {
                read: cachedRead
            },
            // filter: { field: "fields.image2", operator: "neq", value: "" },
            // filter: { field: "fields.type.sys.id", operator: "neq", value: "" },

            schema: {
                data: "items",
                type: "json",
                model: {

                    fields: {
                        name: "fields.name",
                        type: "fields.type",
                        size: "fields.size",
                        security: "fields.security",
                        imageId: "fields.image.sys.id",
                        pageId: "fields.page.sys.id"
                    },
                    GetUrl: function () {

                        var data = assetDS.data();
                        var arrayLength = data.length;
                        var assetId = this.get('fields.image.sys.id');

                        var foundAsset = _.find(data, function(item){

                            if(item.imageId === assetId){
                                return item}

                        });

                        // todo: could think about returning an image placeholder if the imageUrl in undefined?
                        return "http:" + foundAsset.imageUrl;

                        // not sure whether this has always worked?
//                        for (var i = 0; i < arrayLength; i++) {
//                            var asset = assetDS.at(i)
//                            if (asset.imageId == assetId)
//
//
//                                return 'http:' + asset.imageUrl;
//                        }
                    },
                    GetBackgroundImage: function () {

                        var data = assetDS.data();
                        var arrayLength = data.length;
                        var assetId = this.get('fields.image.sys.id');

                        var foundAsset = _.find(data, function(item){

                            if(item.imageId === assetId){
                                return item}

                        });

                        // todo: could think about returning an image placeholder if the imageUrl in undefined?
                        return "url(http:" + foundAsset.imageUrl + ")";

                        // not sure whether this has always worked?
//                        for (var i = 0; i < arrayLength; i++) {
//                            var asset = assetDS.at(i)
//                            if (asset.imageId == assetId)
//
//
//                                return 'http:' + asset.imageUrl;
//                        }
                    }
                }
            },
            requestStart: function () {
                kendo.ui.progress($("#tiles"), true);
            },
            requestEnd: function () {
                kendo.ui.progress($("#tiles"), false);
            }

        });

        assetDS.fetch(function () {
            entryDS.fetch(function () {
                //console.log("ENTRY REFRESH");

                tilesDataSource.fetch(function () {

                    onChange();


                });

            });


        });

        var refresh = function () {

            console.log("Removing Local Storage");
            localStorage.removeItem(contentType);

            assetDS.read();
            entryDS.read();
            tilesDataSource.read();

        };

        return {
            refresh: refresh,
            tiles: tilesDataSource
        };

    }());

    // Tiles view model
    var tilesViewModel = (function () {


        // todo: integrate
        // this is the entry point for the app, so a few things need to happen here...
        // get all the content types from contentful and populate the app settings
        // get the terms and conditions, add the terms and conditions to the permanent cache as-is
        // redirect the user to the terms and conditions if they haven't read them
        var init = function (e) {

            console.log("Initialize Tiles");


            termsAndConditions();


            function termsAndConditions(){

                var pageId = appSettings.termsAndConditions.pageId;
                var contentTypeId = appSettings.contentful.contentTypes.TNC;
                var cachedData = undefined;
                var contentfulData = undefined;
                var isFirstUse = false; // determined by cached data is null
                var isForcedToRead = undefined;
                var hasAccepted = false; // assume that the user has never read the t's and c's
                var dataIsEqual;

                var hasReadKey = appSettings.termsAndConditions.haveReadKey;
                var hasReadCache = caching.readPermanentCache(hasReadKey);

                console.log("hasReadKey:", hasReadKey); // todo: delete me
                console.log("hasReadCache:", hasReadCache); // todo: delete me

                if(_.isNull(hasReadCache)){

                    // as there is no entry in the cache, assume that the user has never read the t's and c's
                    // so, the user has neither accepted or declined
                    hasAccepted = false;

                }
                else{

                    // determine whether the user has accepted or declined the t's and c's
                    // 0 = declined; 1 = accepted;
                    var flag = Number(hasReadCache);

                    if(flag === 0){
                        hasAccepted = false;
                    }
                    else if(flag === 1){
                        hasAccepted = true;
                    }
                    else{ // unexpected condition throw an error
                        //todo: handle error
                        alert("Unknown flag!!");
                    }

                }

                // check the permanent cache for terms and conditions
                var cachedData = JSON.parse(caching.readPermanentCache(pageId));

                if (_.isNull(cachedData)) {

                    // we have to assume at this point this is the first time the user has used the app
                    isFirstUse = true;

                }
                else {

                    // we have t&c cached data so the uer has been here before
                    isFirstUse = false;

                }

                // get the terms and conditions from contentful...
                // we need to do this to check that the terms and conditions haven't changed
                // we also need to check that the user must read the terms and conditions if changed

                var query = {
                    "sys.id": pageId
                };

                contentful.authorisationKey = "31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60";

                contentful.getData(appSettings.contentful.space, "entries", undefined, query)
                    .done(function (data, status, xhr) { // SUCCESS

                        console.log("SUCCESS", data, status, xhr); // todo: delete me

                        contentfulData = data;

                        // always write data to permanent cache
                        caching.writePermanentCache(pageId, JSON.stringify(contentfulData));

                    })
                    .fail(function (xhr, status) { // FAILURE

                        console.log("FAILURE", status, xhr); // todo: delete me

                        // if we get a failure, just make the contentfulData var the same as the cachedData var
                        contentfulData = cachedData;


                    })
                    .always(function (data, status, xhr) { // COMPLETE
                        console.log("COMPLETE", data, status, xhr); // todo: delete me

                        // have the terms and conditions changed
                        dataIsEqual = _.isEqual(cachedData, contentfulData);

                        console.log("ARE OBJECTS EQUAL?: ", dataIsEqual); // todo: delete me

                        if (!dataIsEqual) {

                            // check to see whether the user must read the new terms and conditions...


                            try {
                                var foundVal = _.find(contentfulData.includes.Entry, function (entry) {

                                    return entry.sys.contentType.sys.id === contentTypeId;

                                });

                                console.log("FOUND VAL", foundVal); // todo: delete me

                                isForcedToRead = foundVal.fields.forceRead;

                            } catch (e) {
                                console.log('WE HAVE A PROBLEM HERE!!', e); // todo: delete me
                            } finally {

                                // todo: redirect user to an error page

                            }

                        }

                        if(isFirstUse){

                            // we need to redirect the user to the terms and conditions
                            console.log('IS FIRST USE SO READ TNC'); // todo: delete me

                            readTNC();
                        }
                        else{

                            // no need to redirect unless user is forced to read the terms and conditions
                            if(isForcedToRead){
                                console.log('IS FORCED TO READ'); // todo: delete me

                                readTNC();
                            }
                        }

                        // final check is to see whether the user has read and accepted the t's & c's
                        if(!hasAccepted){
                            readTNC();
                        }

                    });

                function haveReadTNC() {

                    // check cache for terms and conditions read flag
                    // key is a guid
                    var key = appSettings.termsAndConditions.haveReadKey;

                    // raise an error if the key is missing from the appSettings...
                    if (typeof key === 'undefined') {
                        alert("A key related to the Terms and Conditions component is missing from the application settings.");
                        return false;
                    }

                    // check the cache to see if the current terms and conditions have been read...
                    var haveRead = parseInt(localStorage.getItem(key));

                    // Nan = First time use of the app, so there will be no cached record
                    // 0 = user has read the terms and conditions but has been forced to read them again
                    // 1 = user has read the terms and conditions

                    console.log('HAVEREAD', haveRead); // todo: delete me
                    // if the haveRead var is undefined, then a value has never been added to the cache
                    if (isNaN(haveRead)) {
                        // redirect the user
                        console.log("USER HAS NEVER READ THE T&C's"); // todo: delete me
                        return false;
//                    readTNC();
                    }

                    if (haveRead === 0) {
                        console.log("USER HAS READ THE T&C's BUT IS FORCED TO READ THEM AGAIN!!"); // todo: delete me
//                    readTNC();
                        return false;
                    }

                    if (haveRead === 1) {
                        console.log("USER HAS READ THE T&C's"); // todo: delete me
                        return true;
                    }


                }

                function readTNC() {
                    console.log("REDIRECT USER TO READ TERMS AND CONDITIONS"); // todo: delete me
                    app.mobileApp.navigate("views/vw-tandc.html?uid=" + pageId);
                }
            }



        };

        // todo: integrate
        var selectTNC = function (e) {
            console.log("TNC SELECTED"); // todo: delete me

            var pageId = appSettings.termsAndConditions.pageId;
            app.mobileApp.navigate("views/vw-tandc.html?uid=" + pageId);

        };

        // todo: integrate
        var clearCache = function (e) {

            try {

                console.log("clearCache SELECTED"); // todo: delete me

                caching.clearPermanentCache();

                alert("Application cache has been cleared.");

            } catch (e) {

                alert("There was a problem clearing the application cache.");

            }

        };



        var tileSelected = function (e) {

            var tileType = e.data.type;

            if (tileType == 'News') {
                app.mobileApp.navigate('views/newsView.html?uid=' + e.data.pageId);
            }
            else if (tileType == 'Contact') {
                app.mobileApp.navigate('views/vw-contacts.html');
            }
            else if (tileType == 'Promo') {
                alert('This tile is under construction');
            }
            else if (tileType == 'Checklist') {
                app.mobileApp.navigate('views/vw-guide.html?uid=' + e.data.pageId);
            }
            else if (tileType == 'About') {
                app.mobileApp.navigate('views/vw-about-us.html?uid=' + e.data.pageId);
            }
        };

        var refresh = function (e) {
            tilesModel.refresh();
        };


        var reload = function (e) {
            location.reload(true);
        };

        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
                .then(navigateHome, function (err) {
                    app.showError(err.message);
                    navigateHome();
                });
        };


        return {
            init: init, // todo: integrate
            selectTNC: selectTNC, // todo: integrate
            clearCache: clearCache, // todo: integrate
            tiles: tilesModel.tiles,
            tileSelected: tileSelected,
            reload: reload,
            refresh: refresh,
            logout: logout
        };

    }());

    return tilesViewModel;

}());
