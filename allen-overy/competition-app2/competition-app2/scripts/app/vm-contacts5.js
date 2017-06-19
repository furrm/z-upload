/**
 * Contacts5 view model
 */

var app = app || {};

app.Contacts5 = (function () {
    'use strict'


    // Contacts model
    var contacts5Model = (function () {

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

    // Contacts5 view model
    var contacts5ViewModel = (function () {

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

        var init = function () {


            // todo: initiate the app loader.
            // app.mobileApp.Loader .... ???
            contacts5Model.getContacts()
                .done(function (data, status) { // success

                    console.log('GETDATA() SUCCESS!!!');
                    console.log('GETDATA() SUCCESS DATA:', data);
                    console.log('GETDATA() SUCCESS DATA JSON:', JSON.stringify(data));
                    console.log('GETDATA() SUCCESS STATUS:', status);

                    // flatted the data by mapping from the contentful schema to the app schema.
                    var mappedData = contactsDataMapper(data);

                    // Now set the returned data to the contacts data property.
                    // note to self: can the kendo.data.DataSource be set in the same way?
                    contacts5Model.contacts.set("data", mappedData);
                    contacts5Model.contacts2.set("data", mappedData);

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
                    console.log('GETDATA() XHR:', xhr);
                    console.log('GETDATA() STATUS:', status);

                    // todo: if we encounter an error, attempt to read from cache.
                    // at this point we don't really care what the cache is, whether file based or web storage.

                })
                .always(function (data, status) { // complete

                    console.log('GETDATA() COMPLETE!!!');
                    console.log('GETDATA() COMPLETE DATA:', data);
                    console.log('GETDATA() COMPLETE STATUS:', status);

                    // todo: close the app.loader as we have a response.

                });


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
            seed: contacts5Model,
            contacts: contacts5Model.contacts,
            contacts2: contacts5Model.contacts2,
            contacts4: leftPanelDataSource,
            contacts5: rightPanelDataSource,
            selectContact: selectContact,
            currentContact:{firstname:"Mike"}
//            currentContact:contacts5Model.currentContact
        };

    }());

    return contacts5ViewModel;


    function contactsDataMapper(contentfulData) {

        // NOTE: The following script requires knowledge of Lo-Dash.
        // Lo-Dash is a competitor of Underscore, and is far quicker.
        // All objects that are referenced as _.{function} is a Lo-Dash function.

        // the mapped data to return
        var mappedData = {};

        // Process the root data first
        // assign the root properties.
        _.assign(mappedData, {sys: contentfulData.sys});
        _.assign(mappedData, {total: contentfulData.total});
        _.assign(mappedData, {skip: contentfulData.skip});
        _.assign(mappedData, {limit: contentfulData.limit});
        // TODO: split out the above to a mapHeader function


        var items = contentfulData.items; // contentful item array
        var includes = contentfulData.includes; // contentful related assets and entries

        // now map the contentful item collection
        var newItems = _.map(contentfulData.items, function (item) { // callback

            // map the properties
            var mappedItem = {
                id: item.sys.id,
                firstName: item.fields.firstName,
                lastName: item.fields.lastName,
                telephone: item.fields.telephone,
                email: item.fields.email,
                practice: item.fields.practice
            }

            // map the known related assets
            // image
            if (typeof item.fields.image != 'undefined') {

                // add the image to the mapped item.
                _.assign(mappedItem, {"image": getAsset(item.fields.image.sys.id)});

            }


            // map the known related entries
            // office
            if (typeof item.fields.office != 'undefined') {
                _.assign(mappedItem, {"office": getEntry(item.fields.office.sys.id)});
            }

            return mappedItem;

        });


        _.assign(mappedData, {items: newItems});

        console.log('NEW DATA', mappedData);
        console.log('NEW DATA STRINGIFY', JSON.stringify(mappedData));

        function getAsset(assetId) {

            // find the asset
            var foundAsset = _.find(includes.Asset, function (asset) {

                return asset.sys.id === assetId;

            });

            console.log('GETASSET foundAsset:', foundAsset);

            // TODO: Think about returning the found object as-is
            return {
                id: assetId,
                title: foundAsset.fields.title,
                url: foundAsset.fields.file.url
            };

        }

        function getEntry(entryId) {

            console.log('GETENTRY entryId:', entryId);

            // find the entry
            var foundEntry = _.find(includes.Entry, function (entry) {

                return entry.sys.id === entryId;

            });

            console.log('GETENTRY foundEntry:', foundEntry);


            return {
                id: entryId,
                title: foundEntry.fields.name
            };
        }

        return mappedData;

    };


}());


