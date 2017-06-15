"use strict";

angular.module('services-contentful', [])
    .factory('spacesSvc', function ($resource, $http, $q, notifier) {
        var spacesURL = 'https://cdn.contentful.com/spaces/3iz8fe39hhkf';
        // Requires Authorization header to be added with value of
        // Bearer ac63494b8ada6af799e1be84629978e68459b0604881b736ed7a06216edf52ed
//        return $resource('data/spaces/:id', {id:"@id"});

        return{
            // START:EXAMPLE - $resource
            getResource: function (id) {
                var deferred = $q.defer();

                notifier.notify.information('Getting Data Via $resource...')

                $resource('/~furrm/angular-playground/data/spaces/:id', { 'id': id })
                    .get(
                    function (data) {
                        notifier.notify.success('Data Downloaded...')
                        console.log(data);
                        deferred.resolve(data);
                    }, function (response) {
                        notifier.notify.error('Error Getting Data (' + response.status + ')...')
                        console.log(response);
                        deferred.reject(response);
                    });
                return deferred.promise;
            },
            // END:EXAMPLE - $resource
            // START:EXAMPLE - $http
            getHttp: function () {
                var deferred = $q.defer();

                $http.get('/~/angular-playground/data/spaces/3iz8fe39hhkf')
                    .success(function (data) {
                        notifier.notify.success('The service has the data...')
                        console.log(data);
                        deferred.resolve(data);
                    }).error(function (response) {
                        console.log(response);
                        notifier.notify.error('The service encountered an error...')
                        deferred.reject(response);
                    })

                return deferred.promise;

            }
            // END:EXAMPLE - $http

        }


    })
;