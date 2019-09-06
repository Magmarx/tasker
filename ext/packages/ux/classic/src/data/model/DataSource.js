/**
 * @author Desar_6 on 11/12/2014
 * @class Ext.ux.data.model.DataSource
 * @extends Ext.data.Model
 */
Ext.define('Ext.ux.data.model.DataSource', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.ux.data.prototype.Proxy',
        'Ext.ux.data.prototype.Store',
        'Ext.data.Store'
    ],
    fields: [{
        name: 'uuid',
        convert: function (value, record) {
            return value || Ext.guid();
        }
    }, {
        name: 'design',
        defaultValue: '{}'
    },
        'id',
        'uuidDesign', {
        name: 'loc',
        type: 'string'
    }, {
        name: 'tree',
        type: 'int',
        defaultValue: 1
    }, {
        name: 'order',
        type: 'int',
        defaultValue: 0
    },
        'name',
        'gridBinding',
        'params', {
        name: 'columnsStore',
        convert: function (newValue, model) {
            var params = model.get('params');

            var store = Ext.create('Ext.data.Store', {
                fields: ['dataIndex', 'alias', 'type', 'length',
                    {
                        name: 'encrypt',
                        defaultValue: "{}",
                        convert: function (value, model) {

                            return (Ext.isString(value)) ? Ext.JSON.decode(value) : value;
                        }
                    },
                    'validation', {
                        name: 'lookup',
                        convert: function (value) {
                            return value !== '' ? value : null;
                        }
                    }],
                proxy: {
                    type: 'memory',
                    reader: 'json'
                },
                getSerializedData: function () {
                    var data = [];
                    Ext.Array.each(store.data.items, function (column, index) {
                        Ext.Array.push(data, column.getData());
                    });
                    return data;
                }
            });
            if (params.columns) {

                var columns = typeof params.columns === 'string' ? Ext.JSON.decode(params.columns) : params.columns;
                store.loadData(columns);

            }
            return store;
        }
    },
        'proxy',
        'description',
        'instanceId',
    {
        name: 'isMainSource',
        convert: function (value) {
            return value !== '' ? value : false;
        }
    },
    {
        name: 'source',
        convert: function (newValue, model) {
            try {

                // get the new datastore name from the source name or create a generic name
                var Ex = Ext,
                    ExArray = Ex.Array;
                var id = model.get('name') || Ex.id(null, 'MPASource');
                var modelInstanceId = model.get('instanceId'),
                    isMainSource = model.get('isMainSource');
                var instanceId = modelInstanceId;

                // set the datastore name to the model
                model.set('name', model.get('name') || id);
                var params = model.get('params');
                var paramColumns = params.columns;
                var allColumns = typeof paramColumns === 'string' ? Ex.JSON.decode(paramColumns) : paramColumns;
                var columns = [];
                var keys = [];
                var globals = [];

                ExArray.each(allColumns, function (column) {
                    var columnClone = Ex.clone(column);
                    var globalValue = column.globalValue;
                    if (globalValue) {
                        if (globalValue.toUpperCase().indexOf('GLOBALPARAMS') > -1) {
                            var value = globalValue.replace('{{', '').replace('}}', '').replace(/'/g, '');
                            var tokens = value.split('.');
                            if (tokens.length) {
                                ExArray.push(globals, {
                                    dataIndex: column.dataIndex,
                                    globalParameter: tokens[2]
                                });
                            }
                        }
                    }
                    if (columnClone.fieldType === 'Form' || columnClone.fieldType === 'Both') {
                        if (columnClone.key === 'primary') {
                            ExArray.push(keys, columnClone.dataIndex);
                        }
                        columnClone.labelName = column.alias;
                        delete columnClone.alias;
                        ExArray.push(columns, columnClone);
                    }
                });

                var proxyObject = model.get('proxy');
                var token = proxyObject.token;
                var type = proxyObject.type;
                var url = proxyObject.url;

                for (var param in params) {
                    if (params.hasOwnProperty(param)) {
                        if (typeof params[param] === 'object') {
                            params[param] = Ex.JSON.encode(params[param]);
                        }
                    }
                }

                model.set('params', params);
                // create a connection proxy from the meta data from the model, this connection is the same created in the
                // connection dialog
                var newProxyInstance = new Ex.create('Ext.ux.data.prototype.Proxy', {
                    token: token,
                    type: '',
                    url: url
                });
                var modelId = Ex.id(null, id + '-genericModel'),
                    // columnStore = model.get('columnsStore')
                    // record internal unique identifier
                    // additionalColumns = [];
                    additionalColumns = [];
                // lookups columns additional with postfix "$$"
                var copyColumns = [];
                var enColumns = [];
                ExArray.each(columns, function (column, index) {
                    var temp = Ext.clone(column);
                    if (Ext.isString(column.encrypt)) {
                        column.encrypt = Ext.JSON.decode(column.encrypt);
                    }
                    if (!Ext.Object.isEmpty(column.encrypt)) {
                        Ext.Array.push(enColumns, column.dataIndex);
                        column.isEncripted = true;
                    }
                    temp.type = temp.dataType;
                    copyColumns.push(temp);

                    if (column.lookup) {
                        ExArray.push(additionalColumns, {
                            dataIndex: column.dataIndex + '$$',
                            name: column.name + '$$',
                            alias: column.dataIndex,
                            type: column.dataType,
                            length: column.length
                        });
                    }
                });

                Ex.define(modelId, {
                    extend: 'Ext.data.Model',
                    fields: (additionalColumns.length) ? ExArray.merge(copyColumns, additionalColumns) : copyColumns
                });

                // create the new datastore from the prototype using the current active connection and the other parameters
                var parameterManager = Ext.getStore('parameterManager' + instanceId.replace(/-/g, ''));

                var store = Ext.create('Ext.ux.data.prototype.Store', {
                    storeId: 'dynamicSource-' + model.get('name'),
                    name: id,
                    model: modelId,
                    instanceId: instanceId,
                    columns: columns,
                    encryptedColumns: enColumns,
                    keyColumns: keys,
                    context: parameterManager.context,
                    globalColumns: globals,
                    remoteFilter: true,
                    remoteSort: true,
                    isMainSource: model.get('isMainSource'),
                    proxy: newProxyInstance,
                    proxyPrototype: proxyObject,
                    params: model.get('params'),
                    uuidDesign: model.get('uuidDesign'),
                    uuidDatamanager: model.get('uuid'),
                    sourceParameterName: (model.get('isMainSource')) ? 'MainDesign' : model.get('name'),
                    getModelName: function () {
                        return modelId;
                    }
                });

                store.on('add', store.updateInternalParameters);
                store.on('load', store.updateInternalParameters);

                /**
                 * function to handle the remotely triggered event on the proxy when the application gets the connection token for the current
                 * proxy, this function performs a data load with the new token.
                 *
                 * In this case we need to declare this variable to remove the handler when this record was deleted.
                 * @param scope {object} context where the event is triggered
                 * @param callback {function} callback to invoke when the load method was completed
                 */
                var connectionOpenedFunction = function (scope, callback) {
                    if (callback) {
                        store.load({
                            scope: scope || this,
                            callback: callback
                        });
                    } else {
                        store.load();
                    }
                }; // set the handler to the event connectionopened to update the proxy in all the bounded stores

                var connectionChangedFunction = function (scope, callback) {
                    if (callback) {
                        store.load({
                            scope: scope || this,
                            callback: callback
                        });
                    } else {
                        store.load();
                    }
                }; // set the handler to the event connectionchanged to update the proxy in all the bounded stores

                proxyObject.on('connectionchanged', connectionChangedFunction);
                store.removeHandlers = function () {
                    proxyObject.un('connectionopened', connectionOpenedFunction);
                    proxyObject.un('connectionchanged', connectionChangedFunction);
                };

                return store;
            } catch (e) {
                //<debug>

                console.error('DataSource', e.message);
                //</debug>
                return null;
            }
        }
    }
    ]
});