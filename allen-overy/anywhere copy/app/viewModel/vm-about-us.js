/**
 * News view model
 */

var app = app || {};

app.AboutUs = (function () {
    'use strict'


    var url = null;
    var cacheKey = null;

    var aboutModel = (function () {

        var cachedData = null;

        function onChange() {
            console.log("onchange called"); // todo: delete me
        }

        function getUrlforId1(id) {

            var assets = JSON.parse(cachedData).includes.Asset;
            var asset = $.grep(assets, function(n){
                return n.sys.id == id;
            });

            return asset[0].fields.file.url;
        }

        function getTitleforId1(id) {

            var assets = JSON.parse(cachedData).includes.Asset;
            var asset = $.grep(assets, function(n){
                return n.sys.id == id;
            });

            return asset[0].fields.title;
        }

        function getUrlforId(id) {

            var assets = JSON.parse(cachedData).includes.Asset;
            var asset = $.grep(assets, function(n){
                return n.sys.id == id;
            });
            return asset[0].fields.file.url;
        }

        var cachedRead = function(operation) {

            cachedData = resource.readLocal(cacheKey);


            if (url == null)
            {
                console.log("First time in here so do nothing");
                operation.error();

            }
            else
            {


            console.log('inside the cachedRead function URL IS ' + url);

            if (cachedData != null || cachedData != undefined) {
                console.log('Reading ' + cacheKey + ' from cache');
                operation.success(JSON.parse(cachedData));

            } else {
                console.log('could not read from cache so getting data');
                console.log('url is  ' + url);



                $.ajax({

                    url: url,

                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', appSettings.contentful.apiKey),
                        xhr.setRequestHeader('Content-Type', appSettings.contentful.contentType)
                    },
                    dataType: "json",

                    success: function(response) {


                        console.log('Writing ' + cacheKey + ' to cache');
                        console.log("URL WAS " + url);
                        cachedData = JSON.stringify(response);

                        resource.writeLocal(cacheKey, JSON.stringify(response));
                        operation.success(response);
                    },
                    error: function(response) {

                        resource.removeLocal(cacheKey);


                        console.log(response.status);

                        // console.log(response);


                    }
                });
            }

            }
        }


        var aboutDataSource = new kendo.data.DataSource({
            transport: {
                read: cachedRead
            },
            schema: {
                data: "includes.Entry",
                type: "json",
                model: {
                    fields: {
                        title: "fields.name",
                        imageId: "fields.image.sys.id",
                        heading: "fields.heading",
                        body: "fields.body"
                    },
                    parseBody: function(){
                        return marked.parse(this.get("fields.body"));
                    },
                    getUrl: function () {
                        return 'http:' + getUrlforId(this.get('fields.image.sys.id'));
                    },
                    getBrochureUrl: function () {
                        var data = this.get("fields.content");
                        var arrayLength = data.length;
//                        var PDFList = ""
                        var PDFs = [];
                        for (var i = 0; i < arrayLength; i++) {
//                            console.log("goblin PDF: " + 'http:' + getUrlforId1(this.get('fields.content[' + i + '].sys.id')))
//                            console.log("goblin PDF name: " + getTitleforId1(this.get('fields.content[' + i + '].sys.id')));
                            var pdfTitle = getTitleforId1(this.get('fields.content[' + i + '].sys.id'));
                            var pdfUrl = 'http:' + getUrlforId1(this.get('fields.content[' + i + '].sys.id'));
//                            PDFList = PDFList + "<a href=" + pdfUrl + ">" + pdfTitle + "</a>" + "<br>";
                            PDFs.push({pdfTitle : pdfTitle, pdfUrl : pdfUrl});
                        }
//                        return PDFList;
                        return PDFs;
                    }

                }
            },
            requestStart: function(e) {
                console.log("Request started");
            }
        });

        return {
            about: aboutDataSource
        };

    }());

    var aboutViewModel = (function () {

        var passedId = null;

        var show = function (e) {

            passedId = e.view.params.uid;

            cacheKey = passedId;

            url = appSettings.contentful.url + '/' + appSettings.contentful.space + '/entries?sys.id=' + passedId;

            aboutModel.about.read();


        };

        var init = function (e) {

            console.log('In init');

        };

        return {
            about: aboutModel.about,
            init: init,
            show: show
        };
        
    }());
    
    return aboutViewModel;

}());
