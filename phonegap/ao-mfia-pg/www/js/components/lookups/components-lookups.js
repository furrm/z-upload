"use strict";

angular.module('components-lookups', [])
    .directive('subscribedMatters', function(){
        return{
            restrict:'AE',
            templateUrl:'templates/components/lookups/subscribed-matters.html',
            controller:function($scope, subscribedMatters, applicationStateMgr){
                $scope.serviceName = 'Test';
                $scope.subscribedMatters = subscribedMatters.data;

                $scope.selectMatter = function(matterId, matterName){
//                    alert(matterId);
                    applicationStateMgr.manager.selectedMatter.matterId = matterId;
                    applicationStateMgr.manager.selectedMatter.matterName = matterName;
                    $scope.isOpen = false;

//                    console.log(applicationStateMgr);
                }
            }
        }
    })
;