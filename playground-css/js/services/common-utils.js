"use strict";

angular.module('common-utils', [])
    .value('toastr', toastr)
    .factory('notifier', function (toastr) {
        return {
            notify: function (msg) {
                toastr.success(msg);
                toastr.warning(msg);
                toastr.error(msg);
                toastr.info(msg);

                console.log(msg);
            }
        }
    }
)
    .service('mockTileService', function ($http) {
        return {
            getRandom: function () {

                // generate random data
                var randomItems = [];
                for (var i = 0; i < 10; i++) {

                    var id = Math.floor(Math.random() * 101);

                    randomItems.push({
                        id: id,
                        title: "Item " + id
                    });
                }

                return randomItems;
            }
        };
    });