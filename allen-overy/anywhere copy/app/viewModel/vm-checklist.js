/**
 * Tiles view model
 */

var app = app || {};

app.Checklist = (function () {
    'use strict'


    // Tiles view model
    var checklistViewModel = (function () {

        var url = appSettings.contentful.url + '/' + appSettings.contentful.space + '/entries';

        var contentType = appSettings.contentful.contentTypes.checklist;

        var searchParam = {
            "content_type": contentType
//            "include": "1"
        }

        var cachedData = null;



        function getAsset(assetId) {

            var includes = JSON.parse(cachedData).includes;


            // find the asset
            var foundAsset = _.find(includes.Asset, function(asset) {

                if(asset.sys.id === assetId)
                {
                    return asset;
                }

//                return asset.sys.id === assetId;

            });

            return foundAsset;
//            return assetId;
        }

        function getEntry(entryId) {

            var includes = JSON.parse(cachedData).includes;

            // find the entry
            var foundEntry = _.find(includes.Entry, function (entry) {

                return entry.sys.id === entryId;

            });

            return foundEntry;
        }

        function itemChecker(itemId, flag){

            _.forEach(checklistQuestionsDataSource.data(), function(item){

                if(item.sys.id === itemId){
//                    console.log("CHECK ITEM - ITEM FOUND", item); // todo: delete me
                    item.fields.checked = flag;
                }

            });



        }

        function cacheCheckedItem(itemId, flag){


            var cacheObj = JSON.parse(localStorage.getItem(contentType));

            _.forEach(cacheObj.items, function (item) {

                if (item.sys.id === itemId) {
                    item.fields.checked = flag;
                }

            });

            localStorage.removeItem(contentType);
            localStorage.setItem(contentType, JSON.stringify(cacheObj));

        }

        function selectItem(uid){

            // navigate pane to correct view
            var pane = $("#selectedChecklistPane").data("kendoMobilePane");
            pane.navigate("#selectedChecklistView");

            // information on the web suggests that you need 2 datasource objects for a split view widget
            // this is to prevent the filter filtering all data on the ui.
            // todo: try and bind the event data (e.data) to a widget.
            // todo: can we use and observable var rightPaneDataObservable = new kendo.observable({data: {"items": []}});

            checklistAnswersDataSource.filter({field: "uid", operator: "eq", value: uid});
        }

        function onChange() {

            console.log("CHECKLIST - ONCHANGE CALLED"); // todo: delete me

            checklistAnswersDataSource.data(checklistQuestionsDataSource.data());

            console.log("CHECKLIST - ONCHANGE - checklistQuestionsDataSource", checklistQuestionsDataSource.data()); // todo: delete me
            console.log("CHECKLIST - ONCHANGE - checklistAnswersDataSource", checklistAnswersDataSource.data()); // todo: delete me

        }





        // Data Read
        var cachedRead = function (operation) {
            
            console.log("ATTEMPTING TO READ FROM CACHE"); // todo: delete me

            cachedData = localStorage.getItem(contentType);

            if (cachedData != null || cachedData != undefined) {

                console.log("CHECKLIST - HAVE CACHE"); // todo: delete me

                operation.success(JSON.parse(cachedData));

                cachedData = null;

            } else {
                console.log("CHECKLIST - NO CACHE CALLING CONTENTFUL"); // todo: delete me

                $.ajax({
                url: url,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', appSettings.contentful.apiKey),
                        xhr.setRequestHeader('Content-Type', appSettings.contentful.contentType)
                },
                dataType: "json",
                data: searchParam,
                // cache : false,
                success: function (response) {



                    console.log("SUCCESS"); // todo: delete me

                    console.log('Writing ' + contentType + ' to cache');

                    console.log("RESPONSE BEFORE:",response); // todo: delete me



                    // important: question data from contentful is extended to have an additional field called checked.
                    _.forEach(response.items, function(item){

//                        console.log("QUESTION ITEM:", item); // todo: delete me
                        _.extend(item.fields, {"checked":false});

                    });

                    console.log("RESPONSE AFTER:",response); // todo: delete me


                    // cache the response
                    localStorage.setItem(contentType, JSON.stringify(response));



                    operation.success(response);
                }
            });
            }
        }



        // split view widgets that display master/detail information require 2 data source objects =(
        var checklistQuestionsDataSource = new kendo.data.DataSource({
            transport: {
                read: cachedRead
            },
            schema: {
                data: "items",
                group: { field: 'office', dir: 'desc'},
                type: "json"
            },
            change: onChange
        });


        var checklistAnswersDataSource = new kendo.data.DataSource({
            schema: {
                data: "items",
                type: "json",
                model: {
                    getDisplayName: function () {
                        return this.get("fields.lastName") + ", " + this.get("fields.firstName");
                    },
                    getPhoto: function () {
                        // photo resides in the includes section of the json returned from contentful
                        // given that this data source object is bound to the items section, we need to refer to the cached data to get the information we need

                        // todo: build in error handling

                        // find asset by id
                        var photoId, photoAsset

                        photoId = this.get('fields.image.sys.id');


                        photoAsset = getAsset(photoId);

//                        return "http:" + photoAsset.fields.file.url + "?w=200";
                        return "background-image: url(http:" + photoAsset.fields.file.url + "?w=200);";

                    },
                    getOffice:function(){

                        // todo: build in error handling

                        var officeId, officeEntry

                        officeId =  this.get('fields.office.sys.id');
                        officeEntry = getEntry(officeId);

                        console.log("OFFICEID:", officeId); // todo: delete me

                        return officeEntry.fields.name;
                    },
                    getEmailLink:function(){
                        // todo: put the following link info into the settings file
                        return "mailto:" + this.get('fields.email') + "?Subject=Competition App"
                    },
                    getTelLink:function(){
                        return "tel:" + this.get('fields.telephone');
                    },
                    parseAnswer: function(){
                        return marked.parse(this.get("fields.answer"));
                    }

                }
            }
        });





        var check = function (e) {

//            console.log("QUESTION DO CHECK:", e); // todo: delete me
//            console.log("QUESTION DO CHECK:", e.data.fields.checked); // todo: delete me

            // check or un-check
            if(e.data.fields.checked){

                console.log("QUESTION DO UNCHECK"); // todo: delete me

                itemChecker(e.data.sys.id, false);

                cacheCheckedItem(e.data.sys.id, false);

            } else {
                console.log("QUESTION DO CHECK"); // todo: delete me

                itemChecker(e.data.sys.id, true);
                cacheCheckedItem(e.data.sys.id, true);

            }


            checklistQuestionsDataSource.fetch(function(){
                selectItem(e.data.uid);
            });



        };

        var selectQuestion = function (e) {

            console.log("QUESTION SELECTED:", e); // todo: delete me
            console.log("QUESTION SELECTED:", e.data.uid); // todo: delete me

            selectItem(e.data.uid);

//            console.log("QUESTION SELECTED:", e); // todo: delete me
//            console.log("QUESTION SELECTED:", e.data.uid); // todo: delete me
//
//            // navigate pane to correct view
//            var pane = $("#selectedChecklistPane").data("kendoMobilePane");
//            pane.navigate("#selectedChecklistView");
//
//            // information on the web suggests that you need 2 datasource objects for a split view widget
//            // this is to prevent the filter filtering all data on the ui.
//            // todo: try and bind the event data (e.data) to a widget.
//            // todo: can we use and observable var rightPaneDataObservable = new kendo.observable({data: {"items": []}});
//
//            checklistAnswersDataSource.filter({field: "uid", operator: "eq", value: e.data.uid});


        };

        var refresh = function () {
            console.log("CHECKLIST - REFRESH");

            localStorage.removeItem(contentType);

            checklistQuestionsDataSource.refresh();

        };

        var show = function () {

            console.log("CHECKLIST - SHOW"); // todo: delete me


        };

        var init = function () {

            console.log("CHECKLIST - INIT"); // todo: delete me

        };


        return {

            checklistQuestions: checklistQuestionsDataSource,
            checklistAnswer: checklistAnswersDataSource,
            selectQuestion: selectQuestion,
            show: show,
            init: init,
            check:check,
            refresh: refresh

        };

    }());

    return checklistViewModel;

}());
