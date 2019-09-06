Ext.define('Ext.ux.translate.model.Language', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'uuid',
        type: 'string'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'initials',
        type: 'string'
    }, {
        name: 'isDefault',
        type: 'boolean'
    }]
});