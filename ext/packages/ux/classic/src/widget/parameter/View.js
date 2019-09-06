/**
 * Created by Desar_6 on 26/01/2015.
 */
Ext.define('Ext.ux.widget.parameter.View', {
    extend: 'Ext.window.Window',
    requires: ['Ext.ux.widget.parameter.Panel'],
    bodyStyle: 'background-color: rgb(160, 172, 184);',
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [{
                xtype: 'parameterPanel',
                scope: me
            }]
        });
        me.callParent(arguments);
    }

});