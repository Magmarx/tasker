/**
 * Container **Panel** which implements a custom scroll-bar to be used in form designer
 * @author Desar_6 on 03/07/2014.
 * @class Ext.ux.widget.panel.ColumnLayout
 * @extends Ext.ux.widget.panel.LayoutFactory
 * @xtype customcolumnlayout
 */
Ext.define('Ext.ux.widget.panel.ColumnLayout', {
    extend: 'Ext.ux.widget.panel.LayoutFactory',
    xtype: 'customcolumnlayout',
    layout: {
        type: 'hbox',
        align: 'center'
    },
    defaults: {
        flex: 1,
        xtype: 'columnpanel'
    }
});