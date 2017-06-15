/**
 * Created with JetBrains WebStorm.
 * User: furrm
 * Date: 28/08/2013
 * Time: 06:54
 * To change this template use File | Settings | File Templates.
 */

'use strict';

angular.module('app.components', [])
.directive('kOffCanvasMenu', function(){
        return{
            restrict:'E',
            replace: true,
            transclude: true,
//            template:'<div>{{name}}</div>',
            templateUrl: 'templates/off-canvas-menu.html',
            link: function(scope, element, attrs, controller) {
                scope.name = 'Navigation';
            }
        };
    });