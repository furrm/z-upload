/**
 * Contacts2 view model
 */

var app = app || {};

app.Contacts2 = (function () {
    'use strict'



//    // contacts model
//    var contacts2Model = (function () {
//
//        console.log('define contactsModel');
//
//
//        var model = {
//            message: 'This is a message from the view model'
//        };
//
//
//
////        return {
////            seed: model
////        };
//
//        return model
//
//    }());


    function getData() {

        var space = "zpp0viuq4x1e";
        var contentType = "4ygwXLGXPWWuWcQGiSeyGa";
        var authorisation = "Bearer 31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60";

//        var url = "https://cdn.contentful.com/spaces/" + space + "/entries";
        var url = 'data/contacts-mapped.json';


        var promise = $.ajax({
            url: url,
            dataType: "json",
            data: {
                content_type: contentType
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', authorisation),
                    xhr.setRequestHeader('Content-Type', 'application/json')
            }});

        return promise;

//                .done(function (data, status) { // success
//                    console.log('GETDATA() SUCCESS!!!');
//                    console.log('GETDATA() SUCCESS DATA:', data);
//                    console.log('GETDATA() SUCCESS STATUS:', status);
//
//                    var ret = contactsDataMapper(data);
//
//                    return ret;
//
//                })
//                .fail(function(xhr, status){ // error
//                    console.log('GETDATA() ERROR!!!');
//                    console.log('GETDATA() XHR:', xhr);
//                    console.log('GETDATA() STATUS:', status);
//                })
//                .always(function(data, status){ // complete
//                    console.log('GETDATA() COMPLETE!!!');
//                    console.log('GETDATA() COMPLETE DATA:', data);
//                    console.log('GETDATA() COMPLETE STATUS:', status);
//
//                });
    }

    var data = {"items":[
        {"firstName":"Fiona Furr"},
        {"firstName":"Mike Furr"}
    ]};

    var ds = new kendo.data.DataSource({
                data:data
    });

    console.log('DATASOURCE READ');



    // Contacts2 view model
    var contacts2ViewModel = kendo.observable({
        "title":"Contacts2",
//        "contacts":(function(){
//            var data = [
//                {"title":"Fiona Furr"},
//                {"title":"Mike Furr"}
//            ];
//
//            return new kendo.data.DataSource({
//                data:data
//            });
//        }),
        "contacts":ds,
        "init": function(){
            ds.fetch();
            var vm = this;

            console.log('contacts2ViewModel - INIT CALLED');
            console.log('contacts2ViewModel - this', vm);

            // CALL CONTENTFUL




            setTimeout(function(){


                vm.model.set("title", "Changed by the VM");
//                vm.model.set("contacts", data);

                console.log(
                    "CONTACTS",
                    vm.model.get("contacts")
                );

            }, 2000);
        },
        "show":function(){
            console.log('contacts2ViewModel - SHOW CALLED');

        }


    })



    return contacts2ViewModel;

}());
