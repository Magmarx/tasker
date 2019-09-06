/**
 * Created with IntelliJ IDEA.
 * User: MYAX
 * Date: 2/16/16
 * Time: 8:45 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.data.model.CodeFile', {
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
        name: 'definition',
        type: 'string'
    }, {
        name: 'fileType',
        type: 'string'
    }, {
        name: 'uuidTypeFile',
        type: 'string'
    }, {
        name: 'order'
    }]
});