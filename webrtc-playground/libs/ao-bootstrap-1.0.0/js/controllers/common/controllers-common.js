"use strict";

angular.module('controllers-common', [])
    .controller('offCanvasCtrl', function ($scope, offCanvasStateMgr) {

        $scope.offCanvasState = offCanvasStateMgr;

        console.log(offCanvasStateMgr);

        // Alter the transition effect for the sidebar...
        $scope.changeEffect = function(effect){
            offCanvasStateMgr.sidebar.defaultTransitionEffect = effect;
            offCanvasStateMgr.sidebar.currentCssState = effect;
            $scope.offCanvasState = offCanvasStateMgr;

        }

        $scope.toggleMenuState = function (command) {

            if(command === 'close'){

                offCanvasStateMgr.sidebar.isOpen = false;

                offCanvasStateMgr.content.currentCssState = '';

                $scope.offCanvasState = offCanvasStateMgr;

            }
            else {

                offCanvasStateMgr.sidebar.currentCssState = offCanvasStateMgr.sidebar.defaultTransitionEffect;
                offCanvasStateMgr.sidebar.isOpen = true;

                offCanvasStateMgr.content.currentCssState = offCanvasStateMgr.sidebar.defaultTransitionEffect + ' sidebar-open';

                $scope.offCanvasState = offCanvasStateMgr;

            }
        }


    });

