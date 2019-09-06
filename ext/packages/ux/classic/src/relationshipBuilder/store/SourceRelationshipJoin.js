/**
 * Created by Desar_6 on 04/09/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.store.SourceRelationshipJoin', {
    extend: 'Ext.data.Store',
    autoSync: true,
    model: 'Ext.ux.relationshipBuilder.model.SourceRelationshipJoin',
    proxy: {
        type: 'memory'
    },
    /**
     * Serialize the current data to be exported to the database
     */
    getSerializedData: function() {
        var resultData = [];
        var Ex = Ext,
            ExArray = Ex.Array;
        this.clearFilter();
        ExArray.each(this.data.items, function(item) {
            var data = item.data;
            ExArray.push(resultData, {
                pkTable: data.pkTable,
                fkTable: data.fkTable,
                pkTableName: data.pkTableName,
                fkTableName: data.fkTableName,
                pkField: data.pkField,
                fkField: data.fkField,
                pkMenu: data.pkMenu,
                fkMenu: data.fkMenu
            });
        });
        return resultData;
    }
});