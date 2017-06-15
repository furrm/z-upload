"use strict";

angular.module('services-common', []).value('offCanvasStateMgr', {
        "sidebar": {
            "isOpen":false,
            "defaultTransitionEffect": 'reveal',
            "currentCssState":'reveal'
        },
        "content":{
            "currentCssState":''
        }});