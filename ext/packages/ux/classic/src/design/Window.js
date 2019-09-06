/**
 * [define description]
 * @param  {[type]} "Ext.ux.design.Window"                 [description]
 * @return {[type]}                                         [description]
 */
Ext.define('Ext.ux.design.Window', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.design.store.DataConnection',
        'Ext.ux.design.store.DataSource',
        'Ext.ux.design.store.ParameterManager',
        'Ext.ux.design.store.Label',
        'Ext.ux.panel.JsonPanel',
        'Ext.ux.data.prototype.Proxy',
        'Ext.ux.widget.parameter.View',
        'Ext.ux.widget.parameter.field.Text',
        'Ext.layout.container.HBox'
    ],
    layout: 'fit',
    xtype: 'designWindow',
    context: null,
    modal: true,
    width: 900,
    height: 600,
    parameters: [],
    showMenu: false,
    closable: true,
    floating: true,
    showToolbar: false,
    getContext: function() {
        return this.context;
    },
    initComponent: function() {
        var me = this;
        var connectionStore = Ext.create('Ext.ux.design.store.DataConnection');
        var sourceStore = Ext.create('Ext.ux.design.store.DataSource');
        var parameterManagerStore = Ext.create('Ext.ux.design.store.ParameterManager');
        var labelStore = Ext.create('Ext.ux.design.store.Label');
        var jsonCanvas = Ext.create('Ext.ux.panel.JsonPanel', {
            instanceId: me.instanceId,
            instanceMode: me.instanceMode,
            width: 900,
            height: 600,
            records: me.records,
            designId: me.designId,
            showMenu: me.showMenu,
            showToolbar: me.showToolbar,
            designConfig: me.designConfig,
            dynamicToolbar: me.dynamicToolbar,
            parameters: me.parameters,
            closeCallback: me.closeCallback,
            saveCallback: me.saveCallback,
            updateCallback: me.updateCallback
        });

        /**
         * Dynamic Methods
         * @type {Object}
         */
        me.context = {
            ConnectionStore: connectionStore,
            SourceStore: sourceStore,
            ParameterManagerStore: parameterManagerStore,
            LabelStore: labelStore
        };

        me.processQueue = function(callback) {
            jsonCanvas.processQueue(callback);
        };
        me.loadDesign = function(designId, instanceMode) {
            jsonCanvas.on('afterlayout', function() {
                me.processQueue();
            }, me, {
                single: true
            });
            jsonCanvas.loadDesign(designId, instanceMode === 'new');
        };
        me.doInnerLayout = function() {
            jsonCanvas.doLayout();
        };
        me.getScope = function() {
            return jsonCanvas;
        };
        Ext.applyIf(me, {
            dockedItems: [],
            items: [jsonCanvas]
        });
        me.callParent(arguments);
    }
});