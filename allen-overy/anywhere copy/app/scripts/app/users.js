/**
 * Users model
 */

var app = app || {};

app.Users = (function () {
    'use strict';
    
    var usersModel = (function () {

        var currentUser = kendo.observable({ data: null });
        var usersData;

        var userLoggedIn = function () {


            console.log(currentUser.get("data"));

            if (currentUser.get("data") == null)
            {
                console.log('USER NOT LOGGED IN');

                return false;

            }
            else {
                console.log('USER LOGGED IN');

                return true;
            }
        };

        var logOut = function () {

            currentUser.set("data") == null;
            return el.Users.logout();
        };
        // Retrieve current user and all users data from Everlive
        var loadUsers = function () {


            // Get the data about the currently logged in user
            return app.everlive.Users.currentUser()
            .then(function (data) {
                
                var currentUserData = data.result;
               // currentUserData.PictureUrl = app.helper.resolveProfilePictureUrl(currentUserData.Picture);
                currentUser.set('data', currentUserData);

                 //console.log(JSON.stringify(currentUserData));
                 console.log('User data ' + currentUserData.Email);
                 app.helper.setAuthenticated('true');

                // Get the data about all registered users
                return app.everlive.Users.get();
            })
            .then(function (data) {
                usersData = new kendo.data.ObservableArray(data.result);
            })
            .then(null,
                  function (err) {
                      app.showError(err.message);
                  }
            );
        };
        
        return {
            load: loadUsers,
            users: function () {
                return usersData;
            },
            logOut: logOut,
            loggedIn: userLoggedIn,
            currentUser: currentUser
        };
        
    }());
    
    return usersModel;
    
}());
