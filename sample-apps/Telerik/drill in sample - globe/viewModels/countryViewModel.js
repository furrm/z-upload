(function (global) {
    var CountryViewModel,
        app = global.app = global.app || {};

    CountryViewModel = kendo.data.ObservableObject.extend({
        cityDataSource: null,
        selectedCity: null,
        parentCountry: null,

        onChange: function (e)
        {
            selectedCity = e.dataItem;
        },
        
        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            var everlive = new Everlive('SjPBBDYsPWQBEp7r');
            dataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "City"
                },
                
				serverSorting: true,
                sort: { field: "Name", dir: "asc" }
            });

            //serverFiltering: true,
            that.set("cityDataSource", dataSource);
        }, 
        
        updateCountry: function(country) {
            var that = this;
            
            that.set("parentCountry", country);
            var id = country.Id;
            
            that.cityDataSource.filter( { 
                    field: "CountryID",
                    operator: "eq",
                    value: id }
                );
            
            that.cityDataSource.read();
        }
    });

    app.countryViewModel = new CountryViewModel();
})(window);