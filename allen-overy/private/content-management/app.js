"use strict";

// main entry point into the app
angular.module('app', [])
    .controller('appCtrl', ['$scope', function ($scope) {
        $scope.name = 'appCtrl';

        var client = contentfulManagement.createClient({
            // A valid access token for your user (see above on how to create a valid access token)
            accessToken: 'fb73a654d4ee5d760507e8523cc0e17af7989c5abde321b76af463d605048dd0', // Mike - Playground

            // Enable or disable SSL. Enabled by default.
            secure: false
        });

//        var space = client.space();
        console.log('client', client.getSpace('mjl0fa6g5jyo'));
//        console.log('space', space);

    }])
;