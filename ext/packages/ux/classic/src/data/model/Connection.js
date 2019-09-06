/**
 * Created by Desar_6 on 11/12/2014.
 */
Ext.define('Ext.ux.data.model.Connection', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.ux.data.prototype.Proxy',
        'Ext.ux.data.prototype.Store',
        'Ext.data.Store'
    ],
    fields: ['name', 'description', 'group', 'type', 'user', 'password', 'initialCatalog', 'server', 'token', 'isDefaultConnection', {
        name: 'encrypted',
        type: 'boolean',
        default: false
    }, {
        name: 'usageList',
        convert: function(value, model) {
            if (value === '') {
                Ext.define('MPAConnectionUsageModel', {
                    extend: 'Ext.data.Model',
                    fields: ['name', 'type']
                });
                return new Ext.create('Ext.data.Store', {
                    model: 'MPAConnectionUsageModel',
                    proxy: {
                        type: 'memory',
                        reader: 'json'
                    }
                });
            } else {
                return value;
            }
        }
    }, {
        name: 'opened',
        type: 'boolean',
        default: 'true',
        convert: function(newValue, model) {
            if (model.get('token') !== '') {
                return true;
            }

            return false;
        }
    }, {
        name: 'action'
    }, {
        name: 'connection',
        convert: function(newValue, model) {
            if (newValue === '' || newValue === null || typeof newValue === 'undefined') {
                var id = model.get('storeId') || Ext.id(null, 'MPAConnection');
                return new Ext.create('Ext.ux.data.prototype.Proxy', {
                    storeId: id,
                    configParams: {
                        name: model.get('name'),
                        description: model.get('description'),
                        group: model.get('group'),
                        connectionType: model.get('type'),
                        user: model.get('user'),
                        password: model.get('password'),
                        initialCatalog: model.get('initialCatalog'),
                        server: model.get('server'),
                        encrypted: model.get('encrypted')
                    },
                    url: Ext.manifest.handler.connectionUtil,
                    token: model.get('token'),
                    type: model.get('type')
                });
            } else {
                return newValue;
            }
        }
    }]
});