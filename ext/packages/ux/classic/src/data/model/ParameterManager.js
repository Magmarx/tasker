/**
 * Created by Desar_6 on 18/12/2014.
 */
Ext.define('Ext.ux.data.model.ParameterManager', {
    extend: 'Ext.data.Model',
    requires: ['Ext.ux.data.model.Parameter', 'Ext.data.Store'],
    fields: ['name', 'description', {
        'name': 'parameters',
        'convert': function(value, model) {
            var params = model.get('params');
            var gridObject = typeof params.columns === 'string' ? Ext.JSON.decode(params.columns) : params.columns;

            var store = Ext.create('Ext.data.Store', {
                model: 'Ext.ux.data.model.Parameter',
                data: gridObject,
                proxy: {
                    type: 'memory',
                    reader: 'json'
                },
                getSerializedData: function() {
                    return store.serializedData;
                },
                setSerializedData: function(serializedData, callback) {
                    store.removeAll();
                    store.loadData(serializedData);
                    store.serializedData = serializedData;

                    if (callback) {
                        callback();
                    }
                },
                getUnfilledParams: function() {
                    store.clearFilter();
                    var returnData = [];
                    var ExArray = Ext.Array;
                    ExArray.each(store.data.items, function(parameter) {
                        if (parameter.get('value') === '') {
                            ExArray.push(returnData, parameter.data);
                        }
                    });

                    return returnData;
                }
            });

            // store.on("datachanged", function () {
            //     // Ext.Array.each(model.stores, function (parameterStore) {
            //     //     parameterStore.fireEvent("parameterchanged");
            //     // });
            // });
            // store.load();
            return store;
        }
    }, {
        'name': 'params',
        'defaults': []
    }, {
        'name': 'proxy',
        defaults: []
    }, {
        'name': 'sourceConfig',
        'defaults': []
    }, 'parameterMode', 'allColumns']
});