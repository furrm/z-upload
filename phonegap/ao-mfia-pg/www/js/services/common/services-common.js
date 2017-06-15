"use strict";

angular.module('services-common', []).value('offCanvasStateMgr', {
    "sidebar": {
        "isOpen": false,
        "defaultTransitionEffect": 'reveal',
        "currentCssState": 'reveal'
    },
    "content": {
        "currentCssState": ''
    }})
    .factory('applicationStateMgr', function () {
        return{
            "manager": {
                "username":'',
                "userIsSignedIn": false,
                "signInUser": function (username) {
                    this.userIsSignedIn = true;
                    this.username = username;
                },
                "signOutUser": function () {
                    this.userIsSignedIn = false;
                    this.selectedMatter.matterId = 'Select Matter';
                    this.selectedMatter.matterName = 'Please select a matter from your subscribed matters.';
                },
                "selectedMatter":{
                    "matterIsSelected": false,
                    "matterId": 'Select Matter',
                    "matterName": 'Please select a matter from your subscribed matters.'
                },
                "selectedReport":{
                    "status":'1'
                }
            }
        }
    })
;

