"use strict";

var tncCheck = (function () {

    return {
        doCheck:function() {

            var pageId = appSettings.termsAndConditions.pageId;
            var contentTypeId = appSettings.contentful.contentTypes.TNC;
            var cachedData = undefined;
            var contentfulData = undefined;
            var isFirstUse = false; // determined by cached data is null
            var isForcedToRead = undefined;
            var hasAccepted = false; // assume that the user has never read the t's and c's
            var dataIsEqual;

            var hasReadKey = appSettings.termsAndConditions.haveReadKey;

            // check the cache to see if the the key exists.
            var hasReadCache = resource.readLocal(hasReadKey);

            console.log("hasReadKey:", hasReadKey); // todo: delete me
            console.log("hasReadCache:", hasReadCache); // todo: delete me

            // has the user read the t's and c's
            if(_.isNull(hasReadCache)){

                // as there is no entry in the cache, assume that the user has never read the t's and c's
                // so, the user has neither accepted or declined
                hasAccepted = false;

            }
            else{

                // determine whether the user has accepted or declined the t's and c's
                // 0 = declined; 1 = accepted;
                var flag = Number(hasReadCache);

                if(flag === 0){
                    hasAccepted = false;
                }
                else if(flag === 1){
                    hasAccepted = true;
                }
                else{ // unexpected condition throw an error
                    //todo: handle error
                    alert("Unknown flag!!");
                }

            }

            // check the permanent cache for terms and conditions JSON
            var cachedData = JSON.parse(resource.readLocal(pageId));

            // is this the first time the user has used the app
            if (_.isNull(cachedData)) {

                // we have to assume at this point this is the first time the user has used the app
                isFirstUse = true;

            }
            else {

                // we have t&c cached data so the uer has been here before
                isFirstUse = false;

            }

            // get the terms and conditions from contentful...
            // we need to check that the terms and conditions haven't changed
            // we also need to force the user to read the terms and conditions if changed

            var query = {
                "sys.id": pageId
            };

            // todo: correct this or remove it altogether
            contentful.authorisationKey = "31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60";


            // Get the data from contentful
            contentful.getData(appSettings.contentful.space, "entries", undefined, query)
                .done(function (data, status, xhr) { // SUCCESS

                    console.log("SUCCESS", data, status, xhr); // todo: delete me

                    contentfulData = data;

                    // always write data to permanent cache
                    resource.writeLocal(pageId, JSON.stringify(contentfulData));

                })
                .fail(function (xhr, status) { // FAILURE

                    console.log("FAILURE", status, xhr); // todo: delete me

                    // if we get a failure, just make the contentfulData var the same as the cachedData var
                    contentfulData = cachedData;


                })
                .always(function (data, status, xhr) { // COMPLETE
                    console.log("COMPLETE", data, status, xhr); // todo: delete me

                    // have the terms and conditions changed
                    dataIsEqual = _.isEqual(cachedData, contentfulData);

                    console.log("ARE OBJECTS EQUAL?: ", dataIsEqual); // todo: delete me

                    if (!dataIsEqual) {

                        // check to see whether the user must read the new terms and conditions...
                        try {
                            var foundVal = _.find(contentfulData.includes.Entry, function (entry) {

//                                return entry.sys.contentType.sys.id === contentTypeId;
                                return entry;

                            });

                            console.log("FOUND VAL", foundVal); // todo: delete me

                            isForcedToRead = foundVal.fields.forceRead;

                        } catch (e) {
                            console.log('WE HAVE A PROBLEM HERE!!', e); // todo: delete me

                            // todo: handle error

                        } finally {

                            // todo: handle error or redirect user to t's and c's

                        }

                    }

                    if(isFirstUse){

                        // we need to redirect the user to the terms and conditions
                        console.log('IS FIRST USE SO READ TNC'); // todo: delete me

                        readTNC();
                    }
                    else{

                        // no need to redirect unless user is forced to read the terms and conditions
                        if(isForcedToRead){
                            console.log('IS FORCED TO READ'); // todo: delete me

                            readTNC();
                        }
                    }

                    // final check is to see whether the user has read and accepted the t's & c's
                    if(!hasAccepted){
                        readTNC();
                    }

                });


            function readTNC() {
                console.log("REDIRECT USER TO READ TERMS AND CONDITIONS"); // todo: delete me
                app.mobileApp.navigate("views/v-tandc.html?uid=" + pageId);
            }

        }
    };

})();



