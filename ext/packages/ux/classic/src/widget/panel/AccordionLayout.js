/**
 * @author
 * @class Ext.ux.widget.panel.AccordionLayout
 * @extends Ext.ux.widget.panel.LayoutFactory
 * @requires Ext.layout.container.Accordion
 * @xtype customaccordionlayout
 */
Ext.define('Ext.ux.widget.panel.AccordionLayout', {
    extend: 'Ext.ux.widget.panel.LayoutFactory',
    requires: ['Ext.layout.container.Accordion'],
    xtype: 'customaccordionlayout',
    layout: {
        type: 'accordion',
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    },
    defaults: {
        xtype: 'columnpanel',
        flex: 1
    }
});