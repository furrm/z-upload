/**
 * Tiles view model
 */

var app = app || {};

app.Tiles = (function () {
    'use strict'



    // Tiles model
    var tilesModel = (function () {
        return {
            tiles: undefined
        };

    }());
    

    // Tiles view model
    var tilesViewModel = (function () {

        var init = function(){
            console.log("TILES INIT CALLED"); // todo: delete me
        }

        var tileSelected = function (e) {

            var tileType = e.data.type;

            if (tileType == "termsAndConditions") {

                app.mobileApp.navigate("views/vw-tandc.html?uid=" + e.data.pageId);

            }
            else if (tileType == 'News') {

                app.mobileApp.navigate('views/newsView.html?uid=' + e.data.content);
            }
            else if (tileType == 'Promo') {

                alert('This is a prono tile');

            }
            else if (tileType == 'Checklist') {

                alert('Display Checklist');

            }

        };
        
        var selectTile = function(e){
            
            console.log("SelectedPageId:", e.button.data().pageid); // todo: delete me

            var pageId = e.button.data().pageid;

            app.mobileApp.navigate("views/vw-tandc.html?uid=" + pageId)

        }

        var navigateHome = function () {

            app.mobileApp.navigate('#welcome');
        };

        // Logout user
        var logout = function () {

            app.helper.logout()
                .then(navigateHome, function (err) {
                    app.showError(err.message);
                    navigateHome();
                });
        };

        return {
            init:init,
            selectTile: selectTile,
            tileSelected: tileSelected,
            logout: logout
        };

    }());

    return tilesViewModel;

}());
