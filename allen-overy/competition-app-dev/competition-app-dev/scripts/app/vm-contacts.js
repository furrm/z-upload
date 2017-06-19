/**
 * Contacts view model
 */

var app = app || {};

app.Contacts = (function () {
    'use strict'


    // Contacts model
    var contactsModel = (function () {

        var retData;

        var retDataObservable = new kendo.observable({data: {"items": []}});
        var retDataObservable2 = new kendo.observable({data: {"items": []}});
        var retDataObservable3 = new kendo.observable({fistName:'Mike'});


        console.log('retDataObservable', retDataObservable);
        console.log('retDataObservable2', retDataObservable2);


        var promise = function getData() {

            var space = "zpp0viuq4x1e";
            var contentType = "4ygwXLGXPWWuWcQGiSeyGa";
            var authorisation = "Bearer 31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60";

        var url = "https://cdn.contentful.com/spaces/" + space + "/entries";
//            var url = 'data/contacts.json';
//            var url = 'data/contacts-mapped.json';


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
        }


        // todo; would like the contacts property to be a kendo.data.DataSource
        var model = {
            contacts: retDataObservable,
            contacts2: retDataObservable2,
            getContacts: promise,
            currentContact:retDataObservable3

        };


        return model

    }());

    // Contacts view model
    var contactsViewModel = (function () {

        // this is a right ball ache!!
        // the split view requires 2 data source objects to allow for a master-detail scenario.
        // i hope it's my lack of understanding of the framework :)
        var leftPaneDataObservable = new kendo.observable({data: {"items": []}});
        var rightPaneDataObservable = new kendo.observable({data: {"items": []}});

        var leftPanelDataSource = new kendo.data.DataSource({
            data: leftPaneDataObservable.data.items,
            schema: {
                type: "json"
            },
            sort: { field: "firstName", dir: "asc" } // sort by first name for now
        });

        var rightPanelDataSource = new kendo.data.DataSource({
            data: rightPaneDataObservable.data.items,
            schema: {
                type: "json"
            }
        });

        function getContacts(){
            // todo: initiate the app loader.
            // app.mobileApp.Loader .... ???
            contactsModel.getContacts()
                .done(function (data, status) { // success

                    console.log('GETDATA() SUCCESS!!!');
//                    console.log('GETDATA() SUCCESS DATA:', data);
//                    console.log('GETDATA() SUCCESS DATA JSON:', JSON.stringify(data));
//                    console.log('GETDATA() SUCCESS STATUS:', status);

                    // flatted the data by mapping from the contentful schema to the app schema.
                    var mappedData = map.toContacts(data);

                    // Now set the returned data to the contacts data property.
                    // note to self: can the kendo.data.DataSource be set in the same way?
                    contactsModel.contacts.set("data", mappedData);
                    contactsModel.contacts2.set("data", mappedData);

                    leftPanelDataSource.read(); // must read to load the data set...
                    rightPanelDataSource.read(); // must read to load the data set...

                    // load both data sources with the mapped data
                    _.forEach(mappedData.items, function (item) {

                        leftPanelDataSource.add({firstName:item.firstName, lastName:item.lastName, image:item.image}); // note, you can't add a record if the data is not observable

                        rightPanelDataSource.add({
                            firstName:item.firstName,
                            lastName:item.lastName,
                            practice:item.practice,
                            office:item.office,
                            email:item.email,
                            telephone:item.telephone,
                            image:item.image}); // note, you can't add a record if the data is not observable

                    });

                })
                .fail(function (xhr, status) { // error

                    console.log('GETDATA() ERROR!!!');
//                    console.log('GETDATA() XHR:', xhr);
//                    console.log('GETDATA() STATUS:', status);

                    // todo: if we encounter an error, attempt to read from cache.
                    // at this point we don't really care what the cache is, whether file based or web storage.

                })
                .always(function (data, status) { // complete

                    console.log('GETDATA() COMPLETE!!!');
//                    console.log('GETDATA() COMPLETE DATA:', data);
//                    console.log('GETDATA() COMPLETE STATUS:', status);

                    // todo: close the app.loader as we have a response.

                });
        }

        var init = function () {

            getContacts();

        };

        var reload = function (e) {

//            var leftPanelCounter = leftPanelDataSource.total();
//            var rightPanelCounter = rightPanelDataSource.total();
//
//            for (var i = 0; i < leftPanelCounter; i++) {
//
//                var leftDataItem = leftPanelDataSource.at(0);
//
//                leftPanelDataSource.remove(leftDataItem);
//
//            }
//
//            for (var i = 0; i < rightPanelCounter; i++) {
//
//                var rightDataItem = rightPanelDataSource.at(0);
//
//                leftPanelDataSource.remove(rightDataItem);
//
//            }
//
//            getContacts();

//            console.log(e); // todo: delete me
//
//            console.log("reloading..."); // todo: delete me
//            location.reload(true);
        };

        // Navigate to appropriate view when contact is selected
        var selectContact = function (e) {

            console.log("selectContact called with following event", e);

            // navigate pane to correct view
            var pane = $("#selectedContactPane").data("kendoMobilePane");
            pane.navigate("#selectedContactView");

            // todo: try and bind the event data (e.data) to a widget.
             rightPanelDataSource.filter({field:"firstName",
            operator:"eq", value: e.data.firstName});



//            kendo.bind($("#selectedContactView"), viewModel.currentContact);

        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };


        // todo: add selectedContact property for the currently
        return {
            init: init,
            seed: contactsModel,
            contacts: contactsModel.contacts,
            contacts2: contactsModel.contacts2,
            contacts4: leftPanelDataSource,
            contacts5: rightPanelDataSource,
            selectContact: selectContact,
//            currentContact:{firstname:"Mike"},
            reload:reload
//            currentContact:contactsModel.currentContact
        };

    }());

    return contactsViewModel;


}());


