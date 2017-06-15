'use strict';

angular.module('app.finance.components.panels', [])
    .directive('panel', function () {
        return{
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'templates/components/panel/panel.html',
            require: '^offCanvas',
            link: function (scope, element, attribute, appCtrl) {

            },
            controller: '@',
            name: 'ctrl'
        }
    })
    .directive('panelMatterlifetodate', function(matterLifeToDateService) {
        return{
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'templates/components/panel/panel-matterlifetodate.html',
            require: '^offCanvas',
            link: function (scope, element, attribute, appCtrl) {

                // Watch for a change in the scope to selectedMatter.
                // If it changes, go and get the data
                scope.$watch('selectedMatter', function () {
                        alert('Changed');
                        scope.matterLifeToDate = matterLifeToDateService.matterLifeToDate;
                    }
                )

            },
            controller: '@',
            name: 'ctrl'
        }
    })
    .directive('panelWorkinprogress', function () {
        return{
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'templates/components/panel/panel-workinprogress.html',
            require: '^offCanvas',
            link: function (scope, element, attribute, appCtrl) {

            },
            controller: '@',
            name: 'ctrl'
        }
    })
    .directive('panelUnpaidinvoice', function () {
        return{
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'templates/components/panel/panel-unpaidinvoices.html',
            require: '^offCanvas',
            link: function (scope, element, attribute, appCtrl) {

            },
            controller: '@',
            name: 'ctrl'
        }
    })
    .directive('panelHeader', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-header.html'

        }
    })
    .directive('panelBodyTemp', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-body-temp.html'

        }
    })
    .directive('panelBodyMatterlifetodate', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-body-matterlifetodate.html'

        }
    })
    .directive('panelBodyWorkinprogress', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-body-workinprogress.html'

        }
    })
    .directive('panelBodyUnpaidinvoices', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-body-unpaidinvoices.html'

        }
    })
    .directive('panelFooter', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-footer.html'

        }
    })
    .directive('panelClickable', function () {
        return{
//            scope:true,
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-clickable.html',
            require: '^offCanvas',
//            link:function($scope, $element, $attrs, $controller)
//            {
//                $scope.panelName = $attrs.name;
//                console.write($attrs);
//            }
            scope: {
//                Isolated scope.
                name: '@',
                href: '@'
            }

        }
    })
;