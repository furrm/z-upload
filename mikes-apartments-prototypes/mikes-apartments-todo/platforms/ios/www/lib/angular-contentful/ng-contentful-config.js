angular.module('ng-contentful-config', [])

    // contentful base uri's
    .constant('contentfulBaseUrls', {
        "contentDeliveryUrl": 'https://cdn.contentful.com',
        "contentManagementUrl": 'https://api.contentful.com'
        // TODO: Image URL and any others
    })

    // contentful configuration
    // best to set this at app.run
    .value('contentfulConfig', {
        spaceId: '',
        accessToken: ''
    })
;