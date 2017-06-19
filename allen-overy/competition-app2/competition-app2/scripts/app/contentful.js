var contentful = (function () {

    return {
        authorisationKey: undefined,
        contentDeliveryUrl: "https://cdn.contentful.com",
        getData: function (spaceId, type, id, query) {

            var url = this.contentDeliveryUrl;

            // todo: ensure that the authorisationKey has been set. throw exception if not.
            var authorisationKey = "Bearer " + this.authorisationKey;

            if (typeof spaceId != 'undefined') {
                url = url + '/spaces/' + spaceId;
            }

            if (typeof type != 'undefined') {
                url = url + '/' + type;
            }

            if (typeof id != 'undefined') {
                url = url + '/' + id;
            }

            console.log('Calling Contentful', url); // todo: delete me

            // build up the promise that will be handled by the caller.
            var promise = $.ajax({
                url: url,
                dataType: "json",
                data: query,
                beforeSend: function (xhr) {
                    // todo: http conditional get
                    xhr.setRequestHeader('Authorization', authorisationKey),
                    xhr.setRequestHeader('Content-Type', 'application/json')
                }});

            return promise;
        }
    }

})();