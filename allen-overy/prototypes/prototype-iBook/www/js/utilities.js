"use strict";

var utilities = (function ()
{

    return {
        buildMatrixString: function (val) {

            return "matrix("
                + val.a / 10 + ","
                + val.b + ","
                + val.c + ","
                + val.d / 10 + ","
                + val.e + ","
                + val.f + ");";


        }
    };

})();