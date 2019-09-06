/**
 * Created by MYAX on 9/25/2015.
 */
Ext.define('Ext.ux.relationshipBuilder.store.UnitTests', {
    storeId: 'RelationUnitTests',
    id: 'RelationUnitTests',
    model: 'Ext.ux.relationshipBuilder.model.UnitTest',
    extend: 'Ext.data.Store',
    autoLoad: true,
    // autoSync: true,
    proxy: {
        type: 'localstorage',
        id: 'RelationUnitTests'
    },
    getRecordByInstanceId: function(instanceId) {
        return this.findRecord('instanceId', instanceId, false, false, false, true);
    }
});