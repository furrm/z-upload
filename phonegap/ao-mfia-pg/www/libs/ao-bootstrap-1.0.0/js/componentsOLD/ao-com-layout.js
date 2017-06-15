/**
 * Created with JetBrains WebStorm.
 * User: zadmfurr
 * Date: 03/09/13
 * Time: 09:36
 * Version: 1.0.0
 * To change this template use File | Settings | File Templates.
 */

'use strict'

angular.module('ao-bs-com-layout', [])
    .directive('aoOffCanvas', function () {
        return{
            restrict: 'E',
            template: '<div class="well"><h1>Welcome to Off Canvas!!</h1></div>',
            replace: true
        }
    });