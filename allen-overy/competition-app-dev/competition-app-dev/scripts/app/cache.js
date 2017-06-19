"use strict";

var caching = (function () {

    return {
        writePermanentCache:function(key, val) {

            try {
                localStorage.setItem(key, val);
            }
            catch (ex) {
                console.log('Error encoutered in cache.js', ex);
                throw ex;
            }
        },
        readPermanentCache:function(key) {

            return localStorage.getItem(key);
        },
        removePermanentCache:function(key) {

            localStorage.removeItem(key);

        },
        clearPermanentCache:function() {

            localStorage.clear();

        }
    };

})();