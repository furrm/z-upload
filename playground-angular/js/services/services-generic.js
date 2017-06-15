"use strict";

angular.module('services-generic', [])
    //Value function
    .value('valueStringSvc', 'A value from the valueStringSvc.')
    .value('valueObjSvc', {theObj: {firstName: 'Joe', lastName: 'Bloggs'}})
    // Constant function
    .constant('noChange', 'I dont change...')
    // factory
    .factory('factoryObjSvc', function () {
        return {theObj: {firstName: 'Joe', lastName: 'Bloggs'}}
    })
    // Service function: Not working
//    .service('serviceObjSvc', Registration)
    // Provider function: See Angular Best Practices
    // http://pluralsight.com/training/Player?author=joe-eames&name=angular-best-practices-m3&mode=live&clip=5&course=angular-best-practices
    .config(function ($provide) {
        $provide.provider('providerSvc', function(){
            var type;
            return{
                setType: function(value){
                    type = value;
                },
                $get:function(){
                    return{
                        title:'Provider Service ' + type
                    }
                }
            }
        })
    })
    // The following allows the setType function of the Provider service to be configured.
    // The provideSvcProvider is the object that angular creates when the above providerSvc is created.
    .config(function(providerSvcProvider){
        providerSvcProvider.setType('Angular JS');
    })
;

var Registration = function () {
    this.title = 'Registration Service from service function';
}

Registration.prototype = function () {
    return this.title;
}