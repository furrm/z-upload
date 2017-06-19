var app = (function (win) {
    'use strict';


    var showError = function(message) {

        showAlert(message, 'Error occured');
    };

    win.addEventListener('error', function (e) {

        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        alert(message);

        return true;
    });

    
    // Handle device back button tap
    var onBackKeyDown = function(e) {

        e.preventDefault();

        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {

            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {
                // Stop EQATEC analytics monitor on app exit
                if (analytics.isAnalytics()) {
                    analytics.Stop();
                }
                AppHelper.logout().then(exit, exit);
            }

        }, 'Exit', 'Ok,Cancel');
    };

    var onDeviceReady = function() {

        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);

    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);


    
    var emptyGuid = '00000000-0000-0000-0000-000000000000';
    

    
    var os = kendo.support.mobileOS,  
    statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
        transition: 'slide',
        layout: 'mobile-tabstrip',
        statusBarStyle: statusBarStyle,
        skin: 'flat'
    });
    


    return {
        showError: showError,
        mobileApp: mobileApp

    };

}(window));

