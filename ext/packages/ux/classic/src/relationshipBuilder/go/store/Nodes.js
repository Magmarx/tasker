/**
 * Created with IntelliJ IDEA.
 * User: MYAX
 * Date: 03/28/16
 * Time: 02:45 PM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Ext.ux.relationshipBuilder.go.store.Nodes', {
    extend: 'Ext.data.Store',
    model: 'Ext.ux.relationshipBuilder.go.model.NodeData',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    getSerializedData: function() {
        var resultData = [];
        var me = this,
            Ex = Ext,
            ExArray = Ex.Array;
        ExArray.each(me.data.items, function(item) {
            ExArray.push(resultData, item.getData());
        });
        return resultData;
    }
});