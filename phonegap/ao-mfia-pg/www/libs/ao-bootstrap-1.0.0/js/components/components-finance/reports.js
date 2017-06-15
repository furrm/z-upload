"use strict";

angular.module('components-finance-reports', [])
    .directive('reportMatterLifeToDate', function () {
        return{
            restrict:'AE',
            templateUrl:'templates/components/finance/matter-life-to-date.html',
            scope:{
                matterid: '@',
                reportname: '@'
            },
            controller: '@',
            name: 'ctrl'
        }
    });