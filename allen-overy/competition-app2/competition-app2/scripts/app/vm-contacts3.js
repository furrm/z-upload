
/**
 * Contacts3 view model
 */

var app = app || {};

app.Contacts3 = (function () {
    'use strict'



    // Activities model
    var contacts3Model = (function () {

        var retData;


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
        }

        getData()
            .done(function (data, status) { // success

                console.log('GETDATA() SUCCESS!!!');
                console.log('GETDATA() SUCCESS DATA:', data);
                console.log('GETDATA() SUCCESS STATUS:', status);

                retData = data;
//                retData = contactsDataMapper(data);


                console.log('retData', retData);

            })
            .fail(function (xhr, status) { // error

                console.log('GETDATA() ERROR!!!');
                console.log('GETDATA() XHR:', xhr);
                console.log('GETDATA() STATUS:', status);

            })
            .always(function (data, status) { // complete

                console.log('GETDATA() COMPLETE!!!');
                console.log('GETDATA() COMPLETE DATA:', data);
                console.log('GETDATA() COMPLETE STATUS:', status);

            });

        var fetchedData = null;


//         retData = {
//            "sys":{
//                id:"123"
//            },
//            "items":[
//                {
//                    "id": "6srrXCJ6qkAk6A2eqCgWc8",
//                    "firstName": "Pamela",
//                    "lastName": "Chepiga",
//                    "telephone": "+44 203 088 4262",
//                    "email": "mike.furr@allenovery.com",
//                    "practice": "Business Services",
//                    "image": {
//                        "id": "4a2KKIkzpe804YWy2YOoMM",
//                        "title": "Pamela Chapiga",
//                        "url": "//images.contentful.com/zpp0viuq4x1e/4a2KKIkzpe804YWy2YOoMM/88364fe0fbd155d8d07cd5c5041e1eb7/PublishingRollupImage_pamela.chepiga.jpg"
//                    },
//                    "office": {
//                        "id": "6MK8OU0JNYsQkskuKoyWIU",
//                        "title": "New York"
//                    }
//                },
//                {
//                    "id": "5XDbRn2xlCWQM8gMQKkScG",
//                    "firstName": "Thomas",
//                    "lastName": "Abbondante",
//                    "telephone": "+44 203 088 4262",
//                    "email": "mike.furr@allenovery.com",
//                    "image": {
//                        "id": "7bO8OyZWRUGO2kQ8oeyqay",
//                        "title": "Thomas Abbondante",
//                        "url": "//images.contentful.com/zpp0viuq4x1e/7bO8OyZWRUGO2kQ8oeyqay/fc7e84f0fb8dcd078cc42f682bf2ac5a/PublishingRollupImage_thomas.abbondante.jpg"
//                    },
//                    "office": {
//                        "id": "6MK8OU0JNYsQkskuKoyWIU",
//                        "title": "New York"
//                    }
//                }
//        ]
//        };

        var ds = new kendo.data.DataSource({
            data: retData,
            schema: {
                data: "items",
                type: "json"
//                model:{title:"title"}
            }
        });

//        ds.fetch(function(){ // fetch callback
//            fetchedData = ds.data();
//            console.log('FETCHED DATA', fetchedData);
//
//        });


        var model = {
            message: 'This is a message from the view model',
            contacts: ds

        };

        return model

    }());

    // Contacts3 view model
    var contacts3ViewModel = (function () {

        console.log('define contacts3ViewModel');

//        var init = function () {
//            console.log('seed init Hit!');
//        };

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {
            console.log("activitySelected");

            app.mobileApp.navigate('views/vw-checklist-questions.html');
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };


        return {
//            init:init(),
            seed: contacts3Model,
            contacts: contacts3Model.contacts,
            activitySelected: activitySelected
        };

    }());

    return contacts3ViewModel;


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


