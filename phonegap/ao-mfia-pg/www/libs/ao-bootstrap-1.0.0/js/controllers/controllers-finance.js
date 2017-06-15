'use strict'

angular.module('controllers-finance', [])
    .controller('financeDataCtrl', function($scope, financeData) {
    // To be used for testing only...
    $scope.testData =  financeData.getString();
    })
    .controller('matterInformationCtrl', function($scope, financeData){
        $scope.matterInformation = financeData.getMatterInfo();
    })
    .controller('matterLifeToDateCtrl', function($scope, financeData){
            $scope.matterLifeToDate = financeData.getMatterLifeToDate();
     })
;