"use strict";

angular.module('common-utils', [])
    .value('toastr', toastr)
    .factory('notifier', function (toastr) {
        return {
            notify: {
                all:function (msg) {
                toastr.success(msg);
                toastr.warning(msg);
                toastr.error(msg);
                toastr.info(msg);
                console.log(msg);},
                success: function (msg) {
                    toastr.success(msg);
                },
                warning:function(msg){toastr.warning(msg);},
                error:function(msg){toastr.error(msg);},
                information:function(msg){toastr.info(msg);}

            }



        }
    })
;