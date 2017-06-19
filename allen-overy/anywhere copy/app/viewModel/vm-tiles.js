/**
 * Tiles view model
 */

var app = app || {};

app.Tiles = (function () {
    'use strict'

    var tilesModel = (function () {

        var url = appSettings.contentful.url + '/' + appSettings.contentful.space + '/entries';

        var contentType = appSettings.contentful.contentTypes.tile;
        var cachedData = null;

        function renderTiles() {

            console.log('Render Tiles init masonry');
            var $container = $('#tiles');
            $container.imagesLoaded( function() {
                $container.masonry({
                    columnWidth: 200,
                   // columnWidth:  function( containerWidth ) { return containerWidth / columns;},
                    itemSelector: '.tile'
                });
                $container.masonry('reloadItems');
                $container.masonry('layout');
            });
        }

        var privateParam = {
            "content_type" : contentType,
            "include" : "1"
        }

        var publicParam = {
            "content_type" : contentType,
            "include" : "1",
            "fields.security[nin]" : "Private"
        }

        function getUrlforId(id) {

            var assets = JSON.parse(cachedData).includes.Asset;
            var asset = $.grep(assets, function(n){
                return n.sys.id == id;
            });

            return asset[0].fields.file.url;
        }

        var searchParams = function () {

            if (resource.readCookie("Authenticated") == null)
                return publicParam;
            else
                return privateParam;
        };

        var cachedRead = function(operation) {

            cachedData = resource.readLocal(contentType);
         //   cachedData = null;

            if (cachedData != null || cachedData != undefined) {
                console.log('Reading ' + contentType + ' from cache');
                operation.success(JSON.parse(cachedData));

            } else {
                $.ajax({
                    url: url,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', appSettings.contentful.apiKey),
                        xhr.setRequestHeader('Content-Type', appSettings.contentful.contentType)
                    },
                    dataType: "json",
                    data: searchParams(),
                    success: function(response) {

                        console.log('Writing ' + contentType + ' to cache');
                        cachedData = JSON.stringify(response);
                        resource.writeLocal(contentType, JSON.stringify(response));
                      operation.success(response);
                    }
                });
            }
        }

        var tilesDataSource = new kendo.data.DataSource({
            transport: {
               read: cachedRead
            },
            schema: {
                data: "items",
                type: "json",
                model: {
                    fields: {
                        name: "fields.name",
                        type: "fields.type",
                        size: "fields.size",
                        security: "fields.security",
                        imageId: "fields.image.sys.id",
                        pageId: "fields.page.sys.id"
                    },
                    getUrl: function () {
                        return 'http:' + getUrlforId(this.get('fields.image.sys.id'));
                    }
                }
            },
            change: renderTiles,
            requestStart: function() {
                kendo.ui.progress($("#tiles"), true);
            },
            requestEnd: function() {
                kendo.ui.progress($("#tiles"), false);
            }

        });

        return {
            tiles: tilesDataSource
        };
        
    }());

    // Tiles view model
    var tilesViewModel = (function () {


        var tileSelected = function (e) {

            var tileType = e.data.type;
            var tileSecurity = e.data.security;


            var feature = tileType + ".Select";
            var isAnalytics = analytics.isAnalytics();


            console.log("Is analytics");



            if (isAnalytics) {
                analytics.Start();
                analytics.TrackFeature(feature);
                analytics.Stop();
            }

            if ((!tileSecurity.localeCompare('Public') == 0) && (resource.readCookie("Authenticated") == null))
            {
                alert('This is a promo tile, please log in to view the contents');

            }

            else
            {

                if (tileType == 'News') {
                    app.mobileApp.navigate('views/v-news.html?uid=' + e.data.pageId);
                }
                else if (tileType == 'Contact') {
                     app.mobileApp.navigate('views/v-contacts.html?uid=' + e.data.pageId);
                }
                else if (tileType == 'Promo') {

                    console.log("Show browser");


                    var url = "http://wwz.vak18.com";

                    window.open(url, '_blank', 'location=no,enableViewportScale=yes,closebuttoncaption=Return to app');


                    //app.mobileApp.navigate('views/v-browser.html?uid=' + e.data.pageId);
                    // alert('Display the promotional Tile');
                }
                else if (tileType == 'Checklist') {
                    app.mobileApp.navigate('views/v-checklist.html?uid=' + e.data.pageId);
//                    app.mobileApp.navigate('views/v-guide.html?uid=' + e.data.pageId);
                }
                else if (tileType == 'About') {
                    app.mobileApp.navigate('views/v-about-us.html?uid=' + e.data.pageId);
                }


            }
        };

        var show = function () {

            tilesModel.tiles.read();

        };

        var init = function () {

            // check whether user needs to read the terms and conditions.
            tncCheck.doCheck();

            var isAnalytics = analytics.isAnalytics();

            if (!isAnalytics) {
                console.log('EQATEC product key is not set. You cannot use EQATEC Analytics service.');
            } else
            {
                console.log(analytics.isAnalytics());
            }

            var scroller = $("#tileScroller").data("kendoMobileScroller");

            scroller.setOptions({
                pullToRefresh: true,
                pull: tilePull,
                pullOffset: 100

            });

            function tilePull() {

                resource.removeLocal(appSettings.contentful.contentTypes.tile);

                tilesModel.tiles.read();

                var scroller = $("#tileScroller").data("kendoMobileScroller");
                scroller.pullHandled();
            }




        };


        // todo: integrate
        var selectTNC = function (e) {
            console.log("TNC SELECTED"); // todo: delete me

            var pageId = appSettings.termsAndConditions.pageId;
            app.mobileApp.navigate("views/v-tandc.html?uid=" + pageId);

        };

        return {

            selectTNC: selectTNC, // todo: integrate
            tiles: tilesModel.tiles,
            tileSelected: tileSelected,
            show: show,
            init: init,
            loggedInAs: app.Users.currentUser
        };
        
    }());
    
    return tilesViewModel;
    
}());
