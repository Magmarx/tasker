/**
 * To change this template use File | Settings | File Templates.
 * @author MYAX Date: 03/28/16 Time: 02:29 PM
 * @class Ext.ux.relationshipBuilder.go.model.LinkData
 * @extends Ext.data.Model
 */
Ext.define('Ext.ux.relationshipBuilder.go.model.LinkData', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'uuid',
        type: 'string',
        convert: function(value, record) {
            return (value) ? value : Ext.guid();
        }
    }, {
        name: 'from',
        type: 'string'
    }, {
        name: 'fromName',
        type: 'string'
    }, {
        name: 'toName',
        type: 'string'
    }, {
        name: 'fromPort',
        type: 'string'
    }, {
        name: 'points'
            //    type: "string"
    }, {
        name: 'to',
        type: 'string'
    }, {
        name: 'toPort',
        type: 'string'
    }, {
        name: 'lookupField',
        type: 'string'
    }, {
        name: 'searchField',
        type: 'string'
    }, {
        name: 'value',
        type: 'string',
        convert: function(value, record) {
            return '{{Parameter.{0}. ' + record.get('fromPort') + '}}';
        }
    }, {
        name: 'name',
        type: 'string',
        convert: function(value, record) {
            value = value || '';
            return (value && value.length > 250) ? value.substr(0, 250) : value;
        }
    }]
});