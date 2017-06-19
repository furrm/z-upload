var app = (function (win) {
    'use strict';

    // localStorage.removeItem('authenticated');

    // Global error handling
    var showAlert = function(message, title, callback) {

       navigator.notification.alert(message, callback || function () {
       }, title, 'OK');
    };

    var showError = function(message) {

        console.log(message);
        showAlert(message, 'Error occured');
    };

    win.addEventListener('error', function (e) {

        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        return true;
    });
    
    var isApiKeySet = (appSettings.everlive.apiKey !== '$EVERLIVE_API_KEY$');
    
    if (!isApiKeySet) {
        alert('Everlive API Key is not set.');
        return;
    }
    
    // Handle device back button tap
    var onBackKeyDown = function(e) {

        e.preventDefault();

        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {

            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {

                AppHelper.logout().then(exit, exit);
            }

        }, 'Exit', 'Ok,Cancel');
    };

    var onDeviceReady = function() {

        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);

        console.log("IN DEVICE READY");


        if (analytics.isAnalytics()) {
            analytics.Start();
        }

    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

    // Initialize Everlive SDK
    var el = new Everlive({
        apiKey: appSettings.everlive.apiKey,
        scheme: appSettings.everlive.scheme
    });
    
    var emptyGuid = '00000000-0000-0000-0000-000000000000';
    
    var AppHelper = {

        // Return current activity picture url
        loggedIn: function (id) {

            return false;
        },

        authenticated: function (id) {

//            var auth = localStorage.getItem('authenticated');
//
//            if  (auth == null || auth == undefined || auth == 'false')
//                return 'false';
//            else
//                return 'true';

            return 'true';

        },

        setAuthenticated: function (id) {
           // localStorage.setItem('authenticated', id);
        },

        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {
            
            var months = [
                'Jan', 'Feb', 'Mar',
                'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ];
            var date = new Date(dateString);
            var year = date.getFullYear();
            var month = months[ date.getMonth() ];
            var day = date.getDate();

            return month + ' ' + day + ', ' + year;
        },

        // Current user logout
        logout: function () {
            return el.Users.logout();
        }
    };
    
    var os = kendo.support.mobileOS,  
    statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
     //   initial: '#anywhereApp',
         transition: 'slide',
        layout: 'mobile-tabstrip',
        skin: 'flat',
        platform: {
            device: "ipad",       // Mobile device, can be "ipad", "iphone", "android", "fire", "blackberry", "wp", "meego"
            name: "ios",          // Mobile OS, can be "ios", "android", "blackberry", "wp", "meego"
            ios: true,            // Mobile OS name as a flag
            majorVersion: 5,      // Major OS version
            minorVersion: "0.0",  // Minor OS versions
            flatVersion: "500",   // Flat OS version for easier comparison
            appMode: false,       // Whether running in browser or in AppMode/PhoneGap/Icenium.
            tablet: "ipad"        // If a tablet - tablet name or false for a phone.
        },
        statusBarStyle: statusBarStyle
    });

    // localStorage.removeItem('authenticated');


    return {
        showAlert: showAlert,
        showError: showError,
        mobileApp: mobileApp,
        helper: AppHelper,
        everlive: el
    };

}(window));

