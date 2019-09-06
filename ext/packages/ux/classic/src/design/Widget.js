/**
 * User: MYAX
 * Date: 2/16/16
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 * @param  { String } "Ext.ux.design.Widget"
 * @return { Ext.ux.design.Widget }
 */
Ext.define('Ext.ux.design.Widget', {
    extend: 'Ext.panel.Panel',
    xtype: 'xtypePanel',
    mixins: [
        'Ext.ux.loader.MPC'
    ],
    requires: [
        'Ext.ux.design.store.CodeFiles',
        'Ext.ux.design.store.Label',
        'Ext.ux.design.store.Help'
    ],
    context: null,
    layout: 'fit',
    instanceId: null,
    getContext: function() {
        return this.context;
    },
    initComponent: function() {
        var me = this,
            Ex = Ext,
            codeFileStore = Ex.create('Ext.ux.design.store.CodeFiles', {
                instanceId: me.instanceId
            }),
            labelStore = Ex.create('Ext.ux.design.store.Label', {
                instanceId: me.instanceId
            }),
            helpStore = Ext.create('Ext.ux.design.store.Help', {
                instanceId: me.instanceId
            });
        /**
         * @type {Object}
         */
        me.context = {
            LabelStore: labelStore,
            FileStore: codeFileStore,
            HelpStore: helpStore,
            Container: me
        };

        me.callParent(arguments);
        me.loadDesign(me.params.uuidXType, true, 'widget');
        me.callback = function(name) {
            if (!name) {
                name = codeFileStore.register();
            }

            if (name) {
                var panel = Ex.create(name, {
                    instanceId: me.instanceId
                });
                me.add(panel);
            }
        };
    }
});