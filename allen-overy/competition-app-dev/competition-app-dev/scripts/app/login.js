/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {
        
        var isInMistSimulator = (location.host.indexOf('icenium.com') > -1);
        
        var $loginUsername;
        var $loginPassword;
  
        var isAnalytics = analytics.isAnalytics();
        
        var init = function () {
            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');
            
            if (!isAnalytics) {
                console.log('EQATEC product key is not set. You cannot use EQATEC Analytics service.');
            }
        };
        
        var show = function () {
            $loginUsername.val('');
            $loginPassword.val('');
        };
        
        var getYear = function () {
            var currentTime = new Date();
            return currentTime.getFullYear();
        };

        // Authenticate to use Everlive as a particular user
        var login = function () {

            var username = $loginUsername.val();
            var password = $loginPassword.val();

            // Authenticate using the username and password
            app.everlive.Users.login(username, password)
            .then(function () {
                // EQATEC analytics monitor - track login type
                if (isAnalytics) {
                    analytics.TrackFeature('Login.Regular');
                }
                
                return app.Users.load();
            })
            .then(function () {

                 app.mobileApp.navigate('views/tilesView.html');
                // app.mobileApp.navigate('views/contactsView.html');
            })
            .then(null,
                  function (err) {
                      app.showError(err.message);
                  }
            );
        };
        
        
        var loginGuest = function () {

            var username = 'guest';
            var password = 'guest';

            //  Authenticate using the username and password
            app.everlive.Users.login(username, password)
            .then(function () {
                // EQATEC analytics monitor - track login type
                if (isAnalytics) {
                    analytics.TrackFeature('Login.Regular');
                }
                
                return app.Users.load();
            })
            .then(function () {

                app.mobileApp.navigate('views/tilesView.html');
                   //   app.mobileApp.navigate('views/contactsView.html');
                
            })
            .then(null,
                  function (err) {
                      app.showError(err.message);
                  }
            );
        };


        var showMistAlert = function () {
            alert(appSettings.messages.mistSimulatorAlert);
        };

        return {
            init: init,
            show: show,
            getYear: getYear,
            loginGuest: loginGuest,
            login: login
        };

    }());

    return loginViewModel;

}());
