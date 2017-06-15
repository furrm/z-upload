"use strict";

angular.module('controllers-app', []).controller('appCtrl', function ($scope, manifestService, $window, $location, $timeout) {
    $scope.name = 'appCtrl'
    $scope.serviceName = manifestService.name;
    $scope.appManifest = manifestService.getManifest();

    var wordPressVars = {
        "authorizationEndpoint":"",
        "tokenEndpoint":"https://public-api.wordpress.com/oauth2/token",
        "client_id": "23850",
        "redirect_uri": "http://mobile-cms.azurewebsites.net",
        "client_secret": "iHgspqA7awWzRYOk6R9SkAdsI6JMstyXHlQkdHlQdz1ysWdomhDWafG0mMqXfbhE",
        "code": "",
        "grant_type": "authorization_code"
    }

    wordPressVars.authorizationEndpoint = "https://public-api.wordpress.com/oauth2/authorize?client_id="
        + wordPressVars.client_id + "&redirect_uri="
        + wordPressVars.redirect_uri + "&response_type=code"



    $scope.wordPress = wordPressVars;





    $scope.authorize = function () {
        console.log("Clicked Authorize");

        console.log(wordPressVars);
//       $scope.output = manifestService.authorize();
        $window.location.href = wordPressVars.authorizationEndpoint;
    }

    $scope.requestToken = function () {
        console.log('Clicked requestToken()');
        //console.log($location.search('code'));
        var dataToSend = wordPressVars;

        $scope.output = manifestService.getToken(dataToSend);
    }

    $scope.timeInMs = 0;

    var countUp = function() {
        $scope.timeInMs+= 500;
        $timeout(countUp, 500);
        $scope.$apply();
    }

    $timeout(countUp, 500);

    $scope.submitToNewWindow = function(){

       $scope.childWin = $window.open('openWindow.html',
            'frame',
            'resizeable,top=100,left=100,height=200,width=300');



        var childWinHref = $scope.childWin.document.location.href;

        $scope.childWinUrl = childWinHref;

        var counter = 0;





        $scope.$watch('childWinUrl', function(newval, oldval){
            console.log(oldval);
            console.log(newval);
        }, true);

        console.log($scope.childWin);





//        window.$windowScope = $scope;
//        window.open('openWindow.html',
//            'frame',
//            'resizeable,top=100,left=100,height=200,width=300');

//        $scope.$watch(window.document.location, function(oldVal, newVal){
//            $scope.childWindowLocation = newVal;
//        })

    }
})
    .controller('SecondaryCtrl', function($scope){
        $scope.parentWindow = window.opener.$windowScope;

        $scope.$watch('parentWindow', function(){
            console.log($scope.parentWindow.date);
        })
    })
;