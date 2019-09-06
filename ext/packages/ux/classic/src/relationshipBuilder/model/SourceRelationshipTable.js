/**
 * Created by Desar_6 on 04/09/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.model.SourceRelationshipTable', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'string'
    }, {
        name: 'sourceName',
        type: 'string'
    }, {
        name: 'targetName',
        type: 'string'
    }, {
        name: 'order',
        type: 'int'
    }, {
        name: 'tree',
        type: 'int'
    }, {
        name: 'x',
        type: 'int'
    }, {
        name: 'y',
        type: 'int'
    }, {
        name: 'boxHeight',
        type: 'int'
    }, {
        name: 'boxWidth',
        type: 'int'
    }]
});