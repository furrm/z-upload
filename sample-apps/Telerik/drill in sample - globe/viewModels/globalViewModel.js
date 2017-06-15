(function (global) {
    var GlobalViewModel,
        app = global.app = global.app || {};

    GlobalViewModel = kendo.data.ObservableObject.extend({
        continentDataSource: null,
        selectedContinent: null,

        onChange: function (e)
        {
            var that = this;

            app.continentViewModel.updateContinent(e.dataItem);
            //that.set("selectedContinent", e.dataItem);
        },
        
        init: function () {
            var that = this,
                dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            var everlive = new Everlive('SjPBBDYsPWQBEp7r');
            dataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "Continent"
                }
            });

            that.set("continentDataSource", dataSource);
            
            
        }
    });
    
    app.globalViewModel = new GlobalViewModel();
})(window);