/**
 * Created by Desar_6 on 13/01/2015.
 */
Ext.define('Ext.ux.criteria.Util', {
    getParameterCriteria: function(criteria) {
        var Ex = Ext,
            ExArray = Ex.Array;
        if (typeof criteria === 'string') {
            criteria = Ext.JSON.decode(criteria);
        }

        ExArray.each(criteria, function(item) {
            var value = item.value.toString().trim();
            if (value.indexOf("'") === 0) {
                value = value.substring(1, value.length);
            }
            if (value.indexOf("'") === value.length - 1) {
                value = value.substring(0, value.length - 1);
            }
            if (value.indexOf('{{') === 0) {
                if (value.indexOf('}}') == value.length - 2) {
                    var value2 = value.replace('{{', '');
                    value2 = value2.replace('}}', '');
                    value2 = value2.trim();
                    var tokens = value2.split('.');
                    if (tokens.length == 3) {
                        var returnSetting;
                        switch (tokens[0]) {
                            case 'Parameter':
                                returnSetting = Ex.ParameterManagerStore;
                                var parameter = returnSetting.findParameterRecordBySourceAndName(tokens[1], tokens[2]);
                                if (parameter) {
                                    var testParameterValue = returnSetting.getFieldValueBySourceAndName(tokens[1], tokens[2]);
                                    item.value = testParameterValue;
                                }
                                break;
                            case 'DataSource':
                                returnSetting = Ex.SourceStore;
                                var sourceFieldValue = returnSetting.getFieldValueBySourceAndName(tokens[1], tokens[2]);
                                if (sourceFieldValue) {
                                    item.value = sourceFieldValue;
                                }
                                break;
                        }
                    }
                }
            }
        });
        return criteria;
    },
    adjustCriteriaToMatchFieldType: function(criteria) {
        if (typeof criteria === 'string') {
            criteria = Ext.JSON.decode(criteria);
        }
        Ext.Array.each(criteria, function(item) {
            /* if (typeof item.fieldType==="string")
             item.fieldType = parseInt(item.fieldType);
             switch(item.fieldType){
             case 0: */
            var value = item.value.toString().trim();
            if (value.indexOf("'") === 0) {
                value = value.slice(1, value.length);
            }
            if (value.lastIndexOf("'") === (value.length - 1)) {
                value = value.slice(0, value.length - 1);
            }
            value = value.replace("'", "''");
            value = "'" + value + "'";
            item.value = value;
            /* break;
             } */

            if (item.operator === 'LIKE' || item.operator === 'NOT LIKE') {
                var value = item.value.toString().trim();
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
                value = "'%" + value + "%'";
                item.value = value;
            }
        });
        return criteria;
    }
});