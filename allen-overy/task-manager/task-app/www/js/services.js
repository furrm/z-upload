angular.module('app.services', [])
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

        function updateLocal(key, val){

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
;