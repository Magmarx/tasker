/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 10/10/13
 * Time: 02:25 PM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.grid.Panel', {
    extend: 'Ext.grid.Panel',
    requires: [
        // 'Ext.ux.exporter.Exporter',
        // "Ext.form.field.ComboBox",
        // 'Ext.ux.panel.JsonPanel',
        'Ext.window.Window',
        'Ext.ux.widget.form.field.ComboBox',
        'Ext.grid.column.Action',
        'Ext.button.Button'
    ],
    xtype: 'customgridpanel',
    // scrollable: true,
    config: {
        requiredRecords: true,
        isPivoteMode: false,
    },
    initComponent: function () {
        var me = this,
            Ex = Ext,
            context = me.stores;

        // <debug>
        console.log(me.configData);
        // </debug>

        if (context) {
            try {
                // me.instanceId = me.instanceId || me.configData.instanceId;

                var addButton = null,
                    removeColumnButton = null,
                    updateColumnButton = null;

                me.configData = me.configData || {};

                Ext.Object.merge(me.configData, {
                    styleData: {},
                    sourceConfig: {},
                    extraFeatures: {}
                });

                var ExArray = Ex.Array,
                    ExLocale = Ex.localization.gridPanel,
                    activeMode = ['new', 'update'].includes(me.actionMode);

                var showMessage = function (message, type) {
                    if (!Ext.isEmpty(message)) {
                        Ex.Notify.msg(
                            message, {
                                layout: 'bottomright',
                                delay: 5000,
                                type: type
                            });
                    }
                };

                var labelStore = context.labelStore,
                    store = null,
                    sourceRecord = null,
                    lkCombo = null,
                    lkStore = null,
                    columns = [];

                me.requiredRecords = me.configData.extraFeatures.requiredRecords;
                // instanciate buttons
                if (activeMode && me.configData.extraFeatures.enableButtons) {
                    addButton = Ex.widget('button', {
                        name: 'lookup' + me.configData.name,
                        iconCls: Ext.manifest.globals.fontBasePrefix + 'add' + Ext.manifest.globals.fontBasePostfix,
                        tooltip: ExLocale.buttons.addRecord
                    });

                    removeColumnButton = {
                        tooltip: ExLocale.buttons.removeRecord,
                        width: 28,
                        // iconCls: Ext.manifest.globals.fontBasePrefix + 'delete' + Ext.manifest.globals.fontBasePostfix,
                        iconCls: 'x-fa fa-trash',
                        text: '',
                        name: 'remove' + me.configData.name,
                        xtype: 'actioncolumn',
                        handler: function (grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            if (rec) {
                                store.remove(rec);
                            }
                        }
                    };

                    updateColumnButton = {
                        tooltip: ExLocale.buttons.editRecord,
                        width: 28,
                        // iconCls: Ext.manifest.globals.fontBasePrefix + 'edit' + Ext.manifest.globals.fontBasePostfix,
                        iconCls: 'x-fa fa-pencil',
                        text: '',
                        name: 'edit' + me.configData.name,
                        xtype: 'actioncolumn'
                    };
                }

                // me.callback = function (initialConfig) {
                //     me.fireEvent('updatedobject');
                //     // <debug>
                //     console.log(initialConfig);
                //     // </debug>
                // };

                if (!Ext.isEmpty(me.configData.name)) {
                    if (context.sourceStore) {
                        // sourceRecord = context.sourceStore.findRecord('name', me.configData.name, 0, false, false, true);
                        sourceRecord = context.sourceStore.getSourceByName(me.configData.name);
                        if (sourceRecord) {
                            store = sourceRecord.get('source');
                            sourceRecord.data.gridBinding = me.id;
                        }
                    }
                }
                var columnsConfig = (store) ? Ex.clone(me.configData.columns) : [];
                // validate if columns count = 2 then posible pivot table.
                if (columnsConfig.length === 2) {
                    // confirm pivot talbe
                    var columnList = store.columns || [],
                        /**
                         * el tipo de campo 'both' define que una columna es una llave primary como foreign
                         */

                        foreingColumns = columnList.filter(function (item, index) {
                            return ['foreign', 'both'].includes(item.key);
                        });

                    if (foreingColumns.length == 2) {
                        me.setIsPivoteMode(true);
                        var // lksource,
                            lkConfig,
                            lookupColumn,
                            displayColumn,
                            // sourceRec,
                            findMainSource = false;

                        ExArray.each(columnsConfig, function (columnconf, index) {
                            if (columnconf.lookupEditor) {
                                lookupColumn = columnconf.dataIndex;
                                // columnconf.hidden = true;
                            } else {
                                displayColumn = columnconf.dataIndex;
                                // columnconf.name = columnconf.dataIndex;
                            }
                            columnconf.dataIndex += '$$';
                        });

                        if (lookupColumn) { // find lookup configuration and combo
                            var fieldRecord = context.sourceStore.getFieldRecordBySourceAndName(me.configData.name, lookupColumn);
                            lkConfig = (fieldRecord) ? fieldRecord.get('lookup') : null;
                            if (lkConfig && activeMode && me.configData.extraFeatures.enableButtons) {
                                lkCombo = Ex.widget('universalComboBox', {
                                    // lkCombo = {
                                    // xtype: 'universalComboBox',
                                    layout: 'fit',
                                    flex: 1,
                                    lookupConfig: lkConfig,
                                    actionMode: me.actionMode,
                                    hideLabel: true,
                                    isFilterMode: true,
                                    instanceId: me.instanceId,
                                    stores: context,
                                    forceLoad: true,
                                    listeners: {
                                        'afterrender': function (combo) {
                                            var store = combo.getStore();
                                            if (store && !store.count()) {
                                                store.load();
                                            }
                                        }
                                    }
                                });
                            }
                        }
                        // show message to client if not lookup configuration defined.
                        if (lookupColumn && !lkConfig) {
                            showMessage(lookupColumn + ', ' + ExLocale.msgText.lookupUndefinded, 'warning');
                        }

                        if (addButton) {
                            // default action to pivot table
                            addButton.handler = function () {
                                if (lkCombo) {
                                    // context.ParameterManagerStore;
                                    var value = lkCombo.getValue();
                                    if (value) {
                                        // var record = lkCombo.findRecordByValue(lkCombo.getValue())
                                        var data = {};
                                        var exist = store.findRecord(lookupColumn, value, 0, 0, 0, 1);
                                        if (!exist) {
                                            data[lookupColumn] = value;
                                            data[lookupColumn + '$$'] = lkCombo.getRawValue(); //  display value
                                            var record = store.createNewRecord();

                                            record.set(data);
                                            store.add(record);
                                            // store.add(data);
                                            lkCombo.clearValue();
                                        } else {
                                            showMessage(ExLocale.msgText.duplicated, 'error');
                                        }
                                    }
                                }
                            };
                        }
                    }
                } else {
                    // / private
                    var getEditorWindow = function (record, isNew) {
                        //<debug>

                        console.log('Validar la implementacion', arguments);
                        //</debug>
                        // if (record) {
                        //     if (isNew) {
                        //         store.add(record);
                        //     }

                        //     record.beginEdit();
                        //     var rawDesign = sourceRecord.get('design'),
                        //         jsonCanvas = null;

                        //     if (rawDesign !== '{}') {
                        //         // jsonCanvas = Ext.widget('jsonPanel', {
                        //         //     layout: 'fit',
                        //         //     titleText: context.Container.titleText + ' - ' + me.title,
                        //         //     context: context,
                        //         //     instanceId: me.instanceId,
                        //         //     instanceMode: instanceMode,
                        //         //     record: record
                        //         // });

                        //         var windowEditor = Ex.widget('window', {
                        //             title: ExLocale.editing,
                        //             maximized: true,
                        //             /**
                        //              * @todo evaluar la implementacion de un scope general por ventaja
                        //              * invocando al cardmanager
                        //              */
                        //             // constrain: true,
                        //             // constrainTo: context.Container.id,
                        //             layout: 'fit',
                        //             buttons: [{
                        //                 text: ExLocale.buttons.okEdit,
                        //                 name: 'editPartialView',
                        //                 handler: function () {
                        //                     record.set(record.getChanges());
                        //                     record.endEdit();
                        //                     windowEditor.close();
                        //                 }
                        //             }, {
                        //                 text: ExLocale.buttons.cancelEdit,
                        //                 name: 'cancelEditPartialView',
                        //                 handler: function () {
                        //                     record.cancelEdit();
                        //                     if (isNew) {
                        //                         store.remove(record);
                        //                     }
                        //                     windowEditor.close();
                        //                 }
                        //             }],
                        //             listeners: {
                        //                 'afterrender': function (win) {
                        //                     // <debug>
                        //                     console.log(rawDesign);
                        //                     // </debug>
                        //                     win.add(jsonCanvas);
                        //                     jsonCanvas.setConfig(rawDesign);
                        //                 }
                        //             }
                        //         });

                        //         context.Container.add(windowEditor);

                        //         windowEditor.show();
                        //     }
                        // }
                    };

                    // normal grid

                    if (addButton) {
                        // overwrite handler function.
                        addButton.handler = function () {
                            getEditorWindow(store.createNewRecord(), true);
                        };
                    }

                    if (updateColumnButton) {
                        updateColumnButton.handler = function (grid, rowIndex, colIndex) {
                            var record = grid.getStore().getAt(rowIndex);
                            getEditorWindow(record);
                        };

                        ExArray.push(columnsConfig, updateColumnButton);

                        me.on('itemdblclick', function (grid, record, item, index, e, eOpts) {
                            getEditorWindow(record);
                        });
                    }
                }

                if (lkCombo || addButton) {
                    Ex.apply(me, {
                        scrollable: true,
                        tbar: [
                            (lkCombo) ? lkCombo : '->',
                            addButton
                        ]
                    });
                }

                if (removeColumnButton) {
                    ExArray.push(columnsConfig, removeColumnButton);
                }

                columns = columnsConfig;

                ExArray.each(columnsConfig, function (column) {
                    var referenceLabelName = column.text.replace('{', '').replace('}', '');
                    if (labelStore) {
                        if (!Ex.isEditMode) {
                            var labelValue = labelStore.getValueByReferenceName(referenceLabelName);
                            if (labelValue !== '') {
                                column.text = labelValue;
                            } else {
                                column.text = '{' + referenceLabelName + '}';
                            }
                        } else {
                            column.text = '{' + referenceLabelName + '}';
                        }
                    }
                    column.editor = 'textfield';
                });
                if (!store) {
                    store = Ex.create('Ext.data.Store', {
                        fields: ['description'],
                        data: [{
                            description: ExLocale.msgText.noSourceMessage
                        }],
                        proxy: {
                            type: 'memory'
                        }
                    });
                }

                if (me.configData.sortArray.length > 0) {
                    store.setSort(me.configData.sortArray, false);
                }
                //    store.sort(me.configData.sortArray);

                me.configData.styleData = me.configData.styleData || {};
                // var panelStyle;
                // if (me.configData.styleData.border)
                //    panelStyle = " border: " + me.configData.styleData.borderSize + "px " + me.configData.styleData.borderStyle + " #" + me.configData.styleData.borderColor + "!important; " + me.style;

                me.on('afterrender', function () {
                    me.hidden = me.configData.extraFeatures.hidden || false;
                    me.collapsed = me.configData.extraFeatures.collapsed || false;
                    if (me.configData.extraFeatures.actionId) {
                        me.actionId = me.configData.extraFeatures.actionId;
                    }
                    /**
                     * @todo resolver la linea de dependencias de registro para evitar la
                     * creacion del un registro en blanco en la cascada
                     */
                    if (me.actionMode === 'new') {
                        store.removeAll();
                    }
                }, me, {
                        single: true
                    });

                Ex.apply(me, {
                    title: labelStore.getValueByReferenceName(me.configData.extraFeatures.referenceLabelName),
                    // height: parseInt(me.configData.styleData.height) || 200,
                    height: 300,
                    border: me.configData.styleData.border || true,
                    store: store,
                    columns: columns,
                    setRequired: function (value) {
                        me.requiredRecords = value;
                        me.isValid();
                    },
                    isValid: function (silent) {
                        var isValid = (me.requiredRecords) ? store.count() : 1;

                        if (me.rendered) {
                            if (isValid) {
                                me.removeCls('jumerror-flat');
                            } else {
                                if (!silent) {
                                    showMessage(me.title + ".  " + ExLocale.msgText.requiredRecords, 'error');
                                }
                                me.addCls('jumerror-flat');
                            }
                        }
                        return isValid;
                    },
                    viewConfig: {
                        emptyText: Ex.isEditMode ? ExLocale.msgText.noDataInEditMode : ExLocale.msgText.noDataToDisplay,
                        deferEmptyText: false
                    }
                });
                store.on('datachanged', function (store, eopts) {
                    if (me.getIsPivoteMode() && lkStore) {
                        var recordList = store.getRange() || [];
                        var keyList = [];
                        if (recordList.length) {
                            for (var j = 0; j < recordList.length; j++) {
                                var item = recordList[j];
                                keyList.push(item.get(lookupColumn));
                            }
                        }
                        if (keyList.length) {
                            /**
                             * set filter
                             */
                            lkStore.setFilter({
                                dataIndex: columnList,
                                value: keyList
                            });

                        } else {
                            /**
                             * clear filter
                             */
                            lkStore.clearFilter();
                        }
                        //<debug>

                        console.log('list', keyList);
                        //</debug>
                    }
                    if (me.requiredRecords) {
                        me.isValid(true);
                    }
                });

                if (me.configData.extraFeatures.exportData) {
                    var exportButton = new Ex.ux.exporter.Button({
                        component: me,
                        store: store,
                        text: ExLocale.buttons.downloadXLS
                    });
                    // if (me.exportEnabled){
                    Ex.apply(me, {
                        tbar: [exportButton]
                    });
                    // }
                }
                if (me.configData.extraFeatures.pagingToolbar) {
                    // /**
                    //  * DYNAMIC PAGE SIZE
                    //  * @type {number}
                    //  */
                    // store.pageSize = me.configData.extraFeatures.pageSize;
                    // store.params.paging = true;
                    // store.proxy.reader.root = 'rows';
                    // store.proxy.reader.totalProperty = 'results';
                    // // if (me.exportEnabled){
                    // Ex.apply(me, {
                    //     dockedItems: [{
                    //         xtype: 'pagingtoolbar',
                    //         store: store, // same store GridPanel is using
                    //         dock: 'bottom',
                    //         displayInfo: true
                    //     }]
                    // });
                    // }
                } else {
                    // store.pageSize = 25;
                    // delete store.params.paging;
                    // delete store.proxy.reader.root;
                    // delete store.proxy.reader.totalProperty;
                }
                // //<debug>
                // me.store.on("load", function (strore, records, event)
                // {
                //    console.log(records);
                // });
                // me.on("itemclick", function (grid, record, item, index, e, eOpts)
                // {
                //    console.log(record)
                // });
                // //</debug>
                me.callParent(arguments);
                // me.on("firedbutton", function ()
                // {
                //    var w = new Ext.create('MPA.widget.config.grid.Panel', {
                //        instanceId: me.instanceId,
                //        callback: me.callback,
                //        myConfig: me.initialConfig
                //    }).show();

                //    w.on("confirmchange", function ()
                //    {
                //        me.fireEvent("confirmchange");
                //    });
                // }, me);
            } catch (e) {
                // <debug>
                console.error(e);
                // </debug>
            }
        }
    }
});