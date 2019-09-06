/**
 * Created by MYAX on 9/25/2015.
 */
Ext.define('Ext.ux.relationshipBuilder.ParentRelation', {

    extend: 'Ext.window.Window',
    xtype: 'relationshipprototype',
    requires: [
        'Ext.data.Store',
        'Ext.ux.relationshipBuilder.store.UnitTests',
        'Ext.ux.relationshipBuilder.view.VisualBuilder'
    ],
    height: 620,
    header: false,
    width: 1000,
    type: 'design',
    relationType: ['design', 'parent'],
    layout: 'border',
    instanceId: null,
    initComponent: function() {
        var me = this,
            Ex = Ext;
        // me.instanceId = me.instanceId || Ex.id(null, 'visualbuildertool');
        var testStore = Ext.create('Ext.ux.relationshipBuilder.store.UnitTests');
        testStore.load();
        var record = testStore.findRecord('instanceId', me.instanceId, false, false, false, true);
        // if (record)
        // {
        Ext.applyIf(me, {
            title: Ext.localization.sourceRelationshipWindow.visualBuilder.title,
            items: [{
                xtype: 'visualrelationbuilder',
                masterRecord: record,
                instanceId: me.instanceId,
                rawTables: (record) ? record.get('rawTables') : null,
                rawJoins: (record) ? record.get('rawJoins') : null,
                rawSources: (record) ? record.get('rawSources') : null,
                testStore: testStore,
                listeners: {
                    'close': function() {
                        me.close();
                    }
                }
            }]
        });
        // }

        me.callParent(arguments);
    }
});