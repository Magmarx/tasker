/**
 * Created by Desar_6 on 04/09/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.store.SourceRelationshipTable', {
    extend: 'Ext.data.Store',
    autoSync: true,
    model: 'Ext.ux.relationshipBuilder.model.SourceRelationshipTable',
    proxy: {
        type: 'memory'
    },
    /**
     * Serialize the current data to be exported to the database
     */
    getSerializedData: function() {
        var resultData = [];
        var me = this,
            Ex = Ext,
            ExArray = Ex.Array;
        ExArray.each(me.data.items, function(item) {
            var data = item.data;
            ExArray.push(resultData, {
                id: data.id,
                sourceName: data.sourceName,
                targetName: data.targetName,
                order: data.order,
                tree: data.tree,
                x: data.x,
                y: data.y,
                boxHeight: data.boxHeight,
                boxWidth: data.boxWidth
            });
        });
        return resultData;
    }
});