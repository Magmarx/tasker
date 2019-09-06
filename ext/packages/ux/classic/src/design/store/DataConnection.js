/**
 * Created by Desar_6 on 15/12/2014.
 * @param  {[type]} 'Ext.ux.design.store.DataConnection' [description]
 * @return {[type]}                                       [description]
 */
Ext.define('Ext.ux.design.store.DataConnection', {
    extend: 'Ext.ux.data.store.DataConnection',
    groupField: 'group',
    proxy: {
        type: 'ajax',
        url: Ext.manifest.handler.connectionUtil,
        extraParams: {
            requestType: 'getConnectionList'
        },
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    }
});