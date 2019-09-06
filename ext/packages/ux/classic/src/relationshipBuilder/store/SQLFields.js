/**
 * Created by Desar_6 on 04/09/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.store.SQLFields', {
    extend: 'Ext.data.Store',
    autoSync: true,
    model: 'Ext.ux.relationshipBuilder.model.SQLFields',
    proxy: {
        type: 'memory'
    }
});