/**
 * Created by hmorjan on 02-Mar-16.
 */
Ext.define('Ext.ux.timeline.DetailPropertyGrid', {
    extend: 'Ext.ux.grid.property.Grid',
    xtype: 'detailPropertyGrid',
    propertyArray: [],
    layout: 'fit',
    groupHeaderTitle: 'File detail',
    columnWidth: 100,
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            autoScroll: true,
            hideHeaders: true,
            groupingConfig: {
                groupHeaderTpl: me.groupHeaderTitle,
                disabled: false,
                startCollapsed: false
            }
        });
        me.on('afterrender', function() {
            var columns = this.columns;
            columns[0].setWidth(me.columnWidth);
        });
        me.callParent(arguments);
    }
});