var utility = (function () {
    return{
        searchParamBuilder: function (what) {

            var searchParam;

            switch (what) {
                case "all":
                    // Include all new and changed content, i.e., Assets, Entries and deletions
                    var searchParam = {
                        "initial": true,
                        "type": "all"
                    };
                    break;
                case "Asset":
                    // Only include new and changed Assets
                    var searchParam = {
                        "initial": true,
                        "type": "Asset"
                    };
                    break;
                case "Entry":
                    // Only include new and changed Entries.
                    var searchParam = {
                        "initial": true,
                        "type": "Entry"
                    };
                    break;
                case "Deletion":
                    // Only include deletions of Assets and Enties.
                    var searchParam = {
                        "initial": true,
                        "type": "Deletion"
                    };
                    break;
                case "DeletedAsset":
                    // Only include deletions of Assets.
                    var searchParam = {
                        "initial": true,
                        "type": "DeletedAsset"
                    };
                    break;
                case "DeletedEntry":
                    // Only include deletions of Assets and Enties.
                    var searchParam = {
                        "initial": true,
                        "type": "DeletedEntry"
                    };
                    break;
                default:
                    throw "The sync parameter supplied is not recognised."
            }

            return searchParam;
        },
        dataHasErrors: function (data) {

            return doesDataHaveErrors(data);

        }
    }

    function doesDataHaveErrors(data){

        var hasErrors = false

        if(data.errors){hasErrors = true;}

        return hasErrors;
    }

})();