/**
 * Tiles view model
 */

var app = app || {};

app.Contacts = (function () {
    'use strict'


    // Tiles view model
    var contactsViewModel = (function () {


        //todo: my feeling is that the data setup and calls need to be in the init event.  this may stop calls to contentful

        var url = appSettings.contentful.url + '/' + appSettings.contentful.space + '/entries';

        var contentType = appSettings.contentful.contentTypes.contacts;
        var cachedData = null;


        function onChange() {

            console.log("CONTACTS - ONCHANGE CALLED"); // todo: delete me

            contactDetailsDataSource.data(contactsListDataSource.data());

//            console.log("CONTACTS - contactDetailsDataSource", contactDetailsDataSource.data()); // todo: delete me

//            var includes = contactDetailsDataSource.data().includes;

//            console.log("CONTACTS - contactDetailsDataSource", JSON.stringify(contactDetailsDataSource.data())); // todo: delete me
        }

        var searchParam = {
            "content_type": contentType,
            "include": "1"
        }

        var cachedRead = function (operation) {

            cachedData = localStorage.getItem(contentType);

//            if (cachedData != null || cachedData != undefined) {
//
//                console.log("CONTACTS - READING FROM CACHE"); // todo: delete me
////                console.log('Reading ' + contentType + ' from cache');
//
//                operation.success(JSON.parse(cachedData));
//
//            } else {
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

                    cachedData = JSON.stringify(response);
                    
                    console.log(cachedData); // todo: delete me

                    localStorage.setItem(contentType, JSON.stringify(response));
                    operation.success(response);
                }
            });
//            }
        }

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

        // split view widgets that display master/detail information require 2 data source objects =(
        var contactsListDataSource = new kendo.data.DataSource({
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


        var contactDetailsDataSource = new kendo.data.DataSource({
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
                    getMobileLink:function(){
                        return "tel:" + this.get('fields.mobile');
                    }

                }
            }
        });


        //region UI Actions
        var selectContact = function (e) {

            console.log("CONTACT SELECTED:", e); // todo: delete me
            console.log("CONTACT SELECTED:", e.data.uid); // todo: delete me

            // navigate pane to correct view
            var pane = $("#selectedContactPane03").data("kendoMobilePane");
            pane.navigate("#selectedContactView");

            // information on the web suggests that you need 2 datasource objects for a split view widget
            // this is to prevent the filter filtering all data on the ui.
            // todo: try and bind the event data (e.data) to a widget.
            // todo: can we use and observable var rightPaneDataObservable = new kendo.observable({data: {"items": []}});

            contactDetailsDataSource.filter({field: "uid", operator: "eq", value: e.data.uid});


        };
        //endregion


//        var refresh = function (e) {
//            console.log("CONTACTS - REFRESH"); // todo: delete me
//            //contactsModel.refresh();
//        };

        var refresh = function () {
            console.log("CONTACTS - REFRESH");

            localStorage.removeItem(contentType);

            contactsListDataSource.refresh();

        };

        var show = function () {

            console.log("CONTACTS - SHOW"); // todo: delete me

//            $("#contactsListViewer").kendoMobileListView({
//                pullParameters: function(item) {
//                    console.log("PULLED"); // todo: delete me
//                }
//            });

        };

        var init = function () {

            console.log("CONTACTS - INIT"); // todo: delete me

        };


        return {

//            contacts: contactsModel.contacts,
            contacts: contactsListDataSource,
            contactDetails: contactDetailsDataSource,
            selectContact: selectContact,
            show: show,
            init: init,
            refresh: refresh,
            testPullParams:function(){
                console.log("You've pulled!!"); // todo: delete me
            }

        };

    }());

    return contactsViewModel;

}());
