"use strict";

angular.module('services-app', [])
.factory('manifestService', function($resource, $http){
    return{
        "name":'manifestService',
        "getManifest": function(){
            return $resource('js/app/manifest.js').get();
        },
        "authorize": function(){
            var endpoint = 'https://public-api.wordpress.com/oauth2/authorize?client_id=23130&redirect_uri=http://mobile-cms.azurewebsites.net&response_type=code';
            console.log("Authorizing");
//            $window.open(endpoint);
//            return $resource(endpoint).get();
//            return $resource('https://public-api.wordpress.com/oauth2/authorize?client_id=23130&redirect_uri=https://wordpress.com/&response_type=code').get();
            var url = "http://public-api.wordpress.com/rest/v1/sites/wtmpeachtest.wordpress.com/posts?callback=JSON_CALLBACK";

            //$http.redirectTo(endpoint);
//            $http.jsonp(endpoint)
//                .success(function(data){
//                    console.log(data.found);
//                });
        },
        "getData":function(url){
            return $resource('http://httpbin.org/get').get();
        }
    }
})
;