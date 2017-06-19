"use strict";

angular.module('caching-service', [])
.factory('cache', [function(){
    return{
        "name":'cache',
        writeToPermanent:function(key, val){

            try {
                localStorage.setItem(key, val);
            }
            catch (ex) {
                console.log('Error encoutered in cache.js', ex);
                throw ex;
            }

        },
        readPermanentCache:function (key) {

            return localStorage.getItem(key);

        }

    }
}])
;