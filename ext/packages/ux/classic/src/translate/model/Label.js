Ext.define('Ext.ux.translate.model.Label', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'uuidLabel',
        type: 'string'
    }, {
        name: 'referenceName',
        type: 'string'
    }, {
        name: 'uuidTranslation',
        type: 'string'
    }, {
        name: 'uuidTropicalization',
        type: 'string'
    }, {
        name: 'translation',
        type: 'string'
    }, {
        name: 'tropicalization',
        type: 'string'
            //, convert: function (value, record) {
            //    return (value) ? value : record.get('translation');
            // }
    }, {
        name: 'typeLabel',
        type: 'string'
    }, {
        name: 'action',
        type: 'string',
        convert: function(value, record) {
            return (!record.get('translation')) ? 'add' : 'trop';
        }
    }, {
        name: 'reference',
        type: 'string'
    }, {
        name: 'reset'
    }]

});