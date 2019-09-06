/**
 * UPDATE  @esanchez
 * @author Desar_6 on 30/01/2015.
 * @class  Ext.ux.design.Panel
 * @xtype designPanel
 * @extends Ext.panel.Panel
 */
Ext.define('Ext.ux.design.Panel', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.design.store.DataConnection',
        'Ext.ux.design.store.DataSource',
        'Ext.ux.design.store.ParameterManager',
        'Ext.ux.design.store.RelationshipSources',
        'Ext.ux.design.store.Label',
        'Ext.ux.panel.JsonPanel',
        'Ext.ux.data.prototype.Proxy',
        'Ext.ux.widget.parameter.View',
        'Ext.ux.widget.parameter.field.Text',
        'Ext.layout.container.HBox',
        'Ext.ux.design.FloatingToolbar'
    ],
    layout: 'fit',
    xtype: 'designPanel',
    context: {},
    showMenu: true,
    showToolbar: true,
    parameters: [],
    instanceId: null,
    getContext: function() {
        return this.context;
    },
    initComponent: function() {
        var me = this,
            Ex = Ext,
            ExLocale = Ex.localization,
            usedCreateAnother = false;

        var connectionStore = Ext.create('Ext.ux.design.store.DataConnection', {
            uuidDesign: me.designId,
            instanceId: me.instanceId
        });

        var RelationshipStore = Ex.create('Ext.ux.design.store.RelationshipSources', {
            uuidDesign: me.desinId,
            instanceId: me.instanceId
        });

        var sourceStore = Ext.create('Ext.ux.design.store.DataSource', {
            saveHistoricalCallback: me.historical,
            uuidDesign: me.designId,
            instanceId: me.instanceId
        });

        var helpStore = Ext.create('Ext.ux.design.store.Help');
        var parameterManagerStore = Ext.create('Ext.ux.design.store.ParameterManager');
        var labelStore = Ext.create('Ext.ux.design.store.Label');

        me.context = {
            ConnectionStore: connectionStore,
            SourceStore: sourceStore,
            ParameterManagerStore: parameterManagerStore,
            RelationshipJoinStore: RelationshipStore,
            LabelStore: labelStore,
            HelpStore: helpStore
        };
        // TODO: Validar loop
        me.context.ConnectionStore.context = me.context;
        me.context.SourceStore.context = me.context;
        me.context.ParameterManagerStore.context = me.context;
        me.context.RelationshipJoinStore.context = me.context;
        me.context.LabelStore.context = me.context;
        me.context.HelpStore.context = me.context;

        var jsonCanvas = Ext.widget('jsonPanel', {
            context: me.context,
            instanceId: me.instanceId,
            instanceMode: me.instanceMode,
            records: me.records,
            designId: me.designId,
            showMenu: me.showMenu,
            showToolbar: me.showToolbar,
            designConfig: me.designConfig,
            dynamicToolbar: me.dynamicToolbar,
            titleText: me.titleText,
            parameters: me.parameters
        });

        var customToolbar = Ex.widget('customdesigntoolbar', {
            instanceMode: me.instanceMode,
            showMenu: me.showMenu,
            showToolbar: me.showToolbar,
            dynamicToolbar: me.dynamicToolbar,
            instanceId: me.menuId,
            container: me,
            /* set and override actions handler */
            closeCallback: me.closeCallback,
            saveCallback: me.saveCallback,
            beforeCreateCallback: me.beforeCreateCallback,
            beforeRemoveCallback: me.beforeRemoveCallback || function(removeCallback) {
                Ex.Msg.confirm(ExLocale.apiName, ExLocale.jsonPanel.msgText.formHasChanges, function(btn) {
                    if (btn == 'yes') {
                        if (removeCallback) {
                            removeCallback();
                        }
                    }
                }, me);
            },
            updateCallback: me.updateCallback,
            cancelHandler: function() {
                sourceStore.on('changesVerified', function(hasChanged) {
                    if (hasChanged) {
                        Ex.Msg.confirm(ExLocale.apiName, ExLocale.jsonPanel.msgText.formHasChanges, function(btn) {
                            if (btn == 'yes') {
                                me.dynamicToolbar.clearContent();
                                if (me.closeCallback) me.closeCallback(usedCreateAnother);
                            }
                        }, me);
                    } else {
                        me.dynamicToolbar.clearContent();
                        if (me.closeCallback) me.closeCallback(usedCreateAnother);
                    }
                }, me, {
                    single: true
                });
                sourceStore.verifySourceChanges(true);
            }, // cancel close panel etc
            updateHandler: function(btn) {
                var doUpdate = function() {
                    var isValid = jsonCanvas.isValid();
                    if (isValid) {
                        var successCallback = function(response) {
                            var responseText = Ex.JSON.decode(response.responseText);
                            if (responseText.success) {
                                me.showMessage(ExLocale.jsonPanel.msgText.updateSuccess);
                                if (me.updateCallback) {
                                    me.updateCallback(me.closeCallback());
                                } else if (me.closeCallback) {
                                    me.closeCallback();
                                }
                            } else {
                                me.showMessage(ExLocale.jsonPanel.msgText.errorSuccess, 'error');
                            }
                        };
                        var defaultCallback = function(close) {
                            if (me.getEl()) {
                                me.getEl().unmask();
                            }
                            if (close) {
                                me.closeCallback();
                            }
                        };
                        me.getEl().mask(ExLocale.jsonPanel.msgText.updating);
                        sourceStore.batchUpdateSources({
                            success: successCallback,
                            callback: defaultCallback,
                            createAnother: btn.createAnother,
                            historical: me.historical
                        });
                    }
                };
                if (me.beforeUpdateCallback) {
                    me.beforeUpdateCallback(doUpdate);
                } else {
                    doUpdate();
                }
            },
            newHandler: function(btn) {
                // values obtains on confidence lvl dialog
                var doCreate = function(args) {
                    args = args || {};
                    if (args.globalParameterName && args.value) {
                        sourceStore.cangeValueByGlobalParam(args);
                    }
                    var isValid = jsonCanvas.isValid();
                    if (isValid) {
                        var successCallback = function(response) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                me.showMessage(ExLocale.jsonPanel.msgText.updateSuccess);
                                if (!btn.createAnother) {
                                    usedCreateAnother = true;
                                    if (me.saveCallback) {
                                        me.saveCallback(me.closeCallback);
                                    } else if (me.closeCallback) {
                                        me.closeCallback();
                                    }
                                } else {
                                    usedCreateAnother = true;
                                }
                            } else {
                                me.showMessage(ExLocale.jsonPanel.msgText.errorSuccess, 'error');
                            }
                        };
                        var defaultCallback = function(response) {
                            if (me.getEl()) {
                                me.getEl().unmask();
                            }
                        };
                        me.getEl().mask(ExLocale.jsonPanel.msgText.updating);
                        sourceStore.batchCreateSources({
                            success: successCallback,
                            callback: defaultCallback,
                            createAnother: btn.createAnother,
                            historical: me.historical
                        });
                    } else {
                        me.showMessage(Ex.localization.jsonPanel.msgText.formInvalid, 'error');
                    }
                };
                if (me.beforeCreateCallback) {
                    me.beforeCreateCallback(doCreate);
                } else {
                    doCreate();
                }
            },
            removeHandler: function(btn) {
                var doRemove = function() {
                    var successCallback = function(response) {
                        var responseText = Ext.JSON.decode(response.responseText);
                        if (responseText.success) {
                            me.showMessage(ExLocale.jsonPanel.msgText.updateSuccess);
                            if (me.saveCallback) {
                                me.saveCallback(me.closeCallback);
                            } else if (me.closeCallback) {
                                me.closeCallback();
                            }
                        } else {
                            me.showMessage(ExLocale.jsonPanel.msgText.errorSuccess, 'error');
                        }
                    };
                    var defaultCallback = function(response) {
                        if (me.getEl()) {
                            me.getEl().unmask();
                        }
                    };
                    me.getEl().mask(ExLocale.jsonPanel.msgText.updating);
                    sourceStore.batchRemoveSources({
                        success: successCallback,
                        callback: defaultCallback,
                        createAnother: btn.createAnother,
                        historical: me.historical
                    });
                };
                Ex.Msg.confirm(ExLocale.apiName, ExLocale.jsonPanel.msgText.removeRecord, function(btn) {
                    if (btn == 'yes') {
                        if (me.beforeRemoveCallback) {
                            me.beforeRemoveCallback(doRemove);
                        } else {
                            doRemove();
                        }
                    }
                }, me);
            }
        });

        Ex.applyIf(me.context, {
            Container: me,
            FloatingToolbar: customToolbar
        });

        me.processQueue = function(callback) {
            jsonCanvas.processQueue(callback);
        };
        me.loadDesign = function(designId, instanceMode) {
            // jsonCanvas.on("afterlayout", function () { me.processQueue(); });
            jsonCanvas.loadDesign(designId, instanceMode === 'new', 'design');
        };
        me.getScope = function() {
            return jsonCanvas;
        };

        Ext.applyIf(me, {
            dockedItems: [],
            items: [jsonCanvas]
        });

        me.callParent(arguments);
    },
    showMessage: function(msg, type, layout, delay) {
        Ext.Notify.msg(msg, {
            layout: layout || 'bottomright',
            delay: delay || 5000,
            type: type || 'success'
        });
    }
});