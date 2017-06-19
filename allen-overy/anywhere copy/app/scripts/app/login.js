/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {

        var $loginUsername;
        var $loginPassword;

        var isAnalytics = analytics.isAnalytics();

        var init = function () {

            $loginUsername = $('#loginUsername');
            $loginPassword = $('#loginPassword');

            if (!isAnalytics) {
                console.log('EQATEC product key is not set. You cannot use EQATEC Analytics service.');
            } else
            {
                console.log(analytics.isAnalytics());
            }
        };


        var errorMessage = kendo.observable({
            name: null
        });

        var show = function () {

            if (resource.readCookie("Authenticated") == null)
            {

                $('#loggedIn').hide();
                $('#loggedOut').show();

            } else
            {
                $('#loggedOut').hide();
                $('#loggedIn').show();
            }

            $loginUsername.val('');
            $loginPassword.val('');
            errorMessage.set("name", '');
        };

        var getMessage = function () {
            return errorMessage.get("name");
        };


        var reset = function () {

            errorMessage.set("name", '');

            var username = $loginUsername.val();

            if (username == '')
                errorMessage.set("name", 'Please enter a user name');
            else {

                var object = { "Username": username };
                $.ajax({
                    type: "POST",
                    url: 'http://api.everlive.com/v1/' + appSettings.everlive.apiKey +'/Users/resetpassword',
                    contentType: appSettings.contentful.contentType,
                    data: JSON.stringify(object),
                    success: function(data){
                        errorMessage.set("name", 'Password reset request sent');

                    },
                    error: function(error){

                        var myError = JSON.parse(error.responseText);
                       // analytics.TrackFeature(myError.message);

                        errorMessage.set("name", myError.message);

                    }
                });

            }

        };

        var login = function () {

            var username = $loginUsername.val();
            var password = $loginPassword.val();

            errorMessage.set("name", '');

           // Authenticate using the username and password
            app.everlive.Users.login(username, password)
            .then(function () {

                console.log("User Load, Is analytics " + isAnalytics);

                if (isAnalytics) {
                    analytics.Start();
                    analytics.TrackFeature('Login.Regular');
                    analytics.Stop();
                }

                console.log("Users loaded " + isAnalytics);


                    return app.Users.load();
            })
            .then(function () {

                var userData = app.Users.currentUser.get('data');
                    console.log("User Data");

                    if (userData.get('IsVerified')) {

                        resource.writeCookie("Authenticated", "1");
                        resource.removeLocal(appSettings.contentful.contentTypes.tile);


                        app.mobileApp.navigate('#view-all-tiles');
                }
                else
                    errorMessage.set("name", 'Not verified');
            })
            .then(null,
                  function (err) {

                      //analytics.TrackExceptionMessage(err, err.message);
                      errorMessage.set("name", err.message);
                  }
            );
        };

        var logout = function () {

            // localStorage.removeItem("Authenticated");
            resource.removeCookie("Authenticated");
            resource.removeLocal(appSettings.contentful.contentTypes.tile);

            if (isAnalytics) {
                analytics.Start();
                analytics.TrackFeature('Logout.Regular');
                analytics.Stop();
            }

            app.mobileApp.navigate('#view-all-tiles');


        };


        return {
            init: init,
            show: show,
            getMessage: getMessage,
            login: login,
            logout: logout,
            reset: reset,
            errorMessage: errorMessage

        };

    }());

    return loginViewModel;

}());
