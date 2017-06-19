/**
 * Seed view model
 */

var app = app || {};

app.Contacts = (function () {
    'use strict'



    // contacts model
    var contactsModel = (function () {

        console.log('define contactsModel');

        var space = "zpp0viuq4x1e";
        var contentType = "4ygwXLGXPWWuWcQGiSeyGa";
        var authorisation = "Bearer 31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60";

            var url = "https://cdn.contentful.com/spaces/" + space + "/entries";
        //    var url = "http://badurl.com/spaces/" + space + "/entries";
//        var url = 'data/contacts.json';

        var query = {
            content_type: '4ygwXLGXPWWuWcQGiSeyGa'
        };

        var contactDS3 = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    // JQuery Ajax
                    $.ajax({
                        url: url,
                        dataType: "json",
                        data: {
                            content_type: contentType,
                            include: 1
                        },
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', authorisation),
                                xhr.setRequestHeader('Content-Type', 'application/json')
                        },
                        success: function (result) {

                            // DEBUGGING
                            console.log('AJAX SUCCESS RESULT:', JSON.stringify(result));
                            console.log('AJAX SUCCESS RESULT:', result);

                            // TODO: Read/Write to/form the localStore.
                            // http://stackoverflow.com/questions/12980444/caching-a-kendo-ui-datasource-object-using-localstorage


                            // write the result to the browsers local store.
                            // TODO: Check to see whether HTML5 Web Storage is supported
                            writePermanentCache('contacts', JSON.stringify(result));

                            var ret = contactsDataMapper(result);

                            // notify the data source that the request succeeded
                            options.success(ret);


                        },
                        error: function (result) {
                            // DEBUGGING
                            console.log('AJAX ERROR RESULT:', result);
                            console.log('AJAX ERROR OPTIONS', options);

                            // TODO: notify user that the request has failed
                            // TODO: read from cache in event of failure, if available
                            // TODO: notify user that they are seeing cached data

                            // read from the cache
                            var cachedDataStr = readPermanentCache('contacts');

                            // DEBUGGING
                            console.log('AJAX ERROR cachedDataStr', cachedDataStr);

                            // convert the JSON string into an object
                            var cachedDataObj = JSON.parse(cachedDataStr);

                            // DEBUGGING
                            console.log('AJAX ERROR cachedDataObj', cachedDataObj);


                            // given that the cache is storing the data in the Contentful format, the data needs to be flattened.
                            // TODO: decide whether we cache the contentful data or the flattened data
                            var flattenedData = contactsDataMapper(cachedDataObj);

                            // DEBUGGING
                            console.log('AJAX ERROR flattenedData', flattenedData);


                            if (flattenedData !== null) {
                                // if we have cached data, notify the data source that the request succeeded
                                options.success(flattenedData);

                            }
                            else {
                                // notify the data source that the request failed.
                                options.error(result);
                            }

                        }

                    });
                }
            },
//        group:{field:"office.title"}, // enable grouping by office
            schema: {
                data: 'items'
            }
//        error:function(e){
//            console.log('ERROR',e);
//        }
//        schema:function(data){
//            console.log(data);
//        }
        });



        return {
            contacts: contactDS3.read()
        };

    }());

    // contacts view model
    var contactsViewModel = (function () {

        console.log('define contactsViewModel');

        var init = function () {
            console.log('contacts init Hit!');
        };

        // Navigate to activityView When some activity is selected
        var activitySelected = function (e) {

            app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
        };

        // Navigate to app home
        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };


        return {
            init:init(),
            contacts: JSON.stringify(contactsModel),
            activitySelected: activitySelected
        };

    }());

    console.log('contactsViewModel', contactsViewModel);
    return contactsViewModel;






}());
