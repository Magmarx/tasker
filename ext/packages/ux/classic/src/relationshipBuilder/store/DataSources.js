/**
 * Created by Desar_6 on 04/09/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.store.DataSources', {
    extend: 'Ext.data.Store',
    model: 'Ext.ux.relationshipBuilder.model.DataSource',
    proxy: {
        type: 'memory',
        reader: 'json'
    },
    autoLoad: false,
    getSerializedData: function() {
        var resultData = [];
        var Ex = Ext,
            ExArray = Ex.Array;
        this.clearFilter();
        ExArray.each(this.data.items, function(item) {
            var data = item.data;
            ExArray.push(resultData, {
                id: data.id,
                sourceName: data.sourceName,
                description: data.description,
                targetName: data.targetName,
                uuidMenu: data.uuidMenu
            });
        });
        console.log(resultData);
        return resultData;
    }
});