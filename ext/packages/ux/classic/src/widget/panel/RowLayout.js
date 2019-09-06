/**
 * [extend description]
 * @author
 * @class Ext.ux.widget.panel.RowLayout
 * @extends Ext.ux.widget.panel.LayoutFactory
 * @xtype customrowlayout
 */
Ext.define('Ext.ux.widget.panel.RowLayout', {
    extend: 'Ext.ux.widget.panel.LayoutFactory',
    xtype: 'customrowlayout',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    defaults: {
        xtype: 'columnpanel',
        flex: 1
            // width: '100%'
    }
});