/**
 * Contacts5 view model
 */

var app = app || {};

app.ContactsHarness = (function () {
    'use strict'


    // Contacts model
    var contacts5Model = (function () {

        var retData;

        var retDataObservable = new kendo.observable({data: {"items": []}});
        var retDataObservable2 = new kendo.observable({data: {"items": []}});

        console.log('retDataObservable', retDataObservable);
        console.log('retDataObservable2', retDataObservable2);


        var promise = function getData() {

            var space = "zpp0viuq4x1e";
            var contentType = "4ygwXLGXPWWuWcQGiSeyGa";
            var authorisation = "Bearer 31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60";

//        var url = "https://cdn.contentful.com/spaces/" + space + "/entries";
            var url = 'data/contacts.json';
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
            contacts3: (function () {
                var ds = new kendo.data.DataSource({
                    data: [
                    {"firstName": "Mike"}
                ]

//                    data:{items:[]},
//                schema:{
//                    data:"items",
//                    type: "json"
//                }
                });
//                ds.read();
                return ds;
            })(),
            getContacts: promise

        };


        return model

    }());

    // ContactsHarness view model
    var contacts5ViewModel = (function () {

        console.log('define contacts5ViewModel');

        var retDataObservable3 = new kendo.observable({
            data: {"items": [{firstName:"Michael"}]}
        });

        var ds4 = new kendo.data.DataSource({
//            data: {"items": [{firstName:"Michael"}]},
            data: retDataObservable3.data,
//            data: (function(){return retDataObservable3.data})(),
            schema: {
                data: "items",
                type: "json"
            }
            ,
            sort: { field: "firstName", dir: "asc" }
        });

        var init = function () {
//            var promise = contacts5Model.getContacts();

//            var vm = this;

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

                    ds4.read(); // must read to load the data...

                    ds4.add({firstName:"Fiona"}); // note, you can't add a record if the data is not observable


                    ds4.read();

                    console.log('TEST', ds4.data());
                    console.log('TESTJSON', JSON.stringify(ds4.data().toJSON()));




                    console.log('CONTACTS', contacts5Model.contacts);
                    console.log('CONTACTS2', contacts5Model.contacts2);
                    console.log('CONTACTS4', contacts5Model.contacts3);
                    console.log('CONTACTS4JSON', contacts5Model.contacts3.data().toJSON());

//                    ds4.data().set("data",mappedData);




                })
                .fail(function (xhr, status) { // error

                    console.log('GETDATA() ERROR!!!');
                    console.log('GETDATA() XHR:', xhr);
                    console.log('GETDATA() STATUS:', status);

                    // todo: if we encounter an error, attempt to read from cache.
                    // at this point we don't really care what the cache is.

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

            // todo: navigate to view
//            app.mobileApp.navigate('views/vw-checklist-questions.html');

            // todo: set the selected contact to the currentContact property

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
            contacts3: contacts5Model.contacts3,
            contacts4: ds4,
            selectContact: selectContact,
            currentContact:null
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


