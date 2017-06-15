'use strict'

angular.module('components-utils', [])
    .directive('signIn', function () {
        return{
            restrict:'AE',
            templateUrl:'templates/components/panels/sign-in.html' ,
            replace:true,
            scope:{type:'@'}
        }
    });
