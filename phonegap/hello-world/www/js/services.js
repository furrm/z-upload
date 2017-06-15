'use strict';

angular.module('App.services', [])
    .factory('phoneGap', [function () {
        var events = new Array();
        return {
            bindToEvents: function () {
                // Bind to all PhoneGap events.

                // NOTE: Any event handler registered after the deviceready event fires has its callback function called immediately.
                document.addEventListener('deviceready', this.registerDeviceReady, false); // The event fires when Cordova is fully loaded.

                document.addEventListener("pause", this.registerPause, false);

                document.addEventListener("resume", this.registerResume, false);
            },
            registerEvents: function () {
                // Add the event to an array
                events.push('deviceready');
            },
            registerDeviceReady: function () {
                // Add the event to an array
                events.push('deviceready');
            },
            registerPause: function () {
                // Add the event to an array
                events.push('pause');
            },
            registerResume: function () {
                // Add the event to an array
                events.push('resume');
            },
            getEvents: function () {
//                events.push('All');
//                events.push('is');
//                events.push('well');
                return events;
            },
            allEvents : events
        };
    }]);


//.factory('cordovaReady', [function () {
//    return function (fn) {
//        console.log('cordovaReady service initialized.');

//        var queue = [],
//            impl = function () {
//                queue.push([].slice.call(arguments));
//            };

//        //document.addEventListener('deviceready', function () {
//        //    queue.forEach(function (args) {
//        //        fn.apply(this, args);
//        //    });
//        //    impl = fn;
//        //}, false);

//        return function () {
//            console.log('cordovaReady service initialized.');

//            return impl.apply(this, arguments);
//        };
//    };
//}])
//.factory('PhoneGap', ['$q', function ($q) {
//    var events = new Array();
//    return {
//        bindEvents: function() {

//            // Bind to all PhoneGap events.

//            // NOTE: Any event handler registered after the deviceready event fires has its callback function called immediately.
//            document.addEventListener('deviceready', this.registerEvents('deviceready'), false); // The event fires when Cordova is fully loaded.

//            document.addEventListener("pause", this.registerEvents('pause'), false);
//        },
//        registerEvents: function (eventId) {
//            // Add the event to an array
//            events.push(eventId);
//        },
//        getEvents: function() {
//            // TODO: return  event array to caller.  Use Underscore?
//            return events;
//        }
//    };

//}]);
