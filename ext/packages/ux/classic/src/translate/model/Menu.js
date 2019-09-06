Ext.define('Ext.ux.translate.model.Menu', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'id',
            type: 'string',
            convert: function(value, record) {
                return value === 'root' ? value : record.get('uuid');
            }
        }, {
            name: 'uuid',
            type: 'string'
        }, {
            name: 'text',
            type: 'string',
            convert: function(value, record) {
                return (!value) ? '[' + record.get('referenceName') + ']' : value;
            }
        }, {
            name: 'leaf',
            type: 'boolean'
        },
        // { name: 'uuidLabel', type: 'string' },
        {
            name: 'referenceName',
            type: 'string'
        }, {
            name: 'translated',
            type: 'integer'
        }, // 0 is completed || is not completed
        {
            name: 'warning',
            type: 'integer'
        }, // 0 is completed || is not completed
        {
            name: 'children',
            convert: function(value, record) {
                return (value) ? value : [];
            }
        }
        // { name: 'translation' }
    ]
});