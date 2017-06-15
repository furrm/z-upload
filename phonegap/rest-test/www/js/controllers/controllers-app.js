"use strict";

angular.module('controllers-app', []).controller('appCtrl', function ($scope, manifestService, $window, $location) {
    $scope.name = 'appCtrl'
    $scope.serviceName = manifestService.name;
    $scope.appManifest = manifestService.getManifest();

    var wordPressVars = {
        "authorizationEndpoint":"",
        "tokenEndpoint":"https://public-api.wordpress.com/oauth2/token",
        "client_id": "23130",
        "redirect_uri": "http://localhost:63342/word-press/index.html",
        "client_secret": "niBELUuQqID8JeSDtWJURiv9KBbQNne7DZY0qFztXhOtD2NgQGUeYIDVXytPYMYY",
        "code": "",
        "grant_type": "authorization_code"
    }

    wordPressVars.authorizationEndpoint = "https://public-api.wordpress.com/oauth2/authorize?client_id="
        + wordPressVars.client_id + "&redirect_uri="
        + wordPressVars.redirect_uri + "&response_type=code"



    $scope.wordPress = wordPressVars;


    $scope.currentLocation = $location.path();

    $scope.getUrl = function(){
        $scope.currentUrl = $location.path();
    }

    $scope.authorize = function () {
        console.log("Clicked Authorize");

        console.log(wordPressVars);
//       $scope.output = manifestService.authorize();
        $window.location.href = wordPressVars.authorizationEndpoint;


    }

    $scope.requestToken = function () {
        console.log('Clicked requestToken()');
        console.log($location.search('code'));
        var dataToSend = wordPressVars;




//        $scope.output = manifestService.getToken(dataToSend);
    }

    $scope.getData = function(){
        $scope.output = manifestService.getData();
    }

    $scope.submitToNewWindow = function(){
        window.$windowScope = $scope;
        window.open('openWindow.html',
            'frame',
            'resizeable,top=100,left=100,height=200,width=300');

        console.log(window);

    }


});