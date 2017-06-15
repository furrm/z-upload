/// <reference path="../../libs/angularjs/angular.js" />
/// <reference path="../../libs/angularjs/angular-resource.js" />

'use strict';

angular.module('app.services', ['ngResource'])
    .factory('QrDataReal', ['$resource', function($resource) {
        var self = {};

        // List of subscribed matters
        self.subscribedMatters = function(personId) {
            var docUri = "omnia/api/person/:personId/matters/subscribed"; //BAD
            var params = { personId: personId };
            return $resource(docUri, params);
        };

        return self;
    }])
    .factory('QrData', ['QrDataReal', function(QrDataReal) {

        var self = {};

        self.subscribedMatters = function(personId) {
            return getService().subscribedMatters(personId);
        };

        return self;
    }])
    .factory('MatterInfo', ['$resource', '$log', '$q', function($resource, $log, $q) {
        //$log("Getting matter info data...");
        return {
            getMatterInfo: function(matterId) {
                var deferred = $q.defer();
                $resource('apps/mfia/api/report/matterinfo/:matterId', { 'matterId': matterId })
                    .query(
                        function(data) {
                            $log.info('SUCCESS!!');
                            deferred.resolve(data);
                        }, function(response) {
                            $log.info('FAILED!!');
                            deferred.reject(response);
                        });
                return deferred.promise;
            }
        };


    }])
    .factory('MatterLifeToDate', ['$resource', '$log', '$q', function($resource, $log, $q) {
        //$log("Getting matter info data...");
        return {
            getMatterOverviewLifeToDate: function(matterId) {
                var deferred = $q.defer();
                $resource('apps/mfia/api/report/MatterLifeToDate/:matterId', { 'matterId': matterId })
                    .get(
                        function(data) {
                            $log.info('SUCCESS!!');
                            deferred.resolve(data);
                        }, function(response) {
                            $log.info('FAILED!!');
                            deferred.reject(response);
                        });
                return deferred.promise;
            }
        };
    }])
    .factory('UnpaidInvoices', ['$resource', '$log', '$q', function ($resource, $log, $q) {

        return {
            getUnpaidInvoices: function (matterId) {
                var deferred = $q.defer();
                $resource('apps/mfia/api/report/unpaidinvoices/:matterId', { 'matterId': matterId })
                    .get(
                        function (data) {
                            $log.info('SUCCESS!!');
                            deferred.resolve(data);
                        }, function (response) {
                            $log.info('FAILED!!');
                            deferred.reject(response);
                        });
                return deferred.promise;
            }
        };
    }])
.factory('PPP', ['$resource', '$log', '$q', function ($resource, $log, $q) {

    return {
        getPPP: function (matterId) {
            var deferred = $q.defer();
            $resource('apps/mfia/api/report/ppp/:matterId', { 'matterId': matterId })
                .get(
                    function (data) {
                        $log.info('SUCCESS!!');
                        deferred.resolve(data);
                    }, function (response) {
                        $log.info('FAILED!!');
                        deferred.reject(response);
                    });
            return deferred.promise;
        }
    };
}])
    .factory('Wip', ['$resource', '$log', '$q', function($resource, $log, $q) {

        return {
            getWip: function(matterId) {
                var deferred = $q.defer();
                $resource('apps/mfia/api/report/workinprogress/:matterId', { 'matterId': matterId })
                    .get(
                        function(data) {
                            $log.info('SUCCESS!!');
                            deferred.resolve(data);
                        }, function(response) {
                            $log.info('FAILED!!');
                            deferred.reject(response);
                        });
                return deferred.promise;
            }
        };

    }])
    .factory('Auth', ['$resource', '$q', function($resource, $q) {

        var url = 'auth/api/form/omnia';

        var resource = $resource(url);

        return {
            save: function(credentials) {
                var deferred = $q.defer();
                resource.save(credentials,
                    function() {
                        deferred.resolve();
                    }, function(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
        };

    }])
    .factory('SubscribedMatters', ['$resource', '$q', '$log', function($resource, $q, $log) {

        var url = 'omnia/api/person/me/matters/subscribed';


        return {
            getSubscribedMatters: function() {
                var deferred = $q.defer();
                $resource(url)
                    .get(
                        function(data) {
                            $log.info('SUCCESS!!');
                            deferred.resolve(data);
                        }, function(response) {
                            $log.info('FAILED!!');
                            deferred.reject(response);
                        });
                return deferred.promise;
            }
        };

    }]);
