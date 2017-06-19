/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {
        

        var init = function () {
            console.log('init Hit!');
        };
        
        var show = function () {
            console.log('show Hit!');
        };

        var navigateToSeed = function (e) {

            app.mobileApp.navigate('views/seed-view.html');
        };
        

        return {
            init: init,
            show: show
        };

    }());

    return loginViewModel;

}());
