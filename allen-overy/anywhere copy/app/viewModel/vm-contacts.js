/**
 * Tiles view model
 */

var app = app || {};

app.Contacts = (function () {
    'use strict'


    // Tiles view model
    var contactsViewModel = (function () {

        var isPullToRefresh = false;

        // todo: remove the hard coded pageId to read from the querystring.
//        var pageId = "";
        var pageId = "1uN0eJlO52eUg64uaokuEU";

        var url = appSettings.contentful.url + '/' + appSettings.contentful.space + '/entries';

        var cachedData = null;


        function onChange() {

            console.log("CONTACTS - ONCHANGE CALLED"); // todo: delete me

            contactDetailsDataSource.data(contactsListDataSource.data());


        }

        var searchParam = {
            "sys.id": pageId,
            "include": "2"
        };

        var getData = function(){

        };

        // the following operation gets called by the contactsListDataSource object.
        var cachedRead = function (operation) {

            cachedData = localStorage.getItem(pageId);
            
            
            if (cachedData != null || cachedData != undefined) {

                console.log("CONTACTS - READING FROM CACHE"); // todo: delete me
//                console.log('Reading ' + contentType + ' from cache');

                operation.success(JSON.parse(cachedData));

            } else {
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

                        console.log('Writing ' + pageId + ' to cache');

                        // todo: refactor to use the resource object
                        resource.writeLocal(pageId, JSON.stringify(response))

                        operation.success(response);
                    }
                });
            }
        };

        // split view widgets that display master/detail information require 2 data source objects =(
        var contactsListDataSource = new kendo.data.DataSource({
            transport: {
                read: cachedRead
            },
            schema: {
                parse: function(response){
                
                    
                    console.log("Parse the response."); // todo: delete me
                    
                    var schema = {"contacts":{}};

                    // pull out contact entries.
                    var mappedContacts = _.map(response.includes.Entry, function(entry){

                        // a contact can be identified by having an office field
                        // todo: speak to chris regarding using contentTypes
                        if(_.isObject(entry.fields.office)){
                            return entry;

                        }

                    });

                    // remove undefined array values otherwise the bindings to the dom will break
                    var contacts = _.without(mappedContacts, undefined);

                    // roll up the office entity and image asset for each contact object
                    _.forEach(contacts, function(contact){

                        // find the office by office id
                        var foundOffice = _.find(response.includes.Entry, function (entry) {

                            return entry.sys.id === contact.fields.office.sys.id;

                        });

                        // find the image
                        var foundImage = _.find(response.includes.Asset, function (asset) {

                            return asset.sys.id === contact.fields.image.sys.id;

                        });

//                        console.log("Found Image", foundImage); // todo: delete me

                        // Assign the office
                        contact.fields.office = foundOffice;

                        // Assign the image
                        contact.fields.image = foundImage;

                    });


                    console.log("CONTACTS",contacts); // todo: delete me

                    return contacts;

                },
                data:"",
                type: "json"
            },
            sort: { field: "fields.lastName", dir: "asc" },
            requestEnd: function() {

                console.log("REQUEST ENDED - contactsListDataSource"); // todo: delete me
                contactDetailsDataSource.data(contactsListDataSource.data());

            },
            change: onChange
        });

        var contactDetailsDataSource = new kendo.data.DataSource({
            schema: {
                data: "",
                type: "json"
            },
            sort: { field: "fields.lastName", dir: "asc" },
            requestEnd: function() {

                console.log("REQUEST ENDED - contactDetailsDataSource"); // todo: delete me
                contactDetailsDataSource.data(contactsListDataSource.data());


            }

        });




        var selectContact = function (e) {

            console.log("CONTACT SELECTED:", e); // todo: delete me
            console.log("CONTACT SELECTED:", e.data.uid); // todo: delete me

            console.log("selectContact() -contactDetailsDataSource", contactDetailsDataSource.data() ); // todo: delete me

            contactDetailsDataSource.filter({field: "uid", operator: "eq", value: e.data.uid});

            contactDetailsDataSource.refresh();

        };


        var show = function (e) {

            console.log("CONTACTS - SHOW"); // todo: delete me

            pageId = e.view.params.uid;

            console.log("PAGEID", pageId); // todo: delete me



        };

        var init = function () {



            console.log("CONTACTS - INIT"); // todo: delete me

//            // Why can't I do this using declarative initilalization??
            $("#contactsListViewer").kendoMobileListView({
//                dataSource: contactsListDataSource,
                pullToRefresh: true,
                appendOnRefresh: false,
                template: $("#contactsTemplate").text(),
                pullParameters: function (item) {
                    console.log("YOU PULLED ME SIR?"); // todo: delete me

                    // on pull to refresh, remove the data from the cache and do a fetch
                    resource.removeLocal(pageId);

                    return { pull: true }
                }
            })

        };





        return {

            contacts: contactsListDataSource,
            contactDetails: contactDetailsDataSource,
            selectContact: selectContact,
            show: show,
            init: init,
            pullParam:function(){
                console.log("YOU PULLING ME"); // todo: delete me
            }
        };

    }());

    return contactsViewModel;

}());


app.ContactsList = (function () {
    'use strict'


    // Tiles view model
    var contactsListViewModel = (function () {



//        return {
//            contactsList:contactsListDataSource
//        };

    }());

    return contactsListViewModel;

}());
