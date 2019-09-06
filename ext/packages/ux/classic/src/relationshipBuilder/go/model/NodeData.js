/**
 * Created with IntelliJ IDEA.
 * User: MYAX
 * Date: 03/28/16
 * Time: 02:36 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Ext.ux.relationshipBuilder.go.model.NodeData', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'key',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'targetName',
        type: 'string'
    }, {
        name: 'loc',
        type: 'string'
    }, {
        name: 'order',
        type: 'int',
        defaultValue: 0
    }, {
        name: 'tree',
        type: 'int',
        defaultValue: 1
    }, {
        name: 'properties',
        convert: function(value, record) {
            return (value) ? value : [];
        }
    }, {
        name: 'lookups',
        convert: function(value, record) {
            return (value) ? value : [];
        }
    }]
});