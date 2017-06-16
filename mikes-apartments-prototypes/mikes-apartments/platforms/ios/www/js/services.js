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


;