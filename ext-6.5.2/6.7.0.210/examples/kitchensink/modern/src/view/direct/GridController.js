Ext.define('KitchenSink.view.direct.GridController', {
    extend: 'KitchenSink.view.direct.BaseController',
    alias: 'controller.direct-grid',

    finishInit: function() {
        var grid = this.lookup('grid'),
            store = grid.getStore();

        store.load();
    },

    onTableChange: function(combo, newValue) {
        if (newValue) {
            var grid = this.lookup('grid'),
                store = grid.getStore();

            store.getProxy().setMetadata({
                table: newValue
            });

            store.load();
        }
    }
});
