"use strict";

var cacheFactory = (function () {

    return {
        writeLocal:function(key, val) {

            try {
                localStorage.setItem(key, val);
            }
            catch (ex) {
                console.log('Error encoutered in cache.js', ex);
                throw ex;
            }
        },
        readLocal:function(key) {

            return localStorage.getItem(key);
        },
        removeLocal:function(key) {

            localStorage.removeItem(key);

        },
        clearLocal:function() {

            localStorage.clear();

        },
        writeSession:function(key, val) {

            try {
                sessionStorage.setItem(key, val);
            }
            catch (ex) {
                console.log('Error encoutered in cache.js', ex);
                throw ex;
            }

        },
        readSession:function(key) {

            return sessionStorage.getItem(key);

        },
        removeSession:function(key) {

            sessionStorage.removeItem(key);

        },
        writeCookie:function(key, val) {

            localStorage.setItem(key, val);


           // $.cookie(key, val, { expires: 1 });

        },
        readCookie:function(key) {

            return localStorage.getItem(key);

            // return $.cookie(key);

        },
        removeCookie:function(key) {

          localStorage.removeItem(key);
           // $.removeCookie(key);

        }
    };

})();