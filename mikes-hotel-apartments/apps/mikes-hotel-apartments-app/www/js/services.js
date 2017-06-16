angular.module('app.services', [])

    .factory('Common', [function ($ionicHistory) {
        return{
            "name": 'Common',
            "navigation": {
                "goBack": function () {
                    console.log("Common:", "Navigating Back"); // todo: delete me
                    console.log("$ionicHistory:", $ionicHistory); // todo: delete me
//                    return $ionicHistory.goBack();
                }
            }
        }
    }])

    .factory('CacheService', [function () {
        return{
            "name": 'CacheService',
            "localStorage": {
                "write": writeLocal,
                "read": readLocal,
                "update": updateLocal,
                "delete": deleteLocal
            }
        }

        // localStorage operations
        function writeLocal(key, val) {

            try {

                localStorage.setItem(key, val);

            }
            catch (ex) {

                throw ex;

            }

        }

        function updateLocal(key, val) {

            return writeLocal(key, val);

        }

        function readLocal(key) {

            try {

                return localStorage.getItem(key);

            }
            catch (ex) {

                throw ex;

            }
        }

        function deleteLocal(key) {

            try {

                localStorage.removeItem(key);

            } catch (ex) {

            }

        }

    }])

    .factory('preload', ['$q', function ($q) {
        return function (url) {
            var deferred = $q.defer(),
                image = new Image();

            image.src = url;

            if (image.complete) {

                deferred.resolve();

            } else {

                image.addEventListener('load', function () {
                    deferred.resolve();
                });

                image.addEventListener('error', function () {
                    deferred.reject();
                });
            }

            return deferred.promise;
        }
    }])
;

