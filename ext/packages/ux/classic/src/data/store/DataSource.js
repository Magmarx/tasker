/**
 * @author Desar_6 on 11/12/2014
 * @class Ext.ux.data.store.DataSource
 * @extends Ext.data.Store
 */
Ext.define('Ext.ux.data.store.DataSource', {
    extend: 'Ext.data.Store',
    // id: 'DataSourceStore',
    model: 'Ext.ux.data.model.DataSource',
    requires: ['Ext.ux.data.util.AjaxCrud'],
    autoLoad: false,
    /**
     * @config {Array} descriptors  `[]` record descriptors
     */
    descriptors: [],
    /**
     * @config {Array} equivalentKey  `[]` related record configuration
     */
    equivalentKey: [],
    /**
     * @config {Ext.data.Model} recordData  `null` parent record
     */
    confidenceLevel: null,
    parentRecord: null,
    groupField: 'group',
    loadStack: null,
    keyNames: ['primary', 'foreign', 'both'],
    typeField: ['Form', 'Both'],
    excludeProperties: [
        'UUIDMODULE',
        'UUIDORGANIZATIONNODE'
        //  'UUIDLANGUAGE'
    ],
    sorters: [
        {
            property: 'order',
            direction: 'ASC'
        }
    ],
    instanceMode: '',
    historicalParams: {
        records: null,
        actionName: '',
        comment: ''
    },
    uuidMenu: '',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        simpleSortMode: true,
        filterParam: 'name',
        encodeFilters: function(filters) {
            return filters[0].value;
        }
    },

    /**
     * runs a batch data load of all the sources to enter on the preview or release mode.
     * had completed the load request
     * @method loadAllData
     * @param {Boolean} synchronous this flag is optional if we want this method to fire an event when all the dataSources
     */
    loadAllData: function(synchronous) {
        var me = this,
            stackRequest = 1,
            stackLoaded = 0;

        if (!me.loadStack) {
            me.loadStack = me.mapSources();
        }

        /**
         * @method callback
         * @param  {Ext.data.Model} records   [description]
         * @param  {Ext.data.operation.Operation} operation [description]
         * @param  {Bolean} success   [description]
         * @return {Function}
         */
        var callback = function(records, operation, success) {
            var currentStore = this;
            if (success) {
                stackLoaded++;

                if (records.length) {
                    Ext.Array.each(currentStore.childs, function(store) {
                        stackRequest++;
                        store.load({
                            scope: store,
                            callback: callback
                        });
                    });
                }

                if (synchronous) {
                    /**
                     * @event sourceloaded
                     * Fires when source store item is loaded
                     * @param {Ext.ux.data.store.DataSource} me
                     * @param {String} sourceName
                     * @param {Ext.ux.data.prototype.Store} sourceStore
                     * @param {Boolean} isMainSource
                     */
                    if (stackRequest === stackLoaded) {
                        me.history({
                            action: 'view',
                            // confidenceLevel: me.confidenceLevel,
                            callback: function() {
                                me.fireEvent('sourceloaded', me, currentStore.name, currentStore, currentStore.isMainSource);
                            }
                        });
                    }
                }
            }
        };

        me.loadSourceById(me.loadStack.map.name, callback);
        me.lazyLoadSources(false);
    },
    /**
     * @method loadSourceById
     * @param  {string}       sourceName nombre del store a cargar
     * @param  {Function}     callback   funcion de respuesta al cargar el store
     */
    loadSourceById: function(sourceName, callback) {
        var sourceStore = this.getSourceStoreByName(sourceName);
        if (sourceStore) {
            sourceStore.load({
                scope: sourceStore,
                callback: callback
            });
        }
    },
    /**
     * lazyLoadSources
     * @param {Boolean} synchronous  `false` lanza el evento de carga cuando se completen todas las peticiones
     */
    lazyLoadSources: function(synchronous) {
        var me = this,
            stackRequest = 0,
            stackLoaded = 0;

        if (me.loadStack.lazyLoading.length) {
            var callback = synchronous
                ? function(records, operation, success) {
                    var currentStore = this;
                    //<debug>
                    if (!success) {
                        var response = operation.getResponse();
                        var responseText = Ext.JSON.decode(response.responseText);
                        var message = responseText.msg;

                        console.error('MPA - DataSource', {
                            uuidDatamanager: currentStore.uuidDatamanager,
                            message: message
                        });
                    }
                    //</debug>

                    stackLoaded++;
                    /**
                       * @event sourceloaded
                       * Fires when source store item is loaded
                       * @param {Ext.ux.data.store.DataSource} me
                       * @param {String} sourceName
                       * @param {Ext.ux.data.prototype.Store} sourceStore
                       * @param {Boolean} isMainSource
                       */
                    if (stackRequest === stackLoaded) {
                        me.fireEvent('sourceloaded', me, currentStore.name, currentStore, currentStore.isMainSource);
                    }
                }
                : Ext.emptyFn;

            Ext.Array.each(me.loadStack.lazyLoading, function(name) {
                stackRequest++;
                me.loadSourceById(name, callback);
            });
        } else {
            if (synchronous) {
                me.fireEvent('sourceloaded', me);
            }
        }
    },
    /**
     * @method mapSources map  relationship sources.
     * @return {type} loadStack `{}` load stack
     * @private
     */
    mapSources: function() {
        var me = this,
            context = me.context,
            relationshipJoinStore = context.relationshipStore;

        me.loadStack = relationshipJoinStore.getLoadStack();

        var applyMap = function(map) {
            var childs = [],
                parentStore = me.getSourceStoreByName(map.name),
                childStore;
            for (var index = 0; index < map.childs.length; index++) {
                var _map = map.childs[index];
                childStore = me.getSourceStoreByName(_map.name);
                if (childStore) {
                    childs.push(childStore);
                }
                applyMap(_map);
            }
            if (childs.length) {
                parentStore.childs = childs;
            }
        };
        applyMap(me.loadStack.map);

        return me.loadStack;
    },
    /**
     * @method createNewRowsForAll
     * @param  {[type]}            synchronous [description]
     * @return {[type]}                        [description]
     */
    createNewRowsForAll: function(synchronous) {
        var me = this,
            context = me.context,
            relationshipJoinStore = context.relationshipStore;

        if (!me.loadStack) {
            me.loadStack = me.mapSources();
        }

        var totalSourcesCount = me.loadStack.cascade.length || me.data.items.length;

        if (totalSourcesCount) {
            var sourceRecord = me.findRecord('isMainSource', true, 0, 0, 0, 1);
            var sourceStore = sourceRecord ? sourceRecord.get('source') : null;
            if (sourceStore) {
                sourceStore.removeRecords();
                sourceStore.addEmptyRow(function(record) {
                    if (synchronous) {
                        me.lazyLoadSources(true);
                    } else {
                        me.fireEvent('sourceloaded', me, sourceStore.name, sourceStore, sourceStore.isMainSource);
                    }
                });
            }
        }
    },

    /**
     * @method unloadAllData
     * @param  {[type]}      synchronous [description]
     * @return {[type]}                  [description]
     */
    unloadAllData: function(synchronous) {
        Ext.Array.each(this.data.items, function(item) {
            if (item.data.source) {
                item.data.source.removeAll();
            }
        });

        if (synchronous) {
            // TODO: validar evento
            this.fireEvent('alldataunloaded');
        }
    },
    /**
     * @method verifySourceChanges
     * @param  {[type]}            synchronous [description]
     * @return {[type]}                        [description]
     */
    verifySourceChanges: function(synchronous) {
        var hasChanged = false;

        Ext.Array.each(this.data.items, function(item) {
            if (item.data.source) {
                var modified = item.data.source.getModifiedRecords();
                Ext.Array.each(modified, function(row) {
                    hasChanged = Object.keys(row.modified).length > 0;
                });
            }
        });

        if (synchronous) {
            this.fireEvent('changesVerified', hasChanged);
        }
    },
    /**
     * @method getFieldValueBySourceAndName
     * @param  {[type]}                     source [description]
     * @param  {[type]}                     name   [description]
     * @return {Object|Null}                            [description]
     */
    getFieldValueBySourceAndName: function(source, name) {
        try {
            var sourceRecord = this.findRecord('name', source, 0, false, false, true).data.source;
            if (sourceRecord.getCount()) {
                return sourceRecord.getAt(0).data[name];
            }

            return null;
        } catch (e) {
            Ext.log({
                msg: e.message,
                level: 'warn',
                dump: e,
                indent: 1,
                stack: true
            });

            return null;
        }
    },
    /**
     * @method getSourceFirstRowBySourceName
     * @param  {[type]}                      source [description]
     * @return {[type]}                             [description]
     */
    getSourceFirstRowBySourceName: function(source) {
        try {
            var sourceRecord = this.findRecord('name', source, 0, false, false, true).data.source;
            if (sourceRecord.getCount()) {
                return sourceRecord.getAt(0);
            } else {
                return sourceRecord.addEmptyRow();
            }
        } catch (e) {
            Ext.log({
                msg: e.message,
                level: 'warn',
                dump: e,
                indent: 1,
                stack: true
            });

            return null;
        }
    },
    /**
     * @method getSourceRecordBySourceName
     * @param  {[type]}                    sourceConfig [description]
     * @return {[type]}                                 [description]
     */
    getSourceRecordBySourceName: function(sourceConfig) {
        var sourceRecord = this.findRecord('name', sourceConfig.name, 0, false, false, true);
        return sourceRecord ? sourceRecord.data.source : null;
    },
    /**
     * @method getFieldRecordBySourceAndName
     * @param  {[type]}                      source [description]
     * @param  {[type]}                      name   [description]
     * @return {[type]}                             [description]
     */
    getFieldRecordBySourceAndName: function(source, name) {
        var sourceRecord = this.findRecord('name', source, 0, false, false, true);
        if (sourceRecord) {
            var fieldStore = sourceRecord.get('columnsStore');
            return fieldStore.findRecord('dataIndex', name, 0, false, false, true);
        }

        return null;
    },
    /**
     * @method bindValue
     * @param  {universalfield}  field       editor de diseño MPA
     * @param  {Object}  sourceConfig configuracion de la fuente y la configuracion inicial del editor a vincular
     * @return {[type]}               [description]
     */
    bindValue: function(field, sourceConfig) {
        var me = this;
        var binding = false;
        var storeRecord = me.findRecord('name', sourceConfig.name, 0, false, false, true);
        if (!sourceConfig.record) {
            sourceConfig.record = me.getSourceFirstRowBySourceName(sourceConfig.name);
        }
        if (field.configData) {
            field.configData.sourceConfig.record = sourceConfig.record;
        }
        if (storeRecord) {
            var flushChangesToRecord = function(bindedObject, value) {
                var currentRecord = sourceConfig.record;

                if (currentRecord) {
                    currentRecord.set(sourceConfig.dataIndex, value);
                }
            };

            var fieldValueBySourceAndName = sourceConfig.record
                ? sourceConfig.record.get(sourceConfig.dataIndex)
                : me.getFieldValueBySourceAndName(sourceConfig.name, sourceConfig.dataIndex);

            if (!Ext.isEmpty(fieldValueBySourceAndName)) {
                if (field.rendered) {
                    field.setValue(fieldValueBySourceAndName);
                } else {
                    field.on('afterrender', function() {
                        field.setValue(fieldValueBySourceAndName);
                    });
                }
            }

            field.on('change', flushChangesToRecord, field);
            binding = true;
        }
        return binding;
    },
    /**
     * @method wipeDataStore
     */
    wipeDataStore: function() {
        this.removeAll();
    },
    /**
     * Myax:  return minimal properties based on  columns list
     * @method getSimpleColumns
     * @param {Object} columsConfig Array of columns with field configuration
     * @return {Object} columns
     */
    getSimpleColumns: function(columsConfig) {
        columsConfig = columsConfig || [];

        var data = [],
            columnProp = {};

        if (columsConfig.length) {
            Ext.Array.each(columsConfig, function(column, index) {
                columnProp = {
                    dataIndex: column.dataIndex,
                    length: column.length,
                    fieldType: column.fieldType,
                    type: column.type,
                    key: column.key,
                    value: column.value
                };
                if (!Ext.Object.isEmpty(column.encrypt)) {
                    column.encrypt.uuid = Ext.guid();
                    columnProp.encrypt = column.encrypt;
                }
                Ext.Array.push(data, columnProp);
            });
        }

        return data;
    },
    /**
     * Myax: save new  main source record and if exist other sources  execute same action
     * @method batchCreateSources
     * @param {Object} arguments
     */
    batchCreateSources: function(args) {
        var me = this;
        me.getBatchPackage(args);

        // // flag boolean
        // if (args.createAnother) {
        //     // created new records on all sources
        //     me.createNewRowsForAll(false);
        //     // me.on("alldataunloaded", function () {
        //     // }, me, { single: true });

        //     // me.unloadAllData(true);
        // }
    },
    /**
     * @method batchUpdateSources
     * @param  {[type]}           args [description]
     */
    batchUpdateSources: function(args) {
        this.getBatchPackage(args);
    },

    /**
     * Myax: colect all records data by all sources.
     * @method getBatchPackage
     * @param {Object} args
     * @return {[type]}             [description]
     */
    getBatchPackage: function(args) {
        try {
            var me = this,
                successCallback = args.success || Ext.emptyFn,
                failureCallback = args.failure || Ext.emptyFn,
                defaultCallback = args.callback || Ext.emptyFn,
                // saveHistoricalCallback = args.historical || Ext.emptyFn,
                noChanges = args.noChanges || Ext.emptyFn,
                loadStack = me.loadStack,
                /**
                 * esta bandera permite validar toda la configuracion del diseño y determinar si existen datos por guardar.
                 */
                check = args.check || false,
                batchParams = {
                    uuidToken: Ext.connectionToken,
                    execute: []
                };

            var batchSourcesArray = [],
                getRecordsBySource = function(item) {
                    var param = item.get('params') || {};
                    //myax: las fuentes de tipo vista no se generan para modificacion actualizacion o eliminacion :D
                    if (param.targetType !== 'V') {
                        // get source and records associated to specific action ['new','update', 'removed']
                        var itemSource = item.get('source'),
                            modifiedRecords = itemSource.getUpdatedRecords() || [],
                            createdRecords = itemSource.getNewRecords() || [],
                            removedRecords = itemSource.getRemovedRecords() || [];
                        // find source fields and get simple column definition.
                        var sourceProxyToken = itemSource.proxy.token,
                            itemParams = typeof item.get('params') === 'string' ? Ext.decode(item.get('params')) : item.get('params'),
                            _itemColumns = typeof itemParams.columns === 'string' ? Ext.decode(itemParams.columns) : itemParams.columns,
                            itemColumns = me.getSimpleColumns(_itemColumns);
                        // set new object with source properties
                        var sourceBatch = {
                            targetType: itemParams.targetType,
                            targetName: itemParams.targetName,
                            tree: item.get('tree'),
                            order: item.get('order'),
                            isMainSource: item.get('isMainSource'),
                            columns: itemColumns,
                            records: [],
                            uuidBridge: sourceProxyToken
                        };

                        if (removedRecords.length > 0) {
                            Ext.Array.each(removedRecords, function(record) {
                                Ext.Array.push(sourceBatch.records, me.getRecordDefinition(record, itemColumns, 'removed'));
                            });
                        }

                        if (createdRecords.length) {
                            Ext.Array.each(createdRecords, function(record) {
                                Ext.Array.push(sourceBatch.records, me.getRecordDefinition(record, itemColumns, 'created'));
                            });
                        }

                        if (modifiedRecords.length) {
                            Ext.Array.each(modifiedRecords, function(record, index) {
                                Ext.Array.push(sourceBatch.records, me.getRecordDefinition(record, itemColumns, 'modified'));
                            });
                        }

                        // if source not contains records definition not add to package  sources
                        if (sourceBatch.records.length) {
                            Ext.Array.push(batchSourcesArray, sourceBatch);
                        }
                    }
                };

            loadStack = Ext.clone(me.loadStack);
            //Myax: exclude lookup sources  ==>  Ext.Array.push(loadStack.cascade.reverse(), loadStack.lazyLoading);
            loadStack.cascade.reverse();
            var sourceRecord;

            Ext.Array.each(loadStack.cascade, function(sourceName, index) {
                sourceRecord = me.getSourceByName(sourceName);
                if (sourceRecord) {
                    getRecordsBySource(sourceRecord);
                }
            });
            if (check) {
                noChanges(batchSourcesArray.length);
            } else {
                if (batchSourcesArray.length) {
                    batchParams.execute = args.reverseSources ? batchSourcesArray.reverse() : batchSourcesArray;
                    // send package of sources to request
                    me.sendBachSource(
                        {
                            // saveHistoricalCallback: saveHistoricalCallback,
                            historicalParams: me.historicalParams
                        },
                        {
                            jsonData: batchParams,
                            success: successCallback,
                            failure: failureCallback,
                            callback: defaultCallback
                        }
                    );
                } else {
                    noChanges(true);
                }
            }
        } catch (e) {
            Ext.log({
                msg: e.message,
                level: 'warn',
                dump: e,
                indent: 1,
                stack: true
            });
        }
    },
    /**
     * @method convertValue description
     * @param {Ext.data.Model} record  `{}` current record
     * @param {Object | column} column  `{}` column configuration
     * @return {Object} value `''` description
     * @private
     */
    convertValue: function(record, column) {
        var value = record.get(column.dataIndex);

        switch (column.type) {
            //     Case 0, 2 'string
            //         result = "string"
            //     Case 1, 6 'numeric
            //         result = "float"
            //     Case 3 'date
            //         result = "date"
            //     Case 4 'image
            //         result = "image"
            //     Case 5 'time
            //         result = "time"
            //     Case 7 'money
            //         result = "float"
            //     Case 15 'boolean
            //         result = "boolean"
            //     Case Else
            //         result = "string"
            // End Select
            case 3:
            case 10:
                column.type = 0;
                break;
            case 15:
                value = value ? 1 : 0;
                break;
        }
        return value;
    },
    /**
     * pushProperty push object on array
     * @private
     */
    addItem: function(list, item) {
        if (!Ext.Object.isEmpty(item.encrypt)) {
            var resp = Ext.AES.encrypt(item.value, item.encrypt.uuid);
            item.value = resp.value;
        }
        delete item.encrypt;

        Ext.Array.push(list, item);
    },

    /**
     * @method getRecordDefinition
     * Myax: return object whit record configuration properties e.g.   dataindex, value, type and more.
     * @param {Ext.data.Model} record
     * @param {Object} columnList list register to source with properties e.g. column.key = primary || foreign || other
     * @param {String} actionName this string set as property to new object return
     * @return {Object} record definition with property especificly same action mane
     */
    getRecordDefinition: function(record, columnList, actionName) {
        var data = {};
        if (actionName) {
            var me = this,
                itemKeys = [],
                modifiedColumns = record.modified || {},
                modifiedKeys = [],
                otherKeys = [],
                columnAux = null;

            Ext.Array.each(columnList, function(column) {
                columnAux = Ext.clone(column);

                // asign current value on current record.

                columnAux.value = me.convertValue(record, columnAux);

                if (Ext.Array.contains(me.keyNames, columnAux.key)) {
                    if (actionName == 'modified') {
                        if (modifiedColumns.hasOwnProperty(columnAux.dataIndex)) {
                            Ext.Array.push(modifiedKeys, {
                                dataIndex: columnAux.dataIndex,
                                value: columnAux.value,
                                type: columnAux.type,
                                length: columnAux.length,
                                fieldType: columnAux.fieldType,
                                key: columnAux.key
                            });
                            // asign old value but this used to conditions on backend
                            columnAux.value = modifiedColumns[columnAux.dataIndex];
                        }
                    }
                    // add column definition to keys array
                    me.addItem(itemKeys, columnAux);
                } else {
                    if (modifiedColumns.hasOwnProperty(columnAux.dataIndex) && Ext.Array.contains(me.typeField, column.fieldType)) {
                        me.addItem(modifiedKeys, columnAux);
                    } else {
                        // solve others fields without type available to edit on souce definition
                        me.addItem(otherKeys, columnAux);
                    }
                }
            });
            data.keys = itemKeys;
            data[actionName] = actionName == 'created' ? Ext.Array.merge(modifiedKeys, otherKeys) : modifiedKeys;
        }

        return data;
    },
    /**
     * @method batchRemoveSources
     * @param  {[type]}           args [description]
     */
    batchRemoveSources: function(args) {
        var me = this,
            mainSourceRecord = me.findRecord('isMainSource', true, 0, 0, 0, 1);
        if (mainSourceRecord) {
            var mainSourceStore = mainSourceRecord.get('source');
            me.removeCascadeSource(mainSourceStore);
            args.reverseSources = true;
            me.getBatchPackage(args);
        }
    },
    removeCascadeSource: function(source) {
        if (source.childs.length) {
            for (var index = 0; index < source.childs.length; index++) {
                var sourceChild = source.childs[index];
                this.removeCascadeSource(sourceChild);
            }
            if (source.params.targetType === 'T') {
                source.removeAll();
            }
        } else {
            if (source.params.targetType === 'T') {
                source.removeAll();
            }
        }
    },
    /**
     * @method getSourceById
     * @param  {String} uuidDatamanager datamanager id
     */
    getSourceById: function(uuidDatamanager) {
        if (uuidDatamanager) {
            var sourceRecord = this.findRecord('uuid', uuidDatamanager, 0, 0, 0, 1),
                source = sourceRecord ? sourceRecord.get('source') : null;
            return source;
        }
        return null;
    },
    /**
     * Myax: find source exact match source name.
     * @method getSourceByName
     * @param {String} sourceName
     * @return {Ext.data.Store} source | null;
     */
    getSourceByName: function(sourceName) {
        if (!sourceName) {
            return null;
        }

        var me = this,
            recordIndex = me.findExact('name', sourceName, 0),
            sourceRecord = recordIndex != -1 ? me.getAt(recordIndex) : null;

        return sourceRecord;
    },
    /**
     * @method getSourceStoreByName current source store
     * @param {String} sourceName  `''` source store name.
     * @return {Ext.data.Store} store `default` description
     * @private
     */
    getSourceStoreByName: function(sourceName) {
        var sourceRecord = this.getSourceByName(sourceName);
        return sourceRecord ? sourceRecord.get('source') : null;
    },
    /**
     * Loads from serialized string configuration of the data sources, find the proper
     * proxy for the store, and reconstruct the cloud storage to the last stage.
     * @method loadSerializedData
     * @param {String} serializedData source configuration string
     * @param {Function} callback function invoked after finished all the previous steps
     * @param {String} instanceId
     * @returns {Boolean} true: successfully loaded, false: fail loaded
     */
    loadSerializedData: function(serializedData, callback, instanceId) {
        var me = this,
            context = me.context;
        me.instanceId = instanceId;

        try {
            if (typeof serializedData === 'string') {
                serializedData = Ext.decode(serializedData);
            }

            if (serializedData && serializedData.length > 0) {
                var connectionStore = context.connectionStore;
                var notDataCorrupted = true;
                var failSource = [];

                Ext.Array.each(serializedData, function(data) {
                    data.params.isMainSource = data.isMainSource;
                    data.instanceId = instanceId;
                    data.uuidDesign = me.uuidDesign;
                    var proxyName = data.proxy;
                    var proxyRecord = connectionStore.findRecord('name', proxyName, 0, false, false, true);

                    if (proxyRecord) {
                        data.proxy = proxyRecord.data.connection;
                    } else {
                        notDataCorrupted = notDataCorrupted * false;
                        Ext.Array.push(failSource, data.name);
                    }
                });

                if (notDataCorrupted) {
                    if (me.data.items.length) {
                        me.removeAll();
                    }

                    var afteradd = function() {
                        me.un('add', afteradd);
                        if (callback) {
                            callback();
                        }
                    };

                    me.on('add', afteradd, {
                        single: true
                    });
                    me.add(serializedData);

                    return true;
                }
                Ext.Notify.msg(Ext.localization.dataSourceStore.configurationLoadFailure(Ext.encode(failSource)), {
                    layout: 'top',
                    delay: 5000,
                    type: 'error'
                });

                return false;
            }

            if (callback) {
                callback();
            }

            return false;
        } catch (e) {
            return false;
        }
    },
    /**
     * @method checkUpperCase  validate string is upper case
     * @param {String} value  `''` string to check upper case.
     * @return {Boolean} isUpper `false` check validation
     * @private
     */
    checkUpperCase: function(value) {
        var isUpper = false;
        if (!Ext.isEmpty(value)) {
            isUpper = value === value.toUpperCase() ? true : false;
        }
        return isUpper;
    },
    /**
     * @method verifyGridBindings
     * @return {[type]}           [description]
     */
    verifyGridBindings: function() {
        Ext.Array.each(this.data.items, function(item) {
            if (item.data.gridBinding !== '') {
                item.data.gridBinding = Ext.getCmp(item.data.gridBinding) ? item.data.gridBinding : '';
            }
        });
    },
    /**
     * MYax: send request custom connection type ajaxcrud.
     * @param {Object} properties config like { onSaveCallback: function(){ } }
     * @param {Object} args params to proxy request e.g. { success: function() {}, callback: function(){}, params: { property: value }}
     */
    sendBachSource: function(properties, args) {
        properties = properties || {};
        args = args || {};
        //<debug>

        console.log('batchsource', JSON.stringify(args.jsonData));
        //</debug>
        var ajaxCrud = Ext.create('Ext.ux.data.util.AjaxCrud', properties);
        Ext.apply(args, {
            url: Ext.getBaseUrl('catalogs.svc/insertToContainer'),
            timeout: 3600000,
            method: 'POST'
        });

        ajaxCrud.request(args);
    },
    /**
     * @method history generador de historico para mantenimientos MPA dinamicos
     * @param {Object} args  `{}` method arguments
     * @private
     */
    history: function(args) {
        var me = this;
        args = args || {};

        var confidenceLevel = me.confidenceLevel || {};
        var uuidConfidenceLevel = '';
        var confidenceLevelStore = Ext.getStore('confidenceLevelStore');
        var context = me.context;
        var relationshipList = context.relationshipStore.getSerializedData();

        var nameRecord = [],
            descriptionRecord = [],
            descriptionParentRecord = [],
            parentRecordName = '',
            parentRecordProperty = '',
            uuidParentRecord = '';

        var configKey = me.equivalentKey || [];
        if (me.parentRecord && configKey.length) {
            uuidParentRecord = me.parentRecord.get(configKey[0].fieldParameter);
            parentRecordProperty = configKey[0].field;
            var descList = me.parentRecord.store.descriptors || [];

            for (var j = 0; j < descList.length; j++) {
                var property = descList[j];
                descriptionParentRecord.push(me.parentRecord.get(property));
            }
            parentRecordName = descriptionParentRecord.join(', ');
        }

        var getRecursiveData = function(store, sourceParentName) {
            var data = {};
            if (store.count()) {
                var storeData = [],
                    tempData = {},
                    // recordData = {},
                    link = {};

                if (sourceParentName) {
                    link =
                        relationshipList.find(function(data, index) {
                            return data.fromName === sourceParentName && data.toName === store.name;
                        }) || {};
                }

                // lookup key

                var sourceLink =
                    relationshipList.filter(function(data, index) {
                        return data.toName === store.name && !Ext.isEmpty(data.lookupField);
                    }) || [];

                var lookupKeys =
                    sourceLink.map(function(d, i) {
                        return d.toPort;
                    }) || [];

                store.each(function(record, index) {
                    tempData = record.getData() || {};
                    delete tempData.id;
                    var newKey = '';
                    var recordData = {};
                    Ext.Object.each(tempData, function(key, value) {
                        newKey = '';

                        if (!me.excludeProperties.includes(key)) {
                            if (key.indexOf('$$') === -1) {
                                if (Ext.Array.contains(store.encryptedColumns, key)) {
                                    var isModified = args.action === 'update' ? record.isModified(key) : false;
                                    recordData[key] = isModified ? '••••••••••' : '•••••';
                                } else {
                                    if (key === confidenceLevel.globalParameter) {
                                        recordData[key] = value;
                                        uuidConfidenceLevel = value;
                                        newKey = me.getPropertyName(key, true);
                                        var confidenceRecord = confidenceLevelStore.findConfidenceLevelRecord(value);
                                        if (confidenceRecord) {
                                            recordData[newKey] = confidenceRecord.get('text');
                                        }
                                    } else {
                                        if (key === link.toPort) {
                                            // recordData[key] = value;
                                            // lookup
                                        } else if (lookupKeys.includes(key)) {
                                            recordData[key + '_ID'] = value;
                                        } else if (key === parentRecordProperty) {
                                            //parent record information.
                                            recordData[key + '_ID'] = value;
                                            newKey = me.getPropertyName(key, true);
                                            recordData[newKey] = parentRecordName;
                                        } else {
                                            recordData[key] = value;
                                        }
                                    }
                                }
                            } else {
                                newKey = key.replace('$$', '');

                                if (!me.isGuid(value) && !Ext.isEmpty(value)) {
                                    newKey = me.getPropertyName(newKey, true);
                                    recordData[newKey] = value;
                                }
                            }
                        }
                    });
                    if (!Ext.Object.isEmpty(recordData)) {
                        storeData.push(recordData);
                    }
                });

                if (sourceParentName) {
                    data = storeData;
                } else {
                    data = storeData.length === 1 ? storeData[0] : storeData;
                }

                if (store.childs.length) {
                    for (var i = 0; i < store.childs.length; i++) {
                        var childStore = store.childs[i];
                        var childData = getRecursiveData(childStore, store.name);
                        if (!Ext.Object.isEmpty(childData)) {
                            data[childStore.name] = childData;
                        }
                    }
                }
            }
            return data;
        };
        if (!Ext.isEmpty(args.action)) {
            args.callback = args.callback || Ext.emptyFn;
            args.comment = args.comment || '';
            args.uuidRecord = args.uuidRecord || me.getKeyRecord();

            var sourceStore = me.getMainSource();

            var desc = args.description || me.getRecordDescription(sourceStore);

            var data = getRecursiveData(sourceStore);

            //<debug>

            console.log('guardando historico de:', args.action, data);
            //</debug>

            Ext.GlobalEvents.fireEvent(
                'savehistorical',
                data,
                args.action,
                args.uuidRecord,
                me.uuidMenu,
                args.comment,
                desc.name.join(', '),
                desc.description.join(', '),
                uuidParentRecord,
                uuidConfidenceLevel
            );

            if (Ext.isFunction(args.callback)) {
                args.callback();
            }
        }
    },
    /**
     * @method getKeyRecord description
     * @return {string} uuid `default` description
     * @private
     */
    getKeyRecord: function() {
        var me = this,
            uuid = '',
            sourceRecord = me.findRecord('isMainSource', true, 0, 0, 0, 1),
            sourceStore = sourceRecord ? sourceRecord.get('source') : null;
        if (sourceStore) {
            var pkColumn =
                sourceStore.columns.find(function(d, i) {
                    return d.key === 'primary';
                }) ||
                sourceStore.columns.find(function(d, i) {
                    return d.key === 'both';
                });
            if (!Ext.Object.isEmpty(pkColumn)) {
                if (sourceStore.count()) {
                    var mainRecord = sourceStore.getAt(0);
                    uuid = mainRecord.get(pkColumn.dataIndex);
                } else {
                    if (me.instanceMode === 'view') {
                        uuid = me.currentRecord.get(pkColumn.dataIndex);
                    }
                }
            }
        }
        return uuid;
    },
    /**
     * @param {String} name  `''` property name
     * @param {String} clear  `false` remove string part "UUID"
     * @returns {String} newKey  `''` new property name solved
     */
    getPropertyName: function(name, clear) {
        var me = this,
            newKey = name || '';

        newKey += me.checkUpperCase(name) ? 'NAME' : 'Name';

        if (clear) {
            newKey = name.search(/uuid/i) === 0 ? newKey.slice(4, newKey.length) : newKey;
        }

        return newKey;
    },
    /**
     * @param {String} value  `''` string value
     * @returns {Boolean} `false` true if value match format guid e.g. "2ed14e39-ce5b-4710-9292-cb99eea9c2e3"
     */
    isGuid: function(value) {
        var isGuid = false;
        if (Ext.isString(value)) {
            var tokenList = value.match(/^[a-f-0-9\-]{36}$/gi) || [];
            isGuid = tokenList.length;
        }
        return isGuid;
    },
    /**
     * @method getRecordDescription solve description record
     * @returns {Object} data `{}` object descriptor
     * @private
     */
    getRecordDescription: function(sourceStore) {
        var me = this,
            data = {
                name: [],
                description: []
            };

        if (me.descriptors) {
            var firstRecord = sourceStore.getAt(0);
            if (firstRecord) {
                var first = 0;
                for (var j = 0; j < me.descriptors.length; j++) {
                    var desc = me.descriptors[j];
                    if (desc.toUpperCase() === 'CODE' && j === 0) {
                        first = 1;
                    }

                    var tempName = firstRecord.get(desc);
                    if (me.isGuid(tempName)) {
                        tempName = firstRecord.get(desc + '$$');
                    }
                    tempName = tempName || '';
                    if (j <= first) {
                        data.name.push(tempName);
                    } else {
                        data.description.push(tempName);
                    }
                }
            }
        }
        return data;
    },
    /**
     * @method getMainSource solve main store
     * @returns {Ext.data.Store} store `null` main source store
     * @private
     */
    getMainSource: function() {
        var store = null;
        var me = this;
        var sourceRecord = me.findRecord('isMainSource', true, 0, 0, 0, 1);

        store = sourceRecord ? sourceRecord.get('source') : null;

        if (store.params.targetType === 'V' && me.loadStack.cascade.length > 1) {
            store = store.childs[0];
        }

        return store;
    }
});
