'use strict';

/* Services */
landingApp.service('helperService', function () {
    this.isDesktop = true;
    this.isAndroid = false;
    this.isIos = false;
    this.version = null;
});

landingApp.factory('myService', function ($log, $window, $cookieStore, $location, helperService) {

    return function () {

        if (/Android|webOS|iPhone|iPad|iPod|PlayBook|BlackBerry|IEMobile|Opera Mini|SymbianOS/i.test(navigator.userAgent)) {

            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                $log.info('You are on an Ios device');
                helperService.isIos = true;
            }
            else if (/Android/i.test(navigator.userAgent)) {
                $log.info('You are on an Android device');
                helperService.isAndroid = true;
            }
            else if (/webOS|PlayBook|BlackBerry|IEMobile|Opera Mini|SymbianOS/i.test(navigator.userAgent)) {
                //what receiver files will these use? e.g, nokia = SymbianOA; Nokia Lumia = IEMobile?;
            }

            helperService.isDesktop = false;

            $log.info('You are on a mobile device. ');
            //open native receiver. search for citrix receiver.exe?? Get receiver file
            $location.path('/CountryPicker');
        }
        else {

            $log.info('you are using a desktop');

            var cookie = $cookieStore.get('aoCookie');
            if (cookie != undefined) {

                //Go to office of aoCookie value
//                window.open(cookie.message);
                $window.location.href = cookie.message;

            } else {
                $location.path('/CountryPicker');

            }

        }
    }
});

landingApp.factory('utilityService', function () {

    return {
        getItemByName: function (name, items) {
            var foundItem = _.find(items, function (item) {

                return item.name === name;

            });

            return foundItem;
        },
        getEntryById: function (entryId, entries) {

            var foundEntry = _.find(entries, function (entry) {

                return entry.sys.id === entryId;

            });

            return foundEntry;

        },
        getAssetById: function (assetId, assets) {

            var foundAsset = _.find(assets, function (asset) {

                return asset.sys.id === assetId;

            });

            return foundAsset;

        },
        dataHasErrors: function (data) {

            var errors = data.errors;
            return (typeof errors !== "undefined");

        }
    }

});

landingApp.run(function (myService) {
    myService();
});



