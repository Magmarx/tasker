/**
 * @author Desar_6 on 18/12/2014
 * @class Ext.ux.data.store.ParameterManager
 * @extends Ext.data.Store
 */
Ext.define('Ext.ux.data.store.ParameterManager', {
    extend: 'Ext.data.Store',
    requires: ['Ext.ux.data.model.ParameterManager'],
    model: 'Ext.ux.data.model.ParameterManager',
    proxy: {
        type: 'memory',
        reader: 'json'
    },
    config: {
        /*
         * @cfg {Ext.data.Model} parentRecord  `null` parent record [related menu ==> menu]
         */
        parentRecord: null,
        /*
         * @cfg {Array} equivalentKey  `[]` key parameters on related program
         * dictionary list equivalent parameters eg. [{ "fieldParameter": "UUIDDATAPRESENTATIONVIEWERALERT", "field": "UUID"}]
         */
        equivalentKey: []
    },
    /**
     * load the parameter data to be used in the application, this serialized data has the
     * following structure:
     * [{
     *      "categoryName": <category>,
     *      "parameters": [{
     *          "dataIndex": <name>,
     *          "value": <value>
     *      },{
     *          "dataIndex": <name>,
     *          "value": <value>
     *      },{
     *          "dataIndex": <name>,
     *          "value": <value>
     *      },{
     *          "dataIndex": <name>,
     *          "value": <value>
     *      }]
     * }]
     * @method loadParameterData
     * @param  {Array}          serializedData [description]
     * @param  {Function}        callback       [description]
     */
    loadParameterData: function (serializedData, callback) {
        var me = this;
        if (serializedData) {
            if (typeof serializedData === 'string') {
                serializedData = Ext.JSON.decode(serializedData);
            }
            //llaves equivalentes de registro padre
            var equivalentKey = me.getEquivalentKey(),
                parentRecord = me.getParentRecord();
            if (equivalentKey.length && parentRecord) {
                Ext.Array.each(equivalentKey, function (equivalent, index) {
                    serializedData.push({
                        name: 'MainDesign',
                        parameters: [{
                            dataIndex: equivalent.field,
                            value: parentRecord.get(equivalent.fieldParameter)
                        }]
                    });
                });
            }
            me.setParameterValues(serializedData);

        }
        if (typeof callback === 'function') {
            callback();
        }
    },
    setParameterValues: function (serializedData) {
        var me = this;
        Ext.Array.each(serializedData, function (category) {
            var categoryRecord = me.findRecord('name', category.name, 0, false, false, true);
            if (categoryRecord) {
                var parameterStore = categoryRecord.get('parameters');
                Ext.Array.each(category.parameters, function (parameter) {
                    var parameterRecord = parameterStore.findRecord('dataIndex', parameter.dataIndex, 0, false, false, true);
                    if (parameterRecord) {
                        parameterRecord.set('value', parameter.value);
                    } else {
                        parameterStore.add({
                            dataIndex: parameter.dataIndex,
                            value: parameter.value
                        });
                    }
                });
            }
        });
    },
    /**
     * @method getUnfilledParameters
     * @param  {[type]}              getObject [description]
     * @return {[type]}                        [description]
     */
    getUnfilledParameters: function (getObject) {
        var resultData = [];
        var me = this;
        me.clearFilter();

        Ext.Array.each(me.data.items, function (item) {
            var data = item.data;
            data.parameters.clearFilter();
            var unfilledParams = data.parameters.getUnfilledParams();

            if (unfilledParams.length) {
                Ext.Array.push(resultData, {
                    name: data.name,
                    configType: Ext.getSerializedData.configType.parameter,
                    description: item.data.description,
                    grid: data.grid,
                    params: data.params,
                    proxy: getObject ? data.proxy : (data.proxy ? {
                        storeId: data.proxy.storeId,
                        name: data.proxy.configParams.name,
                        type: data.proxy.type,
                        url: data.proxy.url
                    } : null),
                    parameters: unfilledParams
                });
            }
        });

        return resultData;
    },
    /**
     * runs a batch data load of all the sources to enter on the preview or release mode.
     * had completed the load request
     * @method loadAllData
     * @param {Boolean} synchronous this flag is optional if we want this method to fire an event when all the dataSources
     */
    loadAllData: function (synchronous) {
        var me = this;
        var totalSourcesCount = me.data.items.length,
            attemptCounter = 0,
            successCounter = 0;
        if (totalSourcesCount > 0) {
            var callback = function (records, operation, success) {
                attemptCounter++;

                if (success) {
                    successCounter++;
                }

                if (attemptCounter === totalSourcesCount && synchronous) {
                    me.fireEvent('alldataloaded', me, successCounter, totalSourcesCount);
                }
            };

            Ext.Array.each(me.data.items, function (item) {
                if (item.data.source) {
                    item.data.source.removeAll();
                    item.data.source.load({
                        scope: me,
                        callback: callback
                    });
                }
            });
        } else {
            if (synchronous) {
                me.fireEvent('alldataloaded', me, 0, 0);
            }
        }
    },
    /**
     * @method unloadAllData
     * @param  {[type]}      synchronous [description]
     * @return {[type]}                  [description]
     */
    unloadAllData: function (synchronous) {
        var me = this;

        Ext.Array.each(me.data.items, function (item) {
            var parameterStore = item.get('parameters');
            Ext.Array.each(parameterStore.data.items, function (parameter) {
                parameter.set('value', '');
            });
        });

        if (synchronous) {
            me.fireEvent('alldataunloaded');
        }
    },
    /**
     * @method getValueByName
     * @param  {[type]}       name [description]
     * @return {[type]}            [description]
     */
    getValueByName: function (name) {
        var data = name.split('.');
        var record = this.query('name', data[0]);

        return record.items[0].data.parameters.query('dataIndex', data[1]).items[0].data.value;
    },
    /**
     * Loads from serialized string configuration of the data sources, find the proper
     * proxy for the store, and reconstruct the cloud storage to the last stage.
     * @method loadSerializedData
     * @param {String} serializedData serialized source configuration string
     * @param {Function} callback
     * @param {String} instanceId
     * @returns {boolean} true: successfully loaded, false: fail loaded
     */
    loadSerializedData: function (serializedData, callback, instanceId) {
        var me = this;
        try {
            if (typeof serializedData === 'string') {
                serializedData = serializedData === '' ? '{}' : serializedData;
                serializedData = Ext.decode(serializedData);
            }

            var context = me.context;
            var connectionStore = context.connectionStore;
            var notDataCorrupted = true;
            var failSource = [];
            var convertedData = [];

            if (serializedData && serializedData.length > 0) {
                Ext.Array.each(serializedData, function (data, index, alldata) {
                    var metaProxy = data.proxy;
                    if (metaProxy) {
                        var proxyRecord = connectionStore.findRecord('name', metaProxy, 0, false, false, true);

                        if (proxyRecord) {
                            data.proxy = proxyRecord.data.connection;
                            Ext.Array.push(convertedData, new Ext.ux.data.model.ParameterManager(data));
                        } else {
                            notDataCorrupted = notDataCorrupted * false;
                            Ext.Array.push(failSource, data.name);
                        }
                    } else {
                        Ext.Array.push(convertedData, new Ext.ux.data.model.ParameterManager(data));
                    }
                });

                if (notDataCorrupted) {
                    if (me.data.items.length) {
                        me.removeAll();
                    }
                    // Se agrega y luego se remueve el listener
                    var afteradd = function () {
                        me.un('add', afteradd);
                        if (callback) callback();
                    };

                    me.on('add', afteradd);
                    me.add(convertedData);
                    // complete parameters.

                    return true;
                } else {
                    Ext.Notify.msg('<b>Configuration Load Failure</b>: <cite>Cannot bind a connection to the following Source: ' + Ext.encode(failSource) + ' the load proccess wont continue</cite>', {
                        layout: 'top',
                        delay: 5000,
                        type: 'error'
                    });
                    return false;
                }
            } else {
                if (callback) {
                    callback();
                }

                return true;
            }
        } catch (e) {
            Ext.log({
                msg: e.message,
                level: 'warn',
                dump: e,
                indent: 1,
                stack: true
            });

            return false;
        }
    },
    equivalentKey: [],
    /**
    * Myax: set array to properties store avalible to change
    * @method setEquivalentKey

    */
    setEquivalentKey: function (dictionary) {
        if (Ext.isArray(dictionary)) {
            this.equivalentKey = dictionary;
        }
    },
    getEquivalentKey: function () {
        return this.equivalentKey || [];
    },
    /**
     * Myax: set value based on parameter definition on souce
     * @method setFieldValueBySourceAndName
     * @param {String} source name:  dynamic store generated by dataSourceStore e.g. MainSource
     * @param {String} name:  property  dataindex e.g. uuid
     * @param {Object} value  e.g. "1234"
     * @return {Boolean}
     */
    setFieldValueBySourceAndName: function (source, name, value) {
        var parameterRecord = this.findParameterRecordBySourceAndName(source, name);

        if (parameterRecord) {
            return (parameterRecord.set('value', value));
        }

        return false;
    },
    /**
     * @method getFieldValueBySourceAndName
     * @param  {[type]}                     source [description]
     * @param  {[type]}                     name   [description]
     * @return {[type]}                            [description]
     */
    getFieldValueBySourceAndName: function (source, name) {
        var parameterRecord = this.findParameterRecordBySourceAndName(source, name);
        if (parameterRecord) {
            return parameterRecord.get('value');
        }

        return '';
    },
    /**
     * @method findParameterRecordBySourceAndName
     * @param  {[type]}                           source [description]
     * @param  {[type]}                           name   [description]
     * @return {[type]}                                  [description]
     */
    findParameterRecordBySourceAndName: function (source, name) {
        var sourceRecord = this.findRecord('name', source, 0, false, false, true),
            parameters = (sourceRecord) ? sourceRecord.data.parameters : null;

        return (parameters) ? parameters.findRecord('dataIndex', name, 0, false, false, true) : null;
    },
    /**
     * @method bindValue
     * @param  {[type]}  object       [description]
     * @param  {[type]}  sourceConfig [description]
     * @return {[type]}               [description]
     */
    bindValue: function (object, sourceConfig) {
        var me = this;
        var storeRecord = me.findRecord('name', sourceConfig.name, 0, false, false, true);

        if (storeRecord) {
            var parameters = storeRecord.data.parameters;
            var fieldValueByFieldByName = me.getFieldValueBySourceAndName(sourceConfig.name, sourceConfig.dataIndex);

            object.setValue(fieldValueByFieldByName);
            object.getAutoFieldLabel();

            return true;
        }

        return false;
    },
    /**
     * @method wipeDataStore
     * @event removeAll
     */
    wipeDataStore: function () {
        this.removeAll();
    }
});
