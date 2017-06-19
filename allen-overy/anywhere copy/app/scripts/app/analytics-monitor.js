/**
 * Analytics monitor
 */

(function (win) {

    var analytics = win.analytics = win.analytics || {};
    
    analytics.isAnalytics = function () {

        console.log("In analytics " + appSettings.eqatec.productKey);

        return false;

        return appSettings.eqatec.productKey !== '$EQATEC_PRODUCT_KEY$';
    };

    analytics.Start = function() {


        console.log("Start");

        // Handy shortcuts to the analytics api
        var factory = win.plugins.EqatecAnalytics.Factory;
        var monitor = win.plugins.EqatecAnalytics.Monitor;

        console.log("Factory and monitor created");


        // Create the monitor instance using the unique product key for everlive-friends-hybrid
        var productId = appSettings.eqatec.productKey;
        var version = appSettings.eqatec.version || '1.0.0.0';


        console.log("Product id " + productId);


        var settings = factory.CreateSettings(productId, version);
        settings.LoggingInterface = factory.CreateTraceLogger();


        console.log("Settings created");


        //settings.ProxyConnectionString = "iproxy.omnia.aoglobal.dev:80";


        factory.CreateMonitorWithSettings(settings,
            function() {
                console.log('Monitor created');
                // Start the monitor inside the success-callback
                monitor.Start(function() {
                  console.log('Monitor started');
                });
            },
            function(msg) {
                console.log('Error creating monitor: ' + msg);
            });
    };
    
    analytics.Stop = function() {
        var monitor = win.plugins.EqatecAnalytics.Monitor;
        monitor.Stop();
    };
    
    analytics.TrackFeature = function (feature) {


        var monitor = win.plugins.EqatecAnalytics.Monitor;
        monitor.TrackFeature(feature);
    };

    analytics.Monitor = function() {
        return win.plugins.EqatecAnalytics.Monitor;
    };
    
}(window));
