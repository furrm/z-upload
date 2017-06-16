"use strict";
angular.module('room-controllers', [])
    .controller('roomCtrl', function ($scope) {
        $scope.name = 'roomCtrl';

    })
;


//angular.module("videoconference").controller("frontpageController", ["$scope", "$location", "$http", "$rootScope", "Analytics", "RoomName", function ($scope, $location, $http, $rootScope
//    , Analytics, RoomName) {
//    Analytics.kissmetrics.record("Visited frontpage"), o.controller = "frontpage", $scope.$on("$destroy", function () {
//        o.controller = ""
//    }), $scope.roomNameRequirements = RoomName.requirements, $scope.roomNamePattern = RoomName.pattern, $scope.roomName = "", $scope.randomizeName = function () {
//        $http.post("/random-room-name").success(function (t) {
//            $scope.suggestedRoomName = t.roomName
//        })
//    }, $scope.launchRoom = function () {
//        Analytics.sendAnalytics("event", "Frontpage", "User action", "Created room from frontpage"), Analytics.kissmetrics.record("Created room from frontpage"), $scope.roomName = encodeURI($scope.roomName.replace(/[_ ]/g, "-")), "" !== $scope.roomName ? $location.url("/" + $scope.roomName) : $location.url("/" + $scope.suggestedRoomName)
//    }, $scope.getRoomName = function () {
//        return"" === $scope.roomName ? $scope.suggestedRoomName : $scope.roomName
//    }, $scope.btnRandomizeName = function () {
//        Analytics.sendAnalytics("event", "Frontpage", "User action", "Randomized new room name"), $scope.randomizeName()
//    }, $scope.randomizeName()
//}])