/**
 * Created by MYAX on 9/25/2015.
 */
Ext.define('Ext.ux.relationshipBuilder.model.UnitTest', {
    extend: 'Ext.data.Model',
    fields: [
        'instanceId', {
            name: 'rawTables',
            convert: function(value, record) {
                return (value) ? value : [];
            }
        }, {
            name: 'rawJoins',
            convert: function(value, record) {
                return (value) ? value : [];
            }
        }, {
            name: 'rawSources',
            convert: function(value, record) {
                return (value) ? value : [];
            }
        },
        'uuidModule',
        'uuidLanguage',
        'uuidBridge'
    ]
});