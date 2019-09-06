/**
 * @author Desar_6 on 15/12/2014
 * @class Ext.ux.data.store.DataConnection
 * @extends Ext.data.Store
 */
Ext.define('Ext.ux.data.store.DataConnection', {
    extend: 'Ext.data.Store',
    id: 'DataConnectionStore',
    model: 'Ext.ux.data.model.Connection',
    uuidTokenManager: null,
    uuidDesign: null,
    proxy: {
        type: 'ajax',
        url: Ext.manifest.handler.connectionUtil,
        extraParams: {
            requestType: 'getConnectionList'
        },
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },
    /**
     * @method clearUsageLists
     * @param  {String}        listType [description]
     * @param  {Function}      callback [description]
     * @private
     */
    clearUsageLists: function(listType, callback) {
        var me = this;
        Ext.Array.each(me.data.items, function(item) {
            /**
             * Es un store, proposito desconocido
             * @type {Ext.data.Store}
             */
            var usageList = item.get('usageList');

            var removeList = [];

            usageList.queryBy(function(record) {
                if (record.get('type') === listType) {
                    Ext.Array.push(removeList, record);
                }
            });

            usageList.remove(removeList);
        });

        if (callback) {
            // TODO: validar por que es necesario un callback :/
            callback();
        }
    },
    /**
     *  Loads from serialized string configuration of the data sources, find the proper
     *  proxy for the store, and reconstruct the cloud storage to the last stage.
     * @param serializedData {string} serialized source configuration string
     * @returns {boolean} true: successfully loaded, false: fail loaded
     */
    loadSerializedData: function(serializedData, callback) {
        var me = this;
        try {
            if (Ext.isString(serializedData)) {
                serializedData = Ext.decode(serializedData);
            }
            // TODO: validar que es esto y por que esta inicializado como true
            var notDataCorrupted = true;
            // serializedData puede venir null|false|undefined ? :/
            if (serializedData) {
                // Limpia data, si vienen datos duplicados, (la duplicacion es posible :/ ? por que)
                serializedData = Ext.Array.unique(serializedData);

                // Por que validar esto ?
                if (notDataCorrupted) {
                    // Limpia toda la data del store
                    me.removeAll();
                    var afteradd = function() {
                        me.un('add', afteradd);
                        if (callback) callback();
                    };

                    me.on('add', afteradd);
                    me.add(serializedData);

                    if (serializedData.length) {
                        me.setUuidTokenManager(serializedData[0].uuid, false);
                    }

                    return true;
                } else {
                    Ext.Notify.msg('<b>' + Ext.localization.dataConnectionStore.loadSerializedData.configurationLoadFailureTitle + '</b>: ' +
                        '  <cite>' + Ext.localization.dataConnectionStore.loadSerializedData.configurationLoadFailure + '</cite>', {
                            layout: 'topright',
                            delay: 5000,
                            type: 'error'
                        });

                    return false;
                }
            } else {
                if (callback) {
                    callback();
                }
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    },
    /**
     * [openAllConnections description]
     * @method openAllConnections
     * @param  {[type]}           masked [description]
     * @param  {[type]}           opts   [description]
     * @return {[type]}                  [description]
     */
    openAllConnections: function(masked, opts) {
        var me = this,
            Ex = Ext,
            Elocale = Ex.localization,
            EArray = Ex.Array,
            totalConnections = this.getCount(),
            afterConnectionCallback = opts ? opts.callback : Ext.emptyFn,
            silent = opts ? opts.silent : false;

        me.openedConnection = 0;
        me.successOpenProccess = true;

        if (me.data.items.length > 0) {
            EArray.each(me.data.items, function(item, index) {
                var connection = item.data.connection;
                if (connection) {
                    if (connection.token === '') {
                        connection.openConnection(item, function(success) {
                            me.openedConnection++;
                            me.successOpenProccess = me.successOpenProccess * success;
                            if (me.successOpenProccess) {
                                item.data.opened = true;
                                item.commit();
                            } else {
                                Ex.Msg.alert(Elocale.apiName, Elocale.dataConnectionStore.openAllConnections.someConnectionNotOpened);
                            }

                            if (me.getCount() === me.openedConnection) {
                                var callback = function() {
                                    me.fireEvent('afterconnectionopened');
                                };

                                connection.fireEvent('connectionopened', me, callback);
                                if (afterConnectionCallback) {
                                    afterConnectionCallback();
                                }

                                if (masked) {
                                    Ex.getCmp(masked).close();
                                }
                            } else {
                                connection.fireEvent('connectionopened', me);
                            }
                        }, silent);
                    } else {
                        item.data.opened = true;
                        me.openedConnection++;
                        item.commit();
                        if (me.getCount() === me.openedConnection) {
                            var callback = function() {
                                me.fireEvent('afterconnectionopened');
                            };

                            connection.fireEvent('connectionopened', me, callback);
                            if (afterConnectionCallback) {
                                afterConnectionCallback();
                            }
                            if (masked) {
                                Ex.getCmp(masked).close();
                            }
                        } else {
                            connection.fireEvent('connectionopened', me);
                        }
                    }
                }
            });
        } else {
            if (masked) {
                Ext.getCmp(masked).close();
            }
            if (afterConnectionCallback) {
                afterConnectionCallback();
            }
        }
    },
    /**
     * [openSingleConnection description]
     * @method openSingleConnection
     * @param  {[type]}             name   [description]
     * @param  {[type]}             masked [description]
     * @return {[type]}                    [description]
     */
    openSingleConnection: function(name, masked) {
        var me = this;
        var record = me.findRecord('name', name, 0, false, false, true);
        if (record) {
            record.data.connection.openConnection(record, function(success) {
                if (success) {
                    record.data.opened = true;
                    record.commit();
                    var callback = function() {
                        me.fireEvent('afterconnectionopened');
                    };

                    record.data.connection.fireEvent('connectionopened', me, callback);
                }
                if (masked) {
                    Ext.getCmp(masked).close();
                }
            });
        }
    },
    /**
     * [cloneConnectionFromRecord description]
     * @method cloneConnectionFromRecord
     * @param  {[type]}                  model [description]
     * @return {[type]}                        [description]
     */
    cloneConnectionFromRecord: function(model) {
        var id = typeof model !== 'undefined' ? model.get('storeId') : Ext.id(null, 'MPAConnection');
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
    },
    /**
     * [setUuidTokenManager description]
     * @method setUuidTokenManager
     * @param  {[type]}            uuid [description]
     * @param  {[type]}            load [description]
     */
    setUuidTokenManager: function(uuid, load) {
        var me = this;
        if (uuid && typeof uuid === 'string' && me.uuidTokenManager !== uuid) {
            me.uuidTokenManager = uuid;
            me.proxy.extraParams.uuidTokenManager = uuid;
        }

        if (load && me.uuidTokenManager) {
            me.load();
        }
    },
    /**
     * [getUuidTokenManager description]
     * @method getUuidTokenManager
     * @return {[type]}            [description]
     */
    getUuidTokenManager: function() {
        return this.uuidTokenManager;
    },
    /**
     * [getConnectionByToken description]
     * @method getConnectionByToken
     * @param  {[type]}             token [description]
     * @return {[type]}                   [description]
     */
    getConnectionByToken: function(token) {
        return this.findRecord('token', token, false, false, false, true);
    }
});