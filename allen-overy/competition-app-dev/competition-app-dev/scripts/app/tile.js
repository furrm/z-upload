/**
 * Tile view model
 */

var app = app || {};

app.Tile = (function () {
    'use strict'
    
    var tileViewModel = (function () {
        
        var tileUid;
        
        var show = function (e) {
            
            tileUid = e.view.params.uid;
            // Get current tile (based on item uid) from Tiles model
            var tile = app.Tiles.tiles.getByUid(tileUid);

            kendo.bind(e.view.element, tile, kendo.mobile.ui);
        };
        return {
            show: show
        };
        
    }());
    
    return tileViewModel;
    
}());
