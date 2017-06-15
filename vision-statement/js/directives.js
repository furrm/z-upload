angular.module('mikes-directives', [])
.directive('markup', function(){
        return{
            restrict:'E',
            scope:{
                markdown: "@"
            },
            link: function(scope, element, attrs) {

//                var htmlText = "<p>poo</p>";
//                var htmlText = element.html();
                var htmlText = scope.markdown;
                element.html(marked(htmlText));
            }
        }
    })
;/**
 * Created by furrm on 20/07/2014.
 */
