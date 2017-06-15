"use strict";

angular.module('services-data-context', [])
    .factory('peopleSvc', function(){
        return{
            people:[
                {firstName:'Mike', lastName:'Furr'},
                {firstName:'Fiona', lastName:'Furr'},
                {firstName:'Maisie', lastName:'Furr'},
                {firstName:'Oliver', lastName:'Furr'},
                {firstName:'Poppy', lastName:'Furr'},
                {firstName:'Gwen', lastName:'Furr'},
                {firstName:'June', lastName:'Furr-Jones'},
                {firstName:'Dave', lastName:'Riches'},
                {firstName:'Daphne', lastName:'Riches'}
            ]
        }
    })
;