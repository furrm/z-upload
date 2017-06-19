//(function (global) {
//    var app = global.app = global.app || {};
//
//    document.addEventListener('deviceready', function () {
//        navigator.splashscreen.hide();
//
//        app.changeSkin = function (e) {
//            var mobileSkin = "";
//
//            if (e.sender.element.text() === "Flat") {
//                e.sender.element.text("Native");
//                mobileSkin = "flat";
//            } else {
//                e.sender.element.text("Flat");
//                mobileSkin = "";
//            }
//
//            app.application.skin(mobileSkin);
//        };
//
//        app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout" });
//    }, false);
//})(window);


(function (global) {
    var mobileSkin = "",
        app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false);

    app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout"});

    app.changeSkin = function (e) {
        if (e.sender.element.text() === "Flat") {
            e.sender.element.text("Native");
            mobileSkin = "flat";
        }
        else {
            e.sender.element.text("Flat");
            mobileSkin = "";
        }

        app.application.skin(mobileSkin);
    };
})(window);