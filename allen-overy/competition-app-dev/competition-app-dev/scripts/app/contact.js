/**
 * Tile view model
 */

var app = app || {};

app.Contact = (function () {
    'use strict'
    
    var contactViewModel = (function () {
        
        var contactUid;
        
        var show = function (e) {
            
            contactUid = e.view.params.uid;
            // Get current tile (based on item uid) from Tiles model
            var contact = app.Contacts.contacts.getByUid(contactUid);
            kendo.bind(e.view.element, contact, kendo.mobile.ui);
        };
        return {
            show: show
        };
        
    }());
    
    return contactViewModel;
    
}());
