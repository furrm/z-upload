"use strict";

// NOTE: The following script requires knowledge of Lo-Dash.
// Lo-Dash is a competitor of Underscore, and is far quicker.
// All objects that are referenced as _.{function} is a Lo-Dash function.

var map = (function () {
    return {
        toTandC: function (data) {
            return mapToTermsAndConditions(data);
        }
    }

    // T&C Mapper v2
    function mapToTermsAndConditions(contentfulData) {

        // the mapped data to return
        var mappedData = {};

//        var items = contentfulData.items; // contentful item array
        var includes = contentfulData.includes; // contentful related assets and entries


        // we are dealing with a single page content type item at this point.
        var item = contentfulData.items[0];

        console.log('PAGE ITEM', item); // todo: delete me


        var termsAndConditions =
            _.map(item.fields.content, function(content){
                var retVal = getTNC(content.sys.id);
                return retVal

            });

        _.assign(mappedData, {items: termsAndConditions});

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

    // T&C Mapper v1
//    function mapToTermsAndConditions(contentfulData) {
//
//        // the mapped data to return
//        var mappedData = {};
//
//        var items = contentfulData.items; // contentful item array
//        var includes = contentfulData.includes; // contentful related assets and entries
//
//        // todo: trap contentfulData.items that are 0 length
//
//        // Iterate through the items array
//        var newItems = _.map(items, function (item) { // callback
//
//            // map the properties for the item
//            var mappedItem = {
//                id: item.sys.id,
//                title: item.fields.title,
//                forceRead: item.fields.forceRead,
//                sections:_.map(item.fields.sections, function (section) {
//
//                    return getSection(section.sys.id);
//
//                })
//            };
//
//            // Gets the T&C Section
//            function getSection(entryId) {
//
//                // find the entry
//                var foundEntry = _.find(includes.Entry, function (entry) {
////
//                    return entry.sys.id === entryId;
////
//                });
//
//                return {
//                    id: entryId,
//                    bodyText: foundEntry.fields.bodyText,
//                    bodyParsed: marked.parse(foundEntry.fields.bodyText)
//                };
//            }
//
//            return mappedItem;
//
//        });
//
//        _.assign(mappedData, {items: newItems});
//
//        return mappedData;
//
//    }


})();

