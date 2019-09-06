Ext.define('Ext.ux.translate.store.Languages', {
    extend: 'Ext.data.Store',
    model: 'Ext.ux.translate.model.Language',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: Ext.manifest.handler.translateDesign,
        extraParams: {
            requestType: 'glt'
        },
        reader: {
            type: 'json'
        },
        listeners: {
            load: function(store, records, successful, eOpts) {
                console.log(records);
            },
            exception: function(that, response, operation) {
                console.log(response);
            }
        }
    }
});