/**
 * News view model
 */

var app = app || {};

app.News = (function () {
    'use strict'

    var newsViewModel = (function () {

        function onChange() {
            console.log('Datasource change');
        }

        var passedId = "6Uk52W6WGsUwKqMYO6YoiM";

        var space = "zpp0viuq4x1e";
        var contentType = "3pkmDE66VieGaQm8GsSwIu";
        var authorisation = "Bearer 31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60";

        var url = "https://cdn.contentful.com/spaces/" + space + "/entries?sys.id=" + passedId;

        var cacheKey = passedId;

        var cachedRead = function(operation) {

            var cashedData = localStorage.getItem(cacheKey);

            cashedData = null;

            if(cashedData != null || cashedData != undefined) {
                //if local data exists load from it
                console.log('Reading ' + cacheKey + ' from cache');
                operation.success(JSON.parse(cashedData));

            } else {
                $.ajax({
                    url: url,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', authorisation),
                        xhr.setRequestHeader('Content-Type','application/json')
                    },
                    dataType: "json",

                    success: function(response) {
                        console.log('Writing ' + cacheKey + ' to cache');

                        localStorage.setItem(cacheKey, JSON.stringify(response));
                        //pass the pass response to the DataSource
                        operation.success(response);
                    }
                });
            }
        }

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: cachedRead
            },
            schema: {
                data: "includes.Entry",
                type: "json",
                model: {
                    fields: {
                        feedId: "sys.id",
                        name: "fields.name",
                        feedUrl: "fields.value"
                    }
                }
            },
            error: function(e) {
                 console.log(e.xhr.responseText);
            }
        });

        var proxyUrl;

        var feedDS = new kendo.data.DataSource({
            transport: {
                read: {
                    url: proxyUrl,
                    dataType: "jsonp" // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                }
            },
            schema: {
                data: "responseData.feed.entries",
                type: "json",
                model: {
                    fields: {
                        title: "title",
                        author: "publishedData",
                        url: "link"
                    }
                }
            },
            error: function(e) {
                console.log(e.errors); // displays "Invalid query"
            },
            change: onChange
        });

        var show = function (e) {

            console.log("News Show function");

            passedId = e.view.params.uid;

            console.log("Passed in param " + passedId);
            cacheKey = passedId;

            url = "https://cdn.contentful.com/spaces/" + space + "/entries?sys.id=" + passedId;

            console.log("Url " + url);



            dataSource.refresh;

            dataSource.fetch(function() {


                var asset = dataSource.at(0);

                console.log("Feed Id" + asset.feedId);

                // Check the cache here

                proxyUrl = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=" + encodeURIComponent(asset.feedUrl);

                console.log("Proxy url " + proxyUrl);

                feedDS.transport.options.read.url = proxyUrl;


                feedDS.read();


            });
        };

        var refresh = function (e) {

            // localStorage.removeItem(contentType);
            dataSource.read();
            feedDS.read();

        };


        // Navigate to tileView When some tile is selected
        var newsSelected = function (e) {

        };

        return {
            news: feedDS,
            show: show,
            refresh: refresh,
            newsSelected: newsSelected
        };
        
    }());
    
    return newsViewModel;

}());
