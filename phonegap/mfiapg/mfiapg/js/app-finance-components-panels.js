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
    .directive('panelMatterinfo', function(matterLifeToDateService, $timeout) {
        return{
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'templates/components/panel/panel-matterinfo.html',
            require: '^offCanvas',
            link: function (scope, element, attribute, appCtrl) {


            },
            controller: '@',
            name: 'ctrl'
        }
    })
    .directive('panelMatterlifetodate', function(matterLifeToDateService, $timeout) {
        return{
            restrict: 'E',
            replace: 'true',
            scope: true,
            templateUrl: 'templates/components/panel/panel-matterlifetodate.html',
            require: '^offCanvas',
            link: function (scope, element, attribute, appCtrl) {

//                scope.haveData = 0;  // Show a message saying select matter...
//                scope.gettingData = 0;  // turns the spinner on and off...
//                scope.isError = 0 // turn error message on or off...
//
//
//
//
//                // Watch for a change in the scope to selectedMatter.
//                // If it changes, go and get the data
//                scope.$watch('selectedMatter', function (newVal, oldVal) {
//                        console.log('newVal = ' + newVal);
//                        console.log('oldVal = ' + oldVal);
//                      if(newVal === undefined)
//                      {
//                          scope.haveData = 0;
//                          scope.gettingData = 0;
//                      }
//                        if(newVal !== oldVal){
//                        console.log("Selected Matter Changed...");
//                            scope.gettingData = 1;
//                            scope.haveData = 0;
//
//                        var timer = $timeout(function(){
//                            console.log('Getting Data...');
//
//                            scope.matterLifeToDate = matterLifeToDateService.matterLifeToDate;
//
//                            //got the data
//                            scope.gettingData = 0;
//                            scope.haveData = 1;
//
//
//                        }, 3000);
//                      }
//                    }
//                )

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
    .directive('panelBodyMatterinfo', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-body-matterinfo.html'

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
    .directive('panelSpinner', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-spinner.html'

        }
    })
    .directive('panelClickable', function () {
        return{
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
    .directive('panelButton', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-button.html',
            require: '^offCanvas',
//            link:function($scope, $element, $attrs, $controller)
//            {
//                $scope.panelName = $attrs.name;
//                console.write($attrs);
//            }
            scope: {
//                Isolated scope.
                name: '@',
                status: '@',
                link: '@'
            }

        }
    }).directive('panelPageHeader', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'templates/components/panel/panel-page-header.html',
            require: '^offCanvas',
//            link:function($scope, $element, $attrs, $controller)
//            {
//                $scope.panelName = $attrs.name;
//                console.write($attrs);
//            }
            scope: {
//                Isolated scope.
                selectedmatter: '@',
                selectedclient: '@',
                matterselected: '@',
                matternameselected: '@'
            }

        }
    })
;