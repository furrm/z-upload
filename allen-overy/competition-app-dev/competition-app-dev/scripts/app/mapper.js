"use strict";

// NOTE: The following script requires knowledge of Lo-Dash.
// Lo-Dash is a competitor of Underscore, and is far quicker.
// All objects that are referenced as _.{function} is a Lo-Dash function.

var map = (function () {
    return {
        toTandC: function (data) {
            return mapToTermsAndConditions(data);
        },
        toContacts: function(data){
            return contactsDataMapper(data);
        }
    }

    // T&C Mapper
    function mapToTermsAndConditions(contentfulData) {

        // the mapped data to return
        var mappedData = {};

//        var items = contentfulData.items; // contentful item array
        var includes = contentfulData.includes; // contentful related assets and entries


        // we are dealing with a single page content type item at this point.
        var item = contentfulData.items[0];

        console.log('PAGE ITEM', item); // todo: delete me


        var flattenedTNC = _.map(item.fields.content, function(content){

                var retVal = getTNC(content.sys.id);
                return retVal

            });

        _.extend(mappedData, {items: flattenedTNC});

        return mappedData;

        // Get the T&C
        function getTNC(entryId){
            // find the entry
            var foundEntry = _.find(includes.Entry, function (entry) {
//
                return entry.sys.id === entryId;
//
            });

            var tnc = {
                id: foundEntry.sys.id,
                title: foundEntry.fields.title,
                forceRead: foundEntry.fields.forceRead,
                sections:_.map(foundEntry.fields.sections, function (section) {

                    return getSection(section.sys.id);

                })
            };

            return tnc;
        }

        // Gets the T&C Section
        function getSection(entryId) {

            // find the entry
            var foundEntry = _.find(includes.Entry, function (entry) {
//
                return entry.sys.id === entryId;
//
            });

            return {
                id: entryId,
                bodyText: foundEntry.fields.bodyText,
                bodyParsed: marked.parse(foundEntry.fields.bodyText)
            };
        }

    }


    function contactsDataMapper(contentfulData) {

        // NOTE: The following script requires knowledge of Lo-Dash.
        // Lo-Dash is a competitor of Underscore, and is far quicker.
        // All objects that are referenced as _.{function} is a Lo-Dash function.

        // the mapped data to return
        var mappedData = {};

        // Process the root data first
        // assign the root properties.
        _.assign(mappedData, {sys: contentfulData.sys});
        _.assign(mappedData, {total: contentfulData.total});
        _.assign(mappedData, {skip: contentfulData.skip});
        _.assign(mappedData, {limit: contentfulData.limit});
        // TODO: split out the above to a mapHeader function


        var items = contentfulData.items; // contentful item array
        var includes = contentfulData.includes; // contentful related assets and entries

        // now map the contentful item collection
        var newItems = _.map(contentfulData.items, function (item) { // callback

            // map the properties
            var mappedItem = {
                id: item.sys.id,
                firstName: item.fields.firstName,
                lastName: item.fields.lastName,
                telephone: item.fields.telephone,
                email: item.fields.email,
                practice: item.fields.practice
            }

            // map the known related assets
            // image
            if (typeof item.fields.image != 'undefined') {

                // add the image to the mapped item.
                _.assign(mappedItem, {"image": getAsset(item.fields.image.sys.id)});

            }


            // map the known related entries
            // office
            if (typeof item.fields.office != 'undefined') {
                _.assign(mappedItem, {"office": getEntry(item.fields.office.sys.id)});
            }

            return mappedItem;

        });


        _.assign(mappedData, {items: newItems});

//        console.log('NEW DATA', mappedData);
//        console.log('NEW DATA STRINGIFY', JSON.stringify(mappedData));

        function getAsset(assetId) {

            // find the asset
            var foundAsset = _.find(includes.Asset, function (asset) {

                return asset.sys.id === assetId;

            });

//            console.log('GETASSET foundAsset:', foundAsset);

            // TODO: Think about returning the found object as-is
            return {
                id: assetId,
                title: foundAsset.fields.title,
                url: foundAsset.fields.file.url
            };

        }

        function getEntry(entryId) {

//            console.log('GETENTRY entryId:', entryId);

            // find the entry
            var foundEntry = _.find(includes.Entry, function (entry) {

                return entry.sys.id === entryId;

            });

//            console.log('GETENTRY foundEntry:', foundEntry);


            return {
                id: entryId,
                title: foundEntry.fields.name
            };
        }

        return mappedData;

    };




})();

