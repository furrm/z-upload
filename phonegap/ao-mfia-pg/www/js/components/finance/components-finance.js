"use strict";

angular.module('components-finance', [])
.directive('financeReportData', function(){
        return{
            restrict:'AE',
            templateUrl:'templates/components/finance/finance-report-data.html',
            replace:true,
            controller:function($scope, matterInfo, matterLifeToDate, workInProgress, unpaidInvoice){

                // MATTER INFO
                $scope.matterInfo =  matterInfo.matterInfo;

                // MATTER OVERVIEW LIFE TO DATE
                $scope.matterLifeToDate = matterLifeToDate.matterLifeToDate;

                // WORK IN PROGRESS
                $scope.workInProgress = workInProgress.workInProgress;

                // UNPAID INVOICES
                $scope.unpaidInvoices = unpaidInvoice.unpaidInvoices;

            }
        }
    })
;