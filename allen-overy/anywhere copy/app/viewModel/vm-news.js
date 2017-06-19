/**
 * News view model
 */

var app = app || {};

app.News = (function () {
    'use strict'

    var newsViewModel = (function () {

        var passedId = null;
        var url = null;
        var cacheKey = null;
        var proxyUrl = null;

        function newsDataSourceChange() {

            var asset = newsDataSource.at(0);
            proxyUrl = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&q=" + encodeURIComponent( asset.feedUrl);
            feedDataSource.transport.options.read.url = proxyUrl;
            feedDataSource.read();

        }

        var cachedRead = function(operation) {

            var cachedData = resource.readLocal(cacheKey);

            if(cachedData != null || cachedData != undefined) {
                console.log('Reading ' + cacheKey + ' from cache');
                operation.success(JSON.parse(cachedData));

            } else {
                $.ajax({
                    url: url,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', appSettings.contentful.apiKey),
                        xhr.setRequestHeader('Content-Type', appSettings.contentful.contentType)
                    },
                    dataType: "json",

                    success: function(response) {
                        console.log('Writing ' + cacheKey + ' to cache');
                        cachedData = JSON.stringify(response);
                        resource.writeLocal(cacheKey, JSON.stringify(response));
                        operation.success(response);
                    }
                });
            }
        }

        var newsDataSource = new kendo.data.DataSource({
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
            change: newsDataSourceChange
        });

        var feedDataSource = new kendo.data.DataSource({
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
                        publishedDate: "publishedDate",
                        link: "link",
                        content: "content"
                    }
                }
            }

        });

        var show = function (e) {

            passedId = e.view.params.uid;
            cacheKey = passedId;

            url = appSettings.contentful.url + '/' + appSettings.contentful.space + '/entries?sys.id=' + passedId;

            newsDataSource.read();

        };

        var init = function (e) {

            console.log("News init");

            $("#newsListView").kendoMobileListView({
                dataSource: feedDataSource,
                pullToRefresh: true,
                pullParameters: pullParameter,
                template: $("#newsTemplate").text()
            });


            function pullParameter() {

                resource.removeLocal(cacheKey);
                newsDataSource.read();
            }
        };

//        var refresh = function (e) {
//
//            console.log("Removing content type " + contentType);
//            resource.removeLocal(contentType);
//
//            newsDataSource.read();
//            // feedDataSource.read();
//        };

        // Navigate to tileView When some tile is selected
        var newsSelected = function (e) {
            console.log('News selected ' + e.data.link);
            window.open(e.data.link, '_blank', 'location=no,enableViewportScale=yes,closebuttoncaption=Return to app');
        };

        return {
            news: feedDataSource,
            init: init,
            show: show,
//            refresh: refresh,
            newsSelected: newsSelected
        };
        
    }());
    
    return newsViewModel;

}());
