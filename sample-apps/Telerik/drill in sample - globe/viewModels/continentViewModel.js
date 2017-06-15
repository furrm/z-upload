(function (global) {
    var ContinentViewModel,
        app = global.app = global.app || {};

    ContinentViewModel = kendo.data.ObservableObject.extend({
        countryDataSource: null,
        //selectedCountry: null,
        continentModel: null,

        Name: function() {
            var that = this;
            return that.get("continentModel").Name;
        },
        
        Area: function() {
            var that = this;
            var area = that.get("continentModel").Area;
            
            return numberWithCommas(area*1000) + " km2";
        },

        Population: function() {
            var that = this;
            var population = that.get("continentModel").Population;
            
            return numberWithCommas(population*1000);
        },
        
        onChange: function (e) {
            var that = this;
            //console.log(JSON.stringify(e.dataItem));
            
            app.countryViewModel.updateCountry(e.dataItem);
            //that.set("selectedCountry", e.dataItem);
        },
        
        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            var everlive = new Everlive('SjPBBDYsPWQBEp7r');
            dataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "Country"
                },
                
                serverFiltering: true,
                //filter: {  field: "Name", operator: "startsWith", value: "C" },
                
				serverSorting: true,
                sort: { field: "Name", dir: "asc" }
            });

            that.set("countryDataSource", dataSource);
        },
        
        updateContinent: function(continent) {
            var that = this;
            
            that.set("continentModel", continent);
            var id = continent.Id;
            
            that.countryDataSource.filter( { 
                    field: "ContinentID",
                    operator: "eq",
                    value: id }
                );
            
            that.countryDataSource.read();
        },
        
    });

    app.continentViewModel = new ContinentViewModel();
})(window);