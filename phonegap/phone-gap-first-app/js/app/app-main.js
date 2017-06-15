'use strict';

// startup
if (window.cordova) {
    document.addEventListener('deviceready', init, false);
} else {
    $(document).ready(init);
}

// Initialization

function init() {
    //alert('Application Initialized');

    var $plat = $('#plat');
    var platform = 'Unknown';

    if (window.cordova) {
        if (device.platform === 'iOS') {
            platform = 'Apple iOS';
        }
    }
    $plat.text(platform);

}