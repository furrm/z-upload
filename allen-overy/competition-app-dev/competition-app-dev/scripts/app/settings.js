/**
 * Application Settings
 */

var appSettings = {

    "termsAndConditions":{
        "pageId":"4fBDrePGwMWUgkoAcSQ820", // todo: don't like this
        "haveReadKey": "64c77bc1df264c2eadbfd734d850f627"
    },

    contentful: {
        url : 'https://cdn.contentful.com/spaces',
        space: 'zpp0viuq4x1e',
        apiKey: 'Bearer 31d5775c68437c57df39ebdde118dff797e89a545408ccb981abdb2908e79b60', // todo:speak to Chris to remove Bearer
        contentType: 'application/json',

        // todo: speak to Chris to populate the following from Contentful
        contentTypes: {
            tile : '3pkmDE66VieGaQm8GsSwIu',
            about : '3pkmDE66VieGaQm8GsSwIu',
            checklist : '3pkmDE66VieGaQm8GsSwIu',
            contacts : '3pkmDE66VieGaQm8GsSwIu',
            "TNC":  "4sXD3yB2A8UgwG6Q8meY0K"

        }

    },

    everlive: {
        apiKey: 'KqTQHtE5I1wIvpKs', // Put your Everlive API key here
        scheme: 'http'
    },
    
    eqatec: {
        productKey: '494e56b042ab4f59b2f3f76d6a279fff',  // Put your EQATEC product key here
        version: '1.0.0.0' // Put your application version here
    },
    
    facebook: {
        appId: '1408629486049918', // Put your Facebook App ID here
        redirectUri: 'https://www.facebook.com/connect/login_success.html' // Put your Facebook Redirect URI here
    },
    
    google: {
        clientId: '406987471724-q1sorfhhcbulk6r5r317l482u9f62ti8.apps.googleusercontent.com', // Put your Google Client ID here
        redirectUri: 'http://localhost' // Put your Google Redirect URI here
    },
    
    liveId: {
        clientId: '000000004C10D1AF', // Put your LiveID Client ID here
        redirectUri: 'https://login.live.com/oauth20_desktop.srf' // Put your LiveID Redirect URI here
    },
    
    adfs: {
        adfsRealm: '$ADFS_REALM$', // Put your ADFS Realm here
        adfsEndpoint: '$ADFS_ENDPOINT$' // Put your ADFS Endpoint here
    },
    
    messages: {
        mistSimulatorAlert: 'The social login doesn\'t work in the In-Browser Client, you need to deploy the app to a device, or run it in the simulator of the Windows Client or Visual Studio.',
        removeActivityConfirm: 'Are you sure you want to delete this Activity?'
    }
};
