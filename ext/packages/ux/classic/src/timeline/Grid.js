/**
 * Created by hmorjan on 07-Apr-16.
 */
Ext.define('Ext.ux.timeline.Grid', {
    extend: 'Ext.grid.Panel',
    xtype: 'timelineGrid',
    requires: [
        'Ext.grid.plugin.BufferedRenderer'
    ],
    initComponent: function() {
        var me = this;
        var columns = [
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.action,
                dataIndex: 'actionDescription',
                filter: 'string',
                type: 'string'
            },
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.menuDescription,
                dataIndex: 'menuDescription',
                filter: 'string'
            },
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.username,
                dataIndex: 'fullName',
                filter: 'string'
            },
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.role,
                dataIndex: 'uuidRoleName',
                filter: 'string'
            },
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.date,
                dataIndex: 'dateString',
                filter: 'date'
            },
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.recordName,
                dataIndex: 'recordName',
                filter: 'string'
            },
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.recordDescription,
                dataIndex: 'recordDescription',
                filter: 'string'
            },
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.comment,
                dataIndex: 'comment',
                filter: 'string',                
                type: 'string'
            },
            {
                text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.data,
                dataIndex: 'data',
                filter: 'string',
                hidden: true
            }
        ];
        
        Ext.apply(me, {
            store: me.store,
            columns: {
                defaults: {
                    filter: false,
                    flex: 1
                },
                items: me.columns
            },
            plugins: [{
                ptype: 'bufferedrenderer',
                trailingBufferZone: 10, // Keep 20 rows rendered in the table behind scroll
                leadingBufferZone: 20 // Keep 50 rows rendered in the table ahead of scroll
            }]
        });
        me.callParent(arguments);
    }
});