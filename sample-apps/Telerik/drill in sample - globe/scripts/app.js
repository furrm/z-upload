(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();

        app.changeSkin = function (e) {
            var mobileSkin = "";

            if (e.sender.element.text() === "Flat") {
                e.sender.element.text("Native");
                mobileSkin = "flat";
            } else {
                e.sender.element.text("Flat");
                mobileSkin = "";
            }

            app.application.skin(mobileSkin);
        };

        app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout" });
    }, false);
    
    
    /*
    var everlive = new Everlive('SjPBBDYsPWQBEp7r');
    var data = everlive.data('Continent');
    var query = new Everlive.Query();
    query.select('Name', 'Area', 'Population', 'Id');
    data.get(query) // filter
        .then(function(data){
            console.log(JSON.stringify(data));
        },
        function(error){
            alert(JSON.stringify(error));
        });
    */
    
    /*
    var data = everlive.data('Country');
    var query = new Everlive.Query();
    query.select('Name', 'Area', 'Population', 'Id', 'Capital', 'Language', 'ContinentId');
    data.get(query) // filter
        .then(function(data){
            console.log(JSON.stringify(data));
        },
        function(error){
            alert(JSON.stringify(error));
        });
    */
    
    /*
    var data = everlive.data('City');
    var query = new Everlive.Query();
    query.select('Name', 'Area', 'Population', 'Id', 'CountryId');
    data.get(query) // filter
        .then(function(data){
            console.log(JSON.stringify(data));
        },
        function(error){
            alert(JSON.stringify(error));
        });
    */
    
})(window);

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}