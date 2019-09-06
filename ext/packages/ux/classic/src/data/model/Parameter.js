/**
 * @author Desar_6 on 18/12/2014
 * @class Ext.ux.data.model.Parameter
 * @extends Ext.data.Model
 */
Ext.define('Ext.ux.data.model.Parameter', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'dataIndex',
        type: 'auto'
    }, {
        name: 'alias',
        type: 'auto'
    }, {
        name: 'type',
        type: 'auto'
    }, {
        name: 'length',
        type: 'auto'
    }, {
        name: 'value',
        type: 'auto',
        defaultValue: ''
    }]
});