/**
 * Created by furrm on 03/07/2015.
 */

angular.module('mf-directives', [])
.directive('mfFitParent', function(){
        return{
            restrict:'A',
            link:function(scope, elem, attrs){
                scope.text = "Hello";

                // get the parent element
                var parentElem = elem[0].parent();

                console.log('parentElem', parentElem); // todo: delete me
            }
        }
    })
;