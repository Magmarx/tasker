/**
 * Created by DELL on 15/10/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.model.JoinStructure', {
    extend: 'Ext.data.Model',
    fields: ['pkTableId', 'pkTableName', 'fkTableId', 'fkTableName'],
    hasMany: [{
        model: 'Ext.ux.relationshipBuilder.model.JoinStructure',
        name: 'children'
    }]
});