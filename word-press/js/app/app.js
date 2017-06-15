"use strict";

angular.module('app', [
    'ngResource',
    'services-app',
    'controllers-app'
]).config(function($sceDelegateProvider){
//        $httpProvider.defaults.useXDomain = true;
//        delete $httpProvider.defaults.headers.common['X-Requested-With'];
//        $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?yourdomain.com/]);
//        $sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?yourdomain.com/]);

        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'http://srv*.assets.example.com/**',
            'https://public-api.wordpress.com/**'
        ]);

        // The blacklist overrides the whitelist so the open redirect here is blocked.
        $sceDelegateProvider.resourceUrlBlacklist([
            'http://myapp.example.com/clickThru**']);

    });