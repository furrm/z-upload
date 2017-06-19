/**
 * Created by furrm on 14/11/2014.
 */

angular.module('app', [])
.controller('AppCtrl', ['$scope', '$timeout', function($scope,$timeout){

        $scope.name = "Legend";

        // flatten the radar data
        var flattenedData = [];

        var itemCounter = 0;

        _.forEach(radar_data, function(quadrant){

            _.forEach(quadrant.items, function(item){
                itemCounter++;
                var itemToAdd = item;
                _.assign(itemToAdd, {id:itemCounter});
                _.assign(itemToAdd, {color:quadrant.color});
                _.assign(itemToAdd, {quadrant:quadrant.quadrant});
                _.assign(itemToAdd, {quadrantGuid:quadrant.guid});

                flattenedData.push(item);
            });

        });

        $scope.flattenedData = flattenedData;

        $scope.data = radar_data;

        $scope.showLegend = true;
        $scope.showLegendItems = false;



        $scope.selectBlimp = function(data){

            $scope.showLegend = false;

            $scope.blimpData = data;

            $scope.targetYear = data.targetYear;

        };

        $scope.backToLegend = function(){

            $scope.showLegend = true;

            $scope.name = "Legend";

        };

        $scope.displayLegendItems = function(quadrant){

            $scope.showLegendItems = true;

            $scope.quadrantData = quadrant;

            $scope.legendItemsTitle = "Legend - " + quadrant.quadrant;

            $scope.itemFilter = quadrant.guid;

        };

        $scope.backToCategories = function () {

//            $timeout(function () {
                $scope.showLegendItems = false;

//            }, 500);


        }

//        $scope.msg = "123";
//        function selectBlimp2(data){
//            alert("blimp 2 selected");
//            $scope.$apply(function() {
//
//            });
//        }

        $scope.$watch("name", function(newVal, oldVal){
//            alert('scope.name changed')
        });
    }])
    .directive('markup', function(){
        return{
            restrict:'E',
            replace:true,
            transclude:true,
            scope:{
                markdown: "@"
            },
            link: function(scope, element, attrs) {



                scope.$watch('markdown', function(newVal, oldVal){
//                    alert(newVal);
                    var htmlText = scope.markdown;
                    element.html(marked(htmlText));
                });
            }
        }
    })
;