"use strict";
angular.module("cmaDocs", [], function () {
}).run(["$rootScope", "authService", function ($rootScope, authService) {
    authService.login().then(function (t) {
        $rootScope.auth = t
    })
}]), angular.module("cmaDocs")
    .constant("authConfig", {
        oauthAuthorizationEndpoint: "https://be.contentful.com/oauth/authorize?response_type=token&client_id=70cf05b204d69c7736bdd233bb9e95f508ecc76bea36c7e600ec562840b1e360&redirect_uri=https://www.contentful.com/developers/documentation/content-management-api/&scope=content_management_manage",
        apiTokenEndpoint: "https://api.contentful.com/token"}),
    angular.module("cmaDocs")
    .service("authService", ["$http", "$q", "authConfig", "kvService", function ($http, $q, authConfig, kvService) {
    function c() {
        var e = location.hash, t = e.match(/access_token=(\w+)/);
        return!!t && t[1]
    }

    function r() {
        /access_token/.test(location.hash) && (location.hash = "")
    }

    function a() {
        var e = c() || kvService.get("cmaAccessToken");
        return r(), e
    }

    return{login: function () {
        var c = a();
        if (!c) {
            var r = $q.defer();
            return r.reject(new Error("No access token provided, should redirect to OAuth authorization endpoint.")), r.promise
        }
        return $http.get(authConfig.apiTokenEndpoint, {headers: {Authorization: "Bearer " + c}}).then(function (e) {
            return kvService.set("cmaAccessToken", c), {accessToken: c, user: e.data.includes.User[0]}
        }, function (e) {
            return kvService.delete("cmaAccessToken", c), new Error("Authentication error: " + e.data.message)
        })
    }, logout: function () {
        r(), kvService.delete("cmaAccessToken")
    }}
}]), angular.module("cmaDocs").factory("kvService", function () {
    return{"delete": function (e) {
        return localStorage.removeItem(e)
    }, get: function (e) {
        return localStorage.getItem(e)
    }, has: function (e) {
        return e in localStorage
    }, set: function (e, t) {
        localStorage.setItem(e, t)
    }}
}), angular.module("cmaDocs").directive("loginForm", ["$rootScope", "authConfig", "authService", function (e, t, n) {
    return{restrict: "E", controller: ["$scope", function (o) {
        o.login = function () {
            location.href = t.oauthAuthorizationEndpoint
        }, o.logout = function () {
            n.logout(), delete e.auth
        }
    }]}
}]);