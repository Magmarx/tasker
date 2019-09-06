/**
 * Created by Desar_6 on 04/09/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.model.SQLFields', {
    extend: 'Ext.data.Model',
    fields: [{
            name: 'id',
            type: 'string'
        }, {
            name: 'tableName',
            type: 'string'
        }, {
            name: 'tableId',
            type: 'string'
        },
        /* {
               name: 'extCmpId',
               type: 'string'
           }, {
               name: 'tableAlias',
               type: 'string'
         }, */
        {
            name: 'field',
            type: 'string'
        }
        /*, {
                name: 'output',
                type: 'boolean'
            }, {
                name: 'expression',
                type: 'string'
            }, {
                name: 'aggregate',
                type: 'string'
            }, {
                name: 'alias',
                type: 'string'
            }, {
                name: 'sortType',
                type: 'string'
            }, {
                name: 'sortOrder',
                type: 'int'
            }, {
                name: 'grouping',
                type: 'boolean'
            }, {
                name: 'criteria',
                type: 'string'
          } */
    ]
});