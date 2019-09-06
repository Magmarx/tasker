/**
 * @author Desar_6 on 11/12/2014.
 * @class Ext.ux.data.prototype.Store
 * @extends Ext.data.Store
 */
Ext.define('Ext.ux.data.prototype.Store', {
    extend: 'Ext.data.Store',
    requires: ['Ext.ux.data.prototype.Proxy'],
    mixins: ['Ext.ux.data.util.Criteria'],
    autoLoad: false,
    instanceId: null,
    uuidDatamanager: null,
    extraCriteria: [],
    sortArrayConfig: [],
    uuidDesign: null,
    dynamicCriteria: [],
    /*
     * @cfg {child} childs  `[]` related sources
     */
    childs: [],
    /**
     * Myax: add one record with store model and defaults values
     * @method addEmptyRow
     * @param {function} callback
     * @return {Ext.data.Model} record
     */
    addEmptyRow: function (callback) {
        var me = this,
            record = me.createNewRecord();
        if (record) {
            me.add(record);
        }

        if (typeof callback === 'function') {
            callback(record);
        } else {
            return record;
        }
    },
    /**
     * @method updateConfig
     * @param  {[type]}     args [description]
     * @return {[type]}          [description]
     */
    updateConfig: function (args) {
        var modelId = Ext.id(null, args.storeId + '-genericModel');
        args.model = Ext.define(modelId, {
            extend: 'Ext.data.Model',
            fields: args.columns
        });

        Ext.apply(this, args);
    },
    updateInternalParameters: function () {
        var me = this;
        if (me.count()) {
            var sourceName = me.sourceParameterName,
                parameterManagerStore = me.context.parameterManagerStore,
                parameterRecord = parameterManagerStore.findRecord('name', sourceName, 0, false, false, true),
                columns = (parameterRecord) ? parameterRecord.get('params').columns : [];

            if (columns.length) {
                var records = me.getRange(),
                    isArray = (records.length > 1),
                    solvedParams = [],
                    ExArray = Ext.Array,
                    data = null,
                    value = null;

                ExArray.each(columns, function (column) {
                    data = {};
                    data.dataIndex = column.dataIndex;
                    ExArray.each(records, function (record, index) {
                        if (isArray) {
                            if (!index) {
                                data.value = [];
                            }
                            value = record.get(column.dataIndex);
                            if (!ExArray.contains(data.value, value)) {
                                data.value.push(value);
                            }
                        } else {
                            data.value = record.get(column.dataIndex);
                        }
                    });
                    solvedParams.push(data);
                });
                if (solvedParams.length) {
                    parameterManagerStore.loadParameterData([{
                        name: sourceName,
                        parameters: solvedParams
                    }]);
                }
            }
        }
    },
    /**
     * Load Ext.ux.data.prototype.Proxy for custom request
     * @method reupdateProxy
     * @event reupdateProxy
     */
    reupdateProxy: function () {
        var me = this;
        var token = me.proxyPrototype.token;
        var type = me.proxyPrototype.type;

        var proxy = me.getProxy();
        if (proxy.name == 'prototypeproxy') {
            proxy.setUrl(Ext.manifest.handler.connectionManager);
            proxy.setParams(me.params);
        } else {
            me.setProxy(Ext.create('Ext.ux.data.prototype.Proxy', {
                token: token,
                type: type || '',
                params: me.params,
                url: Ext.manifest.handler.connectionManager,
                reader: me.proxy.reader
            }));
        }
    },
    /**
     * @method setExtraCriteria
     * @param  {String} criteria
     */
    setExtraCriteria: function (criteria) {
        this.extraCriteria = criteria || [];
    },
    /**
     * Myax: set sort to store
     * @method setSort
     * @param {Array} sort array this is configuration sort basicly e.g. [{ property: "name", direction: "ASC" }]
     * @param {Boolean} load determine to store load data immediately
     */
    setSort: function (sortArray, load) {
        if (Ext.isArray(sortArray)) {
            if (load) {
                this.sort(sortArray);
            } else {
                this.sortArrayConfig = sortArray;
            }
        }
    },
    /**
     * Myax: return criteria definition explicity "criteria" this set on make design configuration
     * and dynamic "extraCriteria"  set on filter
     * @method getCriteria
     * @return {Object | Array[]} criteria configuration to source.
     */
    getCriteria: function () {
        try {
            var criteria = Ext.decode(this.params.criteria || '[]');
            return Ext.merge(criteria, this.extraCriteria);
        } catch (e) {
            Ext.log({
                msg: 'test',
                level: 'warn',
                dump: e,
                indent: 1,
                stack: true
            });
            return [];
        }
    },
    /**
     * Myax: create new record with defaults values eg.  primary keys, parametest: ( global, sources ) and custom values
     *  @param {Object} rawData used to construct new record.   e.g {name: "Miguel", email: "myax@plusti.com", id: "de19ae6f-a344-4a9d-a98b-900d3e62a8e5"}
     *   -- configuration (source properties) --
     *
     *       keysColumns = [{dataIndex : 'id'}]
     *       globalColumns = [{ dataIndex: 'organizationId' }]
     *       columns = [{ dataIndex: 'name'}, { dataIndex: 'email'}, { dataIndex: lastName }]
     *
     *   record.getData()
     *       -- result --
     *   {
     *          id: 'de19ae6f-a344-4a9d-a98b-900d3e62a8e5'
     *          name: 'Miguel',
     *          email: 'myax@plusti.com',
     *          lastName: "",
     *          organizationId: 'ccf1b61a-0d6a-4383-8d84-348be426059b'
     *   }
     *
     *
     * @return {Ext.data.Model} record  | null if failed record created.
     */
    createNewRecord: function (data) {
        data = data || {};
        try {
            var me = this,
                newRecord = {},
                // TODO: add access on stores
                context = me.context,
                record = null;

            if (context) {
                Ext.Array.each(me.keyColumns, function (keyField, index) {
                    var keyValue = Ext.guid();
                    newRecord[keyField] = keyValue;
                    context.parameterManagerStore.setFieldValueBySourceAndName(me.sourceParameterName, keyField, keyValue);
                });

                var globalStore = Ext.getStore('globalParameters');
                if (globalStore) {
                    var paramRecord = null,
                        globalValue = null,
                        value = '';
                    Ext.Array.each(me.globalColumns, function (globalConfig) {
                        paramRecord = globalStore.findRecord('dataIndex', globalConfig.globalParameter, 0, 0, 0, 1);
                        if (paramRecord) {
                            globalValue = paramRecord.get('value');
                            if (Ext.isArray(globalValue)) {
                                value = globalValue[0];
                            } else {
                                value = globalValue;
                            }
                            if (Ext.isEmpty(value)) {
                                //<debug>                                                            
                                console.log('don\'t solve global value: ', globalConfig.dataIndex, globalConfig);
                                //</debug>
                            } else {
                                newRecord[globalConfig.dataIndex] = value;
                            }
                        }
                    });
                }

                /**
                 * if source definitions contains criteria roules  e.g.
                 *      [{ field: "uuidNode", operator: "eq", value: "{{Parameter.MainSource.id}}"}]
                 *           => MainSource is organisation source.
                 *              field: is dataIndex
                 * @type {[type]}
                 */
                var criteria = Ext.decode(me.params.criteria),
                    currentCriteria = me.getParameterCriteria(criteria, true); // default first value

                // currentCriteria = me.adjustCriteriaToMatchFieldType(currentCriteria);

                Ext.Array.each(currentCriteria, function (param, index) {
                    if (Ext.isEmpty(param.value)) {
                        //<debug>

                        console.log('don\'t solve criteria value: ', param.field);
                        //</debug>
                    } else {
                        newRecord[param.field] = param.value;
                    }
                });

                // get list of keys on data argument
                var customProperty = Object.keys(data);
                if (customProperty.length) {
                    Ext.Array.each(me.columns, function (column, index) {
                        if (data.hasOwnProperty(column.dataIndex)) {
                            /** if value is seted e.g
                             *  newRecord. id // '1dc053d8-8ea3-405e-9f22-e6562def8649'    ==> id is key and set value on first step
                             *  data.id //  'de19ae6f-a344-4a9d-a98b-900d3e62a8e5'
                             * and then newRecod.id // "de19ae6f-a344-4a9d-a98b-900d3e62a8e5"   overwrite value.
                             */
                            newRecord[column.dataIndex] = data[column.dataIndex];
                            /* if column is foreign key this can have lookup configuration
                             * eg. data.uuidNode$$ //'Plusti'
                             */
                            if (column.key === 'foreign') {
                                // lookup value
                                if (data.hasOwnProperty(column.dataIndex + '$$')) {
                                    newRecord[column.dataIndex + '$$'] = data[column.dataIndex + '$$'];
                                }
                            }
                        }
                    });
                }

                // create new record with store model.
                record = Ext.create(me.getModelName(), newRecord);
            }
            return record;
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
     * Myax:  globalParameterValue
     * @method setValueByGlobalParameter
     * @param {Object} parameter e.g. An configuration like  {  value: "01ae4243-4af1-43a6-8128-0407dec44b93", globalParameterName: 'CONFIDENCELVL' }
     * @param {Array} dataIndexList list of avalaible to replace with value parameter.
     */
    setValueByGlobalParameter: function (config, dataIndexList) {
        var me = this,
            // find if exist dataindex same name in dataIndexList
            registeredColumn = me.columns.filter(function (column, index) {
                // return dataIndexList.contains(column.dataIndex);
                return Ext.Array.contains(dataIndexList, column.dataIndex);
            });

        if (registeredColumn.length) {
            // for each records asign record dataIndex  value parameter
            Ext.Array.each(me.data.items, function (record, index) {
                Ext.Array.each(registeredColumn, function (column, index) {
                    record.set(column.dataIndex, config.value);
                });
            });
        }
    },
    /**
     * @method load
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    load: function (options) {

        // if (!Ext.isEditMode) {
        var me = this;

        me.params.requestType = 'sourceAction';
        var objCriteria = me.getCriteria();

        var objProcParameters = null;
        try {
            objProcParameters = Ext.decode(me.params.procParameters);
        } catch (e) {
            Ext.log({
                msg: e.message,
                level: 'warn',
                dump: e,
                indent: 1,
                stack: false
            });
        }

        var serializedParams = Ext.encode(me.params);

        me.params.idDatamanager = me.uuidDatamanager || null;
        me.params.idDesign = me.uuidDesign || null;
        me.params.sort = Ext.isArray(me.sortArrayConfig) ? JSON.stringify(me.sortArrayConfig) : me.sortArrayConfig;

        var globalParamStore = Ext.getStore('globalParameters');

        me.params.globals = Ext.encode(globalParamStore.getSerializedData());

        // me.getProxy().reader.root = "rows";

        var restoreParams = function (store, records, successful, eOpts) {
            var decodedParams = Ext.decode(serializedParams);

            if (typeof objCriteria !== 'undefined' && objCriteria.length) {
                me.params.criteria = decodedParams.criteria;
            }

            if (typeof objProcParameters !== 'undefined' && objProcParameters.length) {
                me.params.procParameters = decodedParams.procParameters;
            }

            me.un('load', restoreParams, me, {
                single: true
            });
            me.fireEvent('afterload', store, records, successful, eOpts);
        };

        var currentCriteria = typeof me.params.criteria !== 'undefined' && objCriteria.length ? me.params.criteria : me.params.procParameters;

        var afterResolveCriteria = function () {
            me.reupdateProxy();
            me.on('load', restoreParams, me, {
                single: true
            });
            me.superclass.load.call(me, options);
        };

        if (typeof currentCriteria !== 'undefined' && currentCriteria.length > 0) {
            currentCriteria = me.getParameterCriteria(currentCriteria);
            // currentCriteria = me.adjustCriteriaToMatchFieldType(currentCriteria);

            if (typeof objCriteria !== 'undefined' && objCriteria.length) {
                me.params.criteria = Ext.encode(currentCriteria);
            }
            if (typeof objProcParameters !== 'undefined' && objProcParameters.length) {
                me.params.procParameters = Ext.encode(currentCriteria);
            }

            afterResolveCriteria();
        } else {
            afterResolveCriteria();
        }
    },
    /**
     * @method reload
     * @param  {Object} options [description]
     * @return {[type]}         [description]
     */
    reload: function (options) {
        if (!Ext.isEditMode) {
            var me = this;
            me.reupdateProxy();
            me.superclass.reload.call(me, options);
        } else {
            return false;
        }
    },
    /**
     * @method sync
     * @param  {Object} options [description]
     * @return {Boolean}         [description]
     */
    sync: function (options) {
        if (!Ext.isEditMode) {
            var me = this;
            me.reupdateProxy();
            me.superclass.sync.call(me, options);
        } else {
            return false;
        }
    },
    /**
     * @method save
     * @param  {Object} options [description]
     * @return {Boolean}         [description]
     */
    save: function (options) {
        if (!Ext.isEditMode) {
            var me = this;
            me.reupdateProxy();
            me.superclass.save.call(me, options);
        } else {
            return false;
        }
    },
    /**
     * @param {Array} childs  `[]` source list
     * @public
     */
    setChilds: function (childs) {
        var oldchilds = this.childs;
        if (childs !== oldchilds) {
            this.childs = childs;
            // this.updateChilds(childs, oldchilds);
        }
    },
    /**
     * @return {Array} childs `[]` source list
     * @public
     */
    getChilds: function () {
        var childs = this.childs || [];

        return childs;
    },
    /**
     * @method removeRecords
     * remove records and removeAll childs stores.
     * @public
     */
    removeRecords: function () {
        if (this.count()) {
            this.removeAll();
            var childs = this.getChilds();
            Ext.Array.each(childs, function (child) {
                child.removeRecords();
            });
        }
    }
});