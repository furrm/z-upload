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

        var dataObservable = new kendo.observable({data: {"items": []}});

        var dataSource = new kendo.data.DataSource({
            data: {"items": []},
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

            console.log("Initialize Terms and Conditions");

            var pageId =  e.view.params.uid;

            // the terms and conditions data is populated by the tiles view model
            // the data is available in the cache

            // get the data
            var data = JSON.parse(resource.readLocal(pageId));


            // map the contentful data to the terms and conditions data set
            var termsAndConditions = map.toTandC(data);


            tcModel.set("title", termsAndConditions.items[0].title);

            // add the mapped data to the data source object
            _.forEach(termsAndConditions.items[0].sections, function (section) {

                // note, you can't add a record if the data source data property is not observable
                tcModel.sections.add({
                    id: section.id,
                    bodyText: section.bodyText,
                    bodyParsed: section.bodyParsed
                });

            });

        };

        var show = function (e){
            console.log("Show Terms and Conditions");

        }

        var accept = function () {

            var hasReadKey = appSettings.termsAndConditions.haveReadKey;

            // write flag to cache
            resource.writeLocal(hasReadKey, 1);

            // redirect back to the tile page
//            app.mobileApp.navigate("#:back");
            app.mobileApp.navigate('#view-all-tiles');

        };

        var decline = function () {
            var hasReadKey = appSettings.termsAndConditions.haveReadKey;

            // write flag to cache
            resource.writeLocal(hasReadKey, 0);


            app.exitApp();

        };

        return {
            model: tcModel,
            init: init,
            accept: accept,
            decline: decline
        };

    }());

    return tcViewModel;

}());