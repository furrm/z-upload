"use strict";

var resource = (function () {

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


        },
        readSession:function(key) {


        },
        removeSession:function(key) {



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