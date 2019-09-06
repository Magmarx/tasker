Ext.define('Ext.ux.relationshipBuilder.model.DataSource', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'sourceName',
        'description',
        'uuidMenu',
        'targetName'
        // { name: 'id', type: 'string'} ,
        // { name: 'sourceName', type: 'string' } ,
        // { name: 'description', type: 'string' },
        // { name: 'targetName', type: 'string' }
    ]
});