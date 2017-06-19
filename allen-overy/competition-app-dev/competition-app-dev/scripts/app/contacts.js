/**
 * Contacts view model
 */

var app = app || {};

app.Contacts = (function () {
    'use strict'
    
    // Contacts model
    var contactsModel = (function () {
        
        var contactModel = {
            
            id: 'Id',
            fields: {
                FirstName: {
                    field: 'FirstName',
                    defaultValue: ''
                },
                LastName: {
                    field: 'LastName',
                    defaultValue: ''
                },
                Title: {
                    field: 'Title',
                    defaultValue: ''
                },
                Office: {
                    field: 'Office',
                    defaultValue: ''
                },
                Country: {
                    field: 'Office.Country',
                    defaultValue: ''
                },
                Department: {
                    field: 'Practice',
                    defaultValue: ''
                },
        
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                Picture: {
                    fields: 'Image',
                    defaultValue: null
                }
            },
            CreatedAtFormatted: function () {
                
                return app.helper.formatDate(this.get('CreatedAt'));
            },
            PictureUrl: function () {
                
                return app.helper.resolvePictureUrl(this.get('Image'));
            },
            User: function () {
                
                var userId = this.get('UserId');
                
                var user = $.grep(app.Users.users(), function (e) {
                    return e.Id === userId;
                })[0];
                
                return user ? {
                    DisplayName: user.DisplayName,
                    PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture)
                } : {
                    DisplayName: 'Anonymous',
                    PictureUrl: app.helper.resolveProfilePictureUrl()
                };
            },
            isVisible: function () {
                var currentUserId = app.Users.currentUser.data.Id;
                var userId = this.get('UserId');
                
                return currentUserId === userId;
            }
        };
        
        // Contacts data source. The Everlive dialect of the Kendo UI DataSource component
        // supports filtering, sorting, paging, and CRUD operations. 
        var contactsDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: contactModel
            },
            transport: {
                // Required by Everlive
                typeName: 'Contacts'
            },
            change: function (e) {
                
                if (e.items && e.items.length > 0) {
                    $('#no-activities-span').hide();
                } else {
                    $('#no-activities-span').show();
                }
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
        });
        
        return {
            contacts: contactsDataSource
        };
        
    }());

    // Tiles view model
    var contactsViewModel = (function () {
        
        // Navigate to tileView When some tile is selected
        var contactSelected = function (e) {
            app.mobileApp.navigate('views/contactView.html?uid=' + e.data.uid);
        };
        
        // Navigate to app home
        var navigateHome = function () {
            app.mobileApp.navigate('#welcome');
        };
 
        return {
            contacts: contactsModel.contacts,
            contactSelected: contactSelected 
        };
        
    }());
    
    return contactsViewModel;
    
}());
