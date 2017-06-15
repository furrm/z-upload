'use strict';

angular.module('app.finance.controllers', [])
    .controller('MatterInfoCtrl', function ($scope, $q, $log, matterInfoService) {
        $scope.panelName = 'Matter Info';

        $scope.buttonClicked = 'Click my button ;-)';

        $scope.panelMenuClick = function (args) {
            switch (args) {
                case 'dataTable':
                    $scope.buttonClicked = 'Data table clicked!!';
                    break;
                case 'chart':
                    $scope.buttonClicked = 'Ok, Ill render a chart.';
                    break;
                case 'refresh':
                    $scope.buttonClicked = 'Gonna refresh...';
                    break;
                default:
                    $scope.buttonClicked = 'Not sure what was clicked, but the args = ' + args;
            }

        }

        $scope.matterInfo =  matterInfoService.matterInfo;




//            var matterInfoData = matterInfo.matterInfoService('123');
//            matterInfoData.then(
//                function (data) {
//                    $log.info(data);
//                    $scope.matterInfo = data;
//                },
//                function (response) {
//                    $log.warn(response);
//
//                });

    })
    .controller('MatterOverviewLifeToDateCtrl', function ($scope, matterLifeToDateService) {

        $scope.panelName = 'Matter Overview Life To Date';

        $scope.buttonClicked = 'Click my button ;-)';

        $scope.panelMenuClick = function (args) {
            switch (args) {
                case 'dataTable':
                    $scope.buttonClicked = 'Data table clicked!!';
                    break;
                case 'chart':
                    $scope.buttonClicked = 'Ok, Ill render a chart.';
                    break;
                case 'refresh':
                    $scope.buttonClicked = 'Gonna refresh...';
                    break;
                default:
                    $scope.buttonClicked = 'Not sure what was clicked, but the args = ' + args;
            }

        }

//        $scope.matterLifeToDate = matterLifeToDateService.matterLifeToDate;
    })
    .controller('WorkInProgressCtrl', function ($scope, workInProgressService) {
        $scope.panelName = 'Work In Progress';

        $scope.buttonClicked = 'Click my button ;-)';

        $scope.panelMenuClick = function (args) {
            switch (args) {
                case 'dataTable':
                    $scope.buttonClicked = 'Data table clicked!!';
                    break;
                case 'chart':
                    $scope.buttonClicked = 'Ok, Ill render a chart.';
                    break;
                case 'refresh':
                    $scope.buttonClicked = 'Gonna refresh...';
                    break;
                default:
                    $scope.buttonClicked = 'Not sure what was clicked, but the args = ' + args;
            }

        }

//        $scope.workInProgress = workInProgressService.workInProgress;
    })
    .controller('UnpaidInvoicesCtrl', function ($scope, unpaidInvoiceService) {

        $scope.panelName = 'Unpaid Invoices';

        $scope.buttonClicked = 'Click my button ;-)';

        $scope.panelMenuClick = function (args) {
            switch (args) {
                case 'dataTable':
                    $scope.buttonClicked = 'Data table clicked!!';
                    break;
                case 'chart':
                    $scope.buttonClicked = 'Ok, Ill render a chart.';
                    break;
                case 'refresh':
                    $scope.buttonClicked = 'Gonna refresh...';
                    break;
                default:
                    $scope.buttonClicked = 'Not sure what was clicked, but the args = ' + args;
            }

        }

//        $scope.unpaidInvoices = unpaidInvoiceService.unpaidInvoices;

    })
    .controller('SubscribedMattersCtrl', function($scope, subscribedMatterService, cacheService){

        var subscribedMatters = subscribedMatterService.items;

        $scope.subscribedMatters = subscribedMatters;
        cacheService.put('matters:subscribed:username', subscribedMatters);


    })
    .controller('CacheCtrl', function($scope, cacheService){
        $scope.getCacheInfo = function(){
            return cacheService.info();
        }


    })
;
