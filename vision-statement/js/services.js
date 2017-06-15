angular.module('mikes-services', [])

    .factory('DeviceService', [function(){
        return{
            "getVersion":function (){

                var retVal;

                try {

                    retVal = device.version;

                    return retVal

                } catch (e) {

                    return e.message;
                }
            },
            "getCordova":function (){

                var retVal;

                try {

                    retVal = device.cordova;

                    return retVal

                } catch (e) {

                    return e.message;
                }
            },
            "getModel":function (){

                var retVal;

                try {

                    retVal = device.model;

                    return retVal

                } catch (e) {

                    return e.message;
                }
            },
            "getName":function (){

                var retVal;

                try {

                    retVal = device.name;

                    return retVal

                } catch (e) {

                    return e.message;
                }
            },
            "getPlatform":function (){

                var retVal;

                try {

                    retVal = device.platform;

                    return retVal

                } catch (e) {

                    return e.message;
                }
            },
            "getUUID":function (){

                var retVal;

                try {

                    retVal = device.uuid;

                    return retVal

                } catch (e) {

                    return e.message;
                }
            }
        }
    }])
    .factory('FileService', ['$q', function($q){

        return{
            getName:"FileService",
            "getFilesystem":function (){

                var deferred = $q.defer();

                window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024 * 1024, function (filesystem) {
                        deferred.resolve(filesystem);
                    },
                    function (err) {
                        deferred.reject(err);
                    });

                return deferred.promise;

            }
        }
    }])
    .factory('Content', [function () {
        return{
            syncInit: function (contentType) {

                var url;

                if(contentType === null || typeof contentType === "undefined"){ // sync all
                    // on sync init write the data to the cache.
                    url = "https://cdn.contentful.com/spaces/cfexampleapi/sync?initial=true";
                }
                else { // sync by content type

                }




            },
            syncNext: function (contentType) {



            }
        }
    }])

    .factory('utilityService', function () {

        return {
            getItemByName: function (name, items) {
                var foundItem = _.find(items, function (item) {

                    return item.name === name;

                });

                return foundItem;
            },
            getLinkByUrl:function(){},
            getEntryById: function (entryId, entries) {

                var foundEntry = _.find(entries, function (entry) {

                    return entry.sys.id === entryId;

                });

                return foundEntry;

            },
            getAssetById: function (assetId, assets) {

                var foundAsset = _.find(assets, function (asset) {

                    return asset.sys.id === assetId;

                });

                return foundAsset;

            },
            dataHasErrors: function (data) {

                var errors = data.errors;
                return (typeof errors !== "undefined");

            },
            menuBuilder: function(menuLocation, key){


                var utilityService = this;

                var data = JSON.parse(utilityService.readLocalCache(key));

                if(menuLocation === "left-menu"){

                    var leftMenu = [];


                    _.forEach(data.items[0].fields.leftMenu, function(menuItem){
                        var foundMenuItem = utilityService.getEntryById(menuItem.sys.id, data.includes.Entry);
                        leftMenu.push(foundMenuItem);
                    });

                    return leftMenu;
                }

                if(menuLocation === "right-menu"){

                    var rightMenu = [];

                    _.forEach(data.items[0].fields.rightMenu, function(menuItem){
                        var foundMenuItem = utilityService.getEntryById(menuItem.sys.id, data.includes.Entry);
                        rightMenu.push(foundMenuItem);
                    });

                    return rightMenu;
                }
            },
            pageBuilder: function(pageId){

                var utilityService = this;

                var data = JSON.parse(utilityService.readLocalCache(appSettings.appId));

                var foundPage = utilityService.getEntryById(pageId, data.includes.Entry);

                if(foundPage.fields.type === "static") {

                    if(foundPage.fields.externalImage) {
                        var foundExternalImage = utilityService.getEntryById(foundPage.fields.externalImage.sys.id, data.includes.Entry);
                        foundPage.fields.externalImage = foundExternalImage;
                    }

                    if(foundPage.fields.image){
                        var foundImage = utilityService.getAssetById(foundPage.fields.image.sys.id, data.includes.Asset);
                        foundPage.fields.image = foundImage;
                    }

                    // get the cards...
                    // for now it's cards for static pages...
                    var cards = [];

                    _.forEach(foundPage.fields.content, function(contentItem){

                        var foundContent = utilityService.getEntryById(contentItem.sys.id, data.includes.Entry);

                        // check to see if the card has an image...
                        if(foundContent.fields.image){

                            var foundImage = utilityService.getEntryById(foundContent.fields.image.sys.id, data.includes.Asset);

                            foundContent.fields.image = foundImage;
                        }

                        cards.push(foundContent);
                    });

                    foundPage.fields.content = cards;

                    return foundPage;
                }
                else{ // must be a slider page type

//                    utilityService.sliderBuilder(pageId);

                    // get the slides, which should be the content field...
                    var slides = [];

                    _.forEach(foundPage.fields.content, function(contentItem){

                        var foundContent = utilityService.getEntryById(contentItem.sys.id, data.includes.Entry);

                        // now that we have the slide, we need to get the referenced page.

                        foundContent.fields.page = utilityService.pageBuilder(foundContent.fields.page.sys.id);


                        slides.push(foundContent);
                    });

                    foundPage.fields.content = slides;




                    return foundPage;
                }


            },
            homePageBuilder:function(){},
            sliderBuilder:function(pageId){

                var utilityService = this;

                var data = JSON.parse(utilityService.readLocalCache(appSettings.appId));

                var foundPage = utilityService.getEntryById(pageId, data.includes.Entry);

                // process the slides


            },
            writeLocalCache:function(key, val) {

                try {
                    localStorage.setItem(key, val);
                }
                catch (ex) {
                    console.log('Error encoutered in cache.js', ex);
                    throw ex;
                }
            },
            readLocalCache:function(key) {

                return localStorage.getItem(key);
            },
            removeLocalCache:function(key) {

                localStorage.removeItem(key);

            },
            clearLocalCache:function() {

                localStorage.clear();

            }
        }

    })


;