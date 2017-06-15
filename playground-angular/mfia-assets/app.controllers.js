/// <reference path="../../libs/angularjs/angular.js" />
'use strict';

angular.module('app.controllers', ['app.services'])
    .controller('Test', ['$scope', function (scope) {
        scope.sayHello = function() { alert("Hello"); };
    }])
    .controller('MatterInfoCtrl', ['$scope', 'MatterInfo', 'PPP', '$log', '$location', function (scope, matterInfo, ppp, $log, $location) {

        scope.name = 'Matter Information';

        var matterId = $location.search()['matterId'];

        if (matterId != undefined) {
            var matterInfoData = matterInfo.getMatterInfo(matterId);
            matterInfoData.then(
                function (data) {
                    $log.info(data);
                    scope.matterInformation = data;
                },
                function (response) {
                    $log.warn(response);

                });
        }
        
        if (matterId != undefined) {
            var pppData = ppp.getPPP(matterId);
            pppData.then(
                function (data) {
                    $log.info(data);
                    scope.ppp = data;
                },
                function (response) {
                    $log.warn(response);

                });
        }

    }])
    .controller('UnpaidInvoicesCtrl', ['$scope', 'UnpaidInvoices', '$log', '$location', function (scope, unpaidInvoices, $log, $location) {

            scope.name = 'UnpaidInvoices';

            var matterId = $location.search()['matterId'];

            if (matterId != undefined) {
                var unpaidInvoicesData = unpaidInvoices.getUnpaidInvoices(matterId);
                unpaidInvoicesData.then(
                    function (data) {
                        $log.info(data);
                        scope.unpaidInvoices = data;
                    },
                    function (response) {
                        $log.warn(response);

                    });
            }

    }])
.controller('WipCtrl', ['$scope', 'Wip', '$log', '$location', function (scope, wip, $log, $location) {
    scope.name = 'Work in Progress';

    var matterId = $location.search()['matterId'];

    if (matterId != undefined) {
        var workInProgress = wip.getWip(matterId);
        workInProgress.then(
            function (data) {
                $log.info(data);
                scope.wip = data;
            },
            function (response) {
                $log.warn(response);

            });
    }
}])
    .controller('MatterOverviewCtrl', ['$scope', 'MatterLifeToDate', '$log', '$location', function (scope, matterLifeToDate, $log, $location) {

        scope.name = 'Matter Overview Life To Date';

        var matterId = $location.search()['matterId'];

        if (matterId != undefined) {
            var matterOverviewLifeToDateData = matterLifeToDate.getMatterOverviewLifeToDate(matterId);
            matterOverviewLifeToDateData.then(
                function (data) {
                    $log.info(data);
                    scope.matterOverviewLifeToDateData = data;
                },
                function (response) {
                    $log.warn(response);

                });
        }

    }])
    .controller('SubscribedMattersCtrl', ['$scope', 'SubscribedMatters', '$log', '$q', function (scope, subscribedMatters, $log, $q) {
        
        scope.name = 'Subscribed Matters';
        //subscribedMatters.get();
        //scope.result = subscribedMatters.get();
        
        var matters = subscribedMatters.getSubscribedMatters();

        matters.then(
            function (data) {
                $log.info(data);
                scope.result = data;
            },
            function (response) {
                $log.warn(response);

            });

        //scope.result.then(function(data) {
        //    console.log(data);
        //}, function(response) {
        //    console.log(response);
        //});
        

        //console.log(scope.result);
        //scope.data.then(
        //    function (data) {
        //        console.log(data);
        //    },
        //    function(response) {
        //        console.log(response);
        //    });


    }])
    .controller('AuthController', ['$scope', '$location', 'Auth', function ($scope, $location, auth) {

        //MF: This is where we will go upon success.
        var defaultRoute = "/dashboard";


        //$scope.credentials = credentials;



        $scope.doAuth = function (credentials) {
            var userId = credentials.userId;
            var password = credentials.password;

            var fullCredentials = { userId: userId, password: password };
            
            var saved = auth.save(fullCredentials);
            
            // Promise
            saved.then(
                function() {
                    console.log('User authenticated, OK to redirect...');
                    $location.path(defaultRoute);       // do we redirect?
                },
                function (response) {
                    console.log('Not sure what has happened??');
                }
            );
            
        };
        

        //// The kind of state for the UI
        //$scope.state = {
        //    isProgress: false,
        //    error: null,
        //};

        //// The search criteria
        //$scope.model = {
        //    matterId: null
        //};

        //$scope.canSearch = function () {
        //    return !$scope.state.isProgress && $scope.matterLookupForm.input.$valid;
        //};

        //$scope.doSearch = function () {
        //    // Stupid IE does not do HTML5 form validation hence explicit check
        //    if ($scope.canSearch()) {

        //        $scope.state = {};    // reset the state
        //        $scope.state.isProgress = true;

        //        rest.matter($scope.model).get(
        //            function (data) {
        //                $scope.state.isProgress = false;
        //                $location.path("/matter/:matterId/keydocs".replace(":matterId", $scope.model.matterId));
        //            }, function (error) {
        //                $scope.state.isProgress = false;
        //                $scope.state.error = error;
        //            });
        //    }
        //};

    }]);

//function SubscribedMattersCtrl($scope, rest, links) {
//    $scope.links = links;

//    $scope.result = {
//        isProgress: false,
//        state: "progress",  // progress, found, error
//        errorMessage: "No subscribed matters.",
//        matters: {
//            items: []
//        }
//    };

//    var personId = links.fromRoute("personId");
//    if (!personId || personId.toUpperCase() === 'ME') {
//        $scope.result.title = "Your subscribed matters";
//    } else {
//        $scope.result.title = ":personId's subscribed matters".replace(":personId", personId);
//    }


//    $scope.performSearch = function (personId) {
//        $scope.result.state = 'progress';

//        rest.subscribedMatters(personId).get(
//            function (data) {
//                $scope.result.matters = data;
//                $scope.result.state = 'found';
//            },
//            function (error) {
//                if (error.status === 404) {
//                    $scope.result.state = "notFound";
//                    $scope.result.errorMessage = "Nothing is found.";
//                } else {
//                    $scope.result.state = "error";
//                    $scope.result.errorMessage = "" + error.status + ": Error loading subscribed matters.";
//                }
//            });
//    };

//    if (personId) {
//        $scope.performSearch(personId);
//    } else {
//        $scope.performSearch('me');
//    }
//}