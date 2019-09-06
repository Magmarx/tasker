/**
 * @author DELL on 30/01/2015.
 * @class Ext.ux.data.store.Help
 * @extends Ext.data.Store
 */
Ext.define('Ext.ux.data.store.Help', {
    extend: 'Ext.data.Store',
    model: 'Ext.ux.data.model.Help',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    setSerializedData: function(data) {
        if (typeof data === 'string') {
            data = Ext.decode(data);
        }

        this.removeAll();
        this.loadData(data);
    }
});