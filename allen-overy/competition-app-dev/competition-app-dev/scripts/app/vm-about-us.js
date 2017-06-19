/**
 * News view model
 */

var app = app || {};

app.AboutUs = (function () {
    'use strict'

    var aboutViewModel = (function () {


        function onChange() {
            console.log("onchange called"); // todo: delete me
        }

        function onError() {
            // kendoConsole.log('An error');
        }

        // var template  = kendo.template($("#template").html());

        var space = "zpp0viuq4x1e";
        var contentType = "6hQLWC6YmI2Iw4cKES8moU";
        var authorisation = "Bearer 31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60";

        var url = "https://cdn.contentful.com/spaces/" + space + "/entries";

        // kendoConsole.log(url);

        var assetDS = new kendo.data.DataSource({
            transport: {
                read: {
                    url: url,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', authorisation),
                            xhr.setRequestHeader('Content-Type','application/json')
                    },
                    dataType: "json",
                    data: {
                        content_type: contentType
                    }
                }
            },
            // filter: { field: "fields.image2", operator: "neq", value: "" },
            schema: {
                data: "includes.Asset",
                type: "json",
                model: {
                    fields: {
                        imageId: "sys.id",
                        imageUrl: "fields.file.url",
                        typeId: "fields.file.contentType",
                        pdfId: "sys.id",
                        pdfTitle: "fields.title",
                        pdfUrl: "fields.file.url"
                    }
                }
            },
            error: function(e) {
                // kendoConsole.log(e.xhr.responseText);
            }
        });

        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: url,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', authorisation),
                            xhr.setRequestHeader('Content-Type','application/json')
                    },
                    dataType: "json",
                    data: {
                        content_type: contentType
                    }
                }
            },
            schema: {
                data: "items",
                type: "json",
                model: {
                    fields: {
                        title: "fields.name",
                        imageId: "fields.image.sys.id",
                        heading: "fields.heading",
                        body: "fields.body"
                        //brochureId: "fields.documentFiles"
                    },
                    parseBody: function(){
                        return marked.parse(this.get("fields.body"));
                    },
                    GetUrl: function () {

                        var data = assetDS.data();
                        var arrayLength = data.length;
                        var assetId = this.get('fields.image.sys.id');

                        for (var i = 0; i < arrayLength; i++) {
                            var asset = assetDS.at(i);
                            if (asset.imageId == assetId)
                            	return 'http:' +  asset.imageUrl;
                        }
                    },
                    GetBrochureUrl: function () {

                        var data = assetDS.data();
                        var arrayLength = data.length;
                        var assetId = this.get('fields.image.sys.id');
                        var goblin = ""

                        for (var i = 0; i < arrayLength; i++) {
                            var asset = assetDS.at(i);
                            if (asset.typeId == "application/pdf")
                                goblin = goblin + "<a href=http:" + asset.pdfUrl + ">" + asset.pdfTitle + "</a>" + "<br>";
                        }
                        return goblin;
                    }
                }
            },

            change: onChange
        });

        assetDS.fetch(function(){
            var data = assetDS.data();
            console.log('About Us: Asset fetch ' + assetDS.data.length);

            dataSource.fetch(function() {
                console.log('About Us: Datasource fetch ' + dataSource.data.length);
            });
        });

        var reload = function (e) {
//
//            console.log("reloading..."); // todo: delete me
//            location.reload(true);
        };

        var refresh = function(){
//            assetDS.fetch(function(){
//                var data = assetDS.data();
//                console.log('About Us: Asset fetch ' + assetDS.data.length);
//
//                dataSource.fetch(function() {
//                    console.log('About Us: Datasource fetch ' + dataSource.data.length);
//                });
//            });
        }


        return {
            about: dataSource,
            reload:reload,
            refresh:refresh

        };
        
    }());
    
    return aboutViewModel;

}());
