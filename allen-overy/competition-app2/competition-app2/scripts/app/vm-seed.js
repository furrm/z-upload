/**
 * Seed view model
 */

var app = app || {};

app.Seed = (function () {
    'use strict'



    // Activities model
    var seedModel = (function () {

        console.log('define seedModel');


        var model = {
            message: 'This is a message from the view model'
        };



//        return {
//            seed: model
//        };

        return model

    }());

    // Seed view model
    var seedViewModel = (function () {

        console.log('define seedViewModel');

        var init = function () {
            console.log('seed init Hit!');
        };

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {
            console.log("activitySelected");

            app.mobileApp.navigate('views/vw-checklist-questions.html');
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };


        return {
            init:init(),
            seed: seedModel,
            activitySelected: activitySelected
        };

    }());

    return seedViewModel;

}());
