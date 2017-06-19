angular.module('app.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('Friends', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var friends = [
            { id: 0, name: 'Scruff McGruff' },
            { id: 1, name: 'G.I. Joe' },
            { id: 2, name: 'Miss Frizzle' },
            { id: 3, name: 'Ash Ketchum' }
        ];

        return {
            all: function () {
                return friends;
            },
            get: function (friendId) {
                // Simple index lookup
                return friends[friendId];
            }
        }
    })
    .factory('ContentTypeCacheFactory', [function () {
        return{
            cacheDataByContentType: cacheDataByContentType
        }

        function cacheDataByContentType(contentType, data) {
//            console.log(contentType); // todo: delete me

            var foundItems = [];

            _.forEach(data, function (item) {

                if (item.sys.contentType.sys.id === contentType.sys.id) {
                    foundItems.push(item);
                }

            });


//            cacheFactory.writeLocal(contentType.sys.id, JSON.stringify(foundItems));
            cacheFactory.writeLocal(contentType.name, JSON.stringify(foundItems));

        }
    }])
;
