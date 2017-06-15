'use strict'

angular.module('services-finance', [])
    .factory('financeData', function($resource){
        return{
            "getString":function(){
                return "Welcome the the Finance Data Service!";
            },
            "getMatterInfo":function(){
                return $resource('data/finance/matterinfo-0033351-0002285.txt').get();
            }
            ,
            "getMatterLifeToDate":function(){
                return $resource('data/finance/matterlifetodate-0033351-0002285.txt').get();
            }
        }
    })
;