/**
 * @author Desar_6 on 19/12/2014.
 * @class Ext.ux.data.util.Criteria
 */
Ext.define('Ext.ux.data.util.Criteria', {
    getParameterCriteria: function (criteria, firstValue) {
        var Ex = Ext,
            me = this,
            ExArray = Ex.Array,
            globalParamStore = Ex.getStore('globalParameters');

        if (typeof criteria === 'string') {
            criteria = Ex.JSON.decode(criteria);
        }

        var context = me.context;
        var parameterValue = '';
        ExArray.each(criteria, function (item) {
            parameterValue = '';
            var value = (item.parameter || item.value || "").toString().trim();            
            if (value.indexOf("'") === 0) {
                value = value.substring(1, value.length);
            }
            if (value.indexOf("'") === value.length - 1) {
                value = value.substring(0, value.length - 1);
            }            
            if (value.indexOf('{{') === 0) {
                if (value.indexOf('}}') == value.length - 2) {
                    if (Ext.isEmpty(item.parameter)) {
                        item.parameter = item.value;
                    }

                    var value2 = value.replace('{{', '');
                    value2 = value2.replace('}}', '');
                    value2 = value2.trim();
                    var tokens = value2.split('.');

                    if (tokens.length == 3) {
                        var returnSetting;
                        switch (tokens[0]) {
                            case 'Parameter':
                                if (tokens[1] === 'GlobalParams' && globalParamStore) {
                                    var record = globalParamStore.findRecord('dataIndex', tokens[2], 0, 0, 0, 1);
                                    if (record) {
                                        item.type = record.get('type');
                                        item.operator = record.get('operator');
                                        parameterValue = record.get('value');
                                        // item.value = (item.type === "array") ? Ex.JSON.encode(record.get("value")) : record.get("value");
                                        if (item.type === 'array') {
                                            item.value = (firstValue) ? parameterValue[0] : Ex.JSON.encode(parameterValue);
                                        } else {
                                            item.value = parameterValue;
                                        }
                                    }
                                } else {
                                    returnSetting = context.parameterManagerStore;
                                    var parameter = returnSetting.findParameterRecordBySourceAndName(tokens[1], tokens[2]);
                                    if (parameter) {
                                        parameterValue = returnSetting.getFieldValueBySourceAndName(tokens[1], tokens[2]);
                                        item.value = parameterValue || '';
                                    }
                                }
                                break;
                            case 'DataSource':
                                returnSetting = context.sourceStore;
                                var sourceFieldValue = returnSetting.getFieldValueBySourceAndName(tokens[1], tokens[2]);
                                if (sourceFieldValue) {
                                    item.value = sourceFieldValue;
                                }
                                break;

                        }
                        // if (!item.value) {

                        // }
                    }
                }
            }
        });
        return criteria;
    },
    /**
     * @method adjustCriteriaToMatchFieldType
     * @param  {Object} criteria
     * @return {Object}
     */
    adjustCriteriaToMatchFieldType: function (criteria) {
        if (typeof criteria === 'string') {
            criteria = Ext.JSON.decode(criteria);
        }

        Ext.Array.each(criteria, function (item) {
            var value = (item.value || '').toString().trim();

            if (value.indexOf("'") === 0) {
                value = value.slice(1, value.length);
            }

            if (value.lastIndexOf("'") === (value.length - 1)) {
                value = value.slice(0, value.length - 1);
            }

            value = value.replace("'", "''");
            item.value = value;

            if (item.operator === 'LIKE' || item.operator === 'NOT LIKE') {
                value = item.value.toString().trim();
                if (value.indexOf("'") === 0) {
                    value = value.substring(1, value.length);
                }
                if (value.indexOf('%') === 0) {
                    value = value.substring(1, value.length);
                }
                if (value.indexOf("'") === value.length - 1) {
                    value = value.substring(0, value.length - 1);
                }
                if (value.indexOf('%') === value.length - 1) {
                    value = value.substring(0, value.length - 1);
                }

                item.value = value;
            }
        });

        return criteria;
    }
});