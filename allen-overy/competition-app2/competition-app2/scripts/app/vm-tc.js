/**
 * TC view model
 * Dependencies:
 * scripts/app/contentful.js
 * scripts/app/mapper.js
 */
'use strict'

var app = app || {};

app.TC = (function () {

    var tcModel = (function () {

        var dataObservable = new kendo.observable({data: {"items": [
            {"id": "ididi",
                "bodyText": "Yo!",
                "bodyParsed": "Hello There"},
            {"id": "ididi",
                "bodyText": "Yo!",
                "bodyParsed": "Hello There"}
        ]}});

        var dataSource = new kendo.data.DataSource({
//            data: dataObservable.data.items,
            data: {"items": [
//                {"id": "ididi",
//                    "bodyText": "Yo!",
//                    "bodyParsed": "Hello There"},
//                {"id": "ididi",
//                    "bodyText": "Yo!",
//                    "bodyParsed": "Hello There"}
            ]},
            schema: {
                data: "items",
                type: "json"
            }
        });

        // must read to load the data set...
        dataSource.read();

        var model = new kendo.data.ObservableObject({
            "title": "Terms & Conditions",
            "sections": dataSource
        });

        return model

    }());

    // TC view model
    var tcViewModel = (function () {

        // view model init
        var init = function (e) {

            var pageId =  e.view.params.uid;

            // todo; the key really should be at a global level.
            // define the auth key for contentful
            contentful.authorisationKey = '31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60';

            // the object that will eventually become the querystring for the call to contentful
            var query = {
//                "content_type": "4sXD3yB2A8UgwG6Q8meY0K",
                "sys.id": pageId
            };


        toastr.info('Getting Data');
//        //start local data call
//        contentful.contentDeliveryUrl =  'data/tnc-page.json'; // override the url
//        contentful.getData()
//        //end local data call

            contentful.getData("zpp0viuq4x1e", 'entries', undefined, query)
                .done(function (data, status, xhr) { // SUCCESS

                    // todo: detect status 200
                    // if 200, then check force read of T's and C's
                    // if forceRead === true then rediret user to T's and C's view.
                    // if 200, store etag somewhere
                    // ensure that any further requests

                    // todo: detect status 304
                    // if 304, read from cache as there will be no body to the response from the server

//                    toastr.success('Data Received :)');
                    // start loading up the data source object
                    // first map the data
                    var termsAndConditions = map.toTandC(data);

                    tcModel.set("title", termsAndConditions.items[0].title);

                    // add the mapped data to the data source object
                    _.forEach(termsAndConditions.items[0].sections, function (section) {

                        // note, you can't add a record if the data source data property is not observable
//                        dataSource.add({
                        tcModel.sections.add({
                            id: section.id,
                            bodyText: section.bodyText,
                            bodyParsed: section.bodyParsed
                        });

                    });

                })
                .fail(function (xhr, status) { // FAILURE

                    console.log("FAIL XHR", xhr); // todo: delete me
                    console.log("FAIL STATUS", status); // todo: delete me

                    toastr.error("Failed to get data!!");
                    toastr.error(status);
                    toastr.error(xhr.error);

                })
                .always(function (data, status, xhr) { // COMPLETE
                    console.log("ALWAYS XHR", xhr); // todo: delete me
                    console.log("ALWAYS STATUS", status); // todo: delete me
                    toastr.info('Data Processing Complete');

            });


        };

        var accept = function () {

            // write flag to cache
            caching.writePermanentCache('accepted', 1);

            // todo: redirect to tiles page.
            console.log('accept clicked!!'); // todo: delete me
        };

        var decline = function () {
            // todo: close the app.
            console.log('decline clicked!!'); // todo: delete me
        };

        return {
            model: tcModel,
//            data: dataSource,
//            json: JSON.stringify(tcModel.sections.data()),
            init: init,
            accept: accept,
            decline: decline
        };

    }());

    return tcViewModel;

}());
