/**
 * Created by DELL on 30/01/2015.
 */
Ext.define('Ext.ux.data.model.Label', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'referenceName',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'rndName',
        type: 'boolean',
        convert: function(value) {
            return value === '' ? false : value;
        }
    }, {
        name: 'reusedName',
        type: 'boolean',
        convert: function(value) {
            return value === '' ? false : value;
        }
    }, {
        name: 'customName',
        type: 'string',
        defaultValue: ''
    }, {
        name: 'value',
        convert: function(value) {
            return value === '' ? null : value;
        }
    }, {
        name: 'ownerCmp',
        type: 'string'
    }],
    validators: [{
        type: 'presence',
        field: 'referenceName'
    }, {
        type: 'presence',
        field: 'name'
    }]
});