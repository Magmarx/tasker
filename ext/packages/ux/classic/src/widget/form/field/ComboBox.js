/**
 * @author MYAX on 8/03/2015.
 * @class Ext.ux.widget.form.field.ComboBox
 * @extends Ext.form.field.ComboBox
 * @mixins Ext.ux.widget.form.field.Base
 * @xtype universalComboBox
 */
Ext.define('Ext.ux.widget.form.field.ComboBox', {
    extend: 'Ext.form.field.ComboBox',
    mixins: ['Ext.ux.widget.form.field.Base'],
    required: ['Ext.ux.grid.FilterBar'],
    lookupConfig: null,
    xtype: 'universalComboBox',
    /**
     * Implement field on filter bar to grid (defaults false).
     * @type {Boolean} false
     */
    isFilterMode: false,
    instanceId: null,
    forceSelection: true,
    queryMode: 'local',
    anyMatch: true,
    forceLoad: true,
    openWin: false,
    triggers: {
        clear: {
            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            weight: 2, // negative to place before default triggers
            hidden: true,
            hideOnReadOnly: false,
            handler: function(combo) {
                var Elocale = Ext.localization.universalField.combobox;

                Ext.MessageBox.confirm(
                    Ext.localization.generic.warning,
                    Elocale.clearMessage,
                    function(btn, text) {
                        if (btn === 'yes') {
                            combo.setValue(null);
                            combo.lastSelectedRecords = null;
                        }
                    },
                    combo
                );
            },
            onClick: function() {
                var me = this,
                    args = arguments,
                    e = me.clickRepeater ? args[1] : args[0],
                    handler = me.handler,
                    field = me.field;
                if (handler && me.isFieldEnabled()) {
                    Ext.callback(me.handler, me.scope, [field, me, e], 0, field);
                }
            }
        },
        search: {
            cls: 'x-fa fa-search',
            weight: 3,
            hidden: true,
            hideOnReadOnly: false,
            handler: function(combo) {
                if (!combo.openWin) {
                    combo.showWindow();
                }
            },
            onClick: function() {
                var me = this,
                    args = arguments,
                    e = me.clickRepeater ? args[1] : args[0],
                    handler = me.handler,
                    field = me.field;
                if (handler && me.isFieldEnabled()) {
                    Ext.callback(me.handler, me.scope, [field, me, e], 0, field);
                }
            }
        }
    },
    /**
     * @method initComponent
     * @override
     */
    initComponent: function() {
        var me = this,
            Ex = Ext,
            context = me.stores,
            Elocale = Ex.localization.universalField.combobox,
            dataSourceStore = context.sourceStore,
            sourceStore = dataSourceStore ? dataSourceStore.getSourceById(me.lookupConfig.token) : null;

        var dataTemp = {};
        dataTemp[me.lookupConfig.pkField] = -1;
        dataTemp[me.lookupConfig.lookupField] = Elocale.previewMode;

        var storeConfig =
            sourceStore ||
            Ex.create('Ext.data.Store', {
                autoLoad: true,
                fields: [me.lookupConfig.pkField, me.lookupConfig.lookupField],
                data: [dataTemp],
                proxy: {
                    type: 'memory'
                }
            });
        storeConfig.setRemoteFilter(false);
        if (!Ext.isEmpty(me.lookupConfig.aliasBySource)) {
            var aliasBySource = Ext.decode(me.lookupConfig.aliasBySource);

            if (!Ext.Object.isEmpty(aliasBySource.searchField)) {
                if (aliasBySource.dictionary.length > 0) {
                    var aliasStore = Ext.create('Ext.data.Store', {
                        fields: ['internalString', 'sourceName'],
                        proxy: {
                            type: 'memory',
                            reader: {
                                type: 'json'
                            }
                        },
                        data: aliasBySource.dictionary
                    });

                    me.editable = false;

                    me.on(
                        'change',
                        function(combo, newValue, oldValue, eOpts) {
                            newValue = combo.getValue();
                            var newValueRecord = combo.findRecordByValue(newValue);
                            var oldValueRecord = combo.findRecordByValue(oldValue);

                            var newAliasConfig = newValueRecord
                                    ? aliasStore.findRecord(
                                        'internalString',
                                        newValueRecord.get(aliasBySource.searchField),
                                        0,
                                        false,
                                        false,
                                        true
                                    )
                                    : null,
                                oldAliasConfig = oldValueRecord
                                    ? aliasStore.findRecord(
                                        'internalString',
                                        oldValueRecord.get(aliasBySource.searchField),
                                        0,
                                        false,
                                        false,
                                        true
                                    )
                                    : null;

                            var newReference;
                            var oldReference;
                            var oldComponent;
                            var custompanel = combo.up('custompanel');

                            if (oldAliasConfig) {
                                var oldAliasSourceStore = dataSourceStore.getSourceStoreByName(oldAliasConfig.get('sourceName'));
                                if (oldAliasSourceStore) {
                                    oldAliasSourceStore.removeRecords();
                                    oldReference = 'ext-wizard' + oldValue;
                                    oldComponent = custompanel.down('[extensiveDesign=' + oldReference + ']');
                                    if (oldComponent) {
                                        oldComponent.destroy();
                                    }
                                }
                            }

                            if (newAliasConfig) {
                                var sourceRecord = dataSourceStore.getSourceByName(newAliasConfig.get('sourceName')),
                                    aliasSourceStore = sourceRecord.get('source'),
                                    design = sourceRecord.get('design');
                                var designObj = Ext.decode(design);

                                // var currentRecord = aliasSourceStore.getAt(0);
                                // if (!currentRecord) {
                                //     aliasSourceStore.add(aliasSourceStore.createNewRecord());
                                // }
                                newReference = 'ext-wizard' + newValue;
                                Ex.apply(designObj, {
                                    extensiveDesign: newReference,
                                    width: '100%',
                                    border: false,
                                    scrollable: false
                                });
                                M5.app.getController('Design').insertDependencies(designObj, {
                                    stores: me.stores,
                                    actionMode: me.actionMode
                                });
                                custompanel.add(designObj);
                            }
                            if (['new', 'update'].includes(me.actionMode)) {
                                var hasValue = !Ext.isEmpty(newValue);
                                me.getTrigger('clear').setVisible(hasValue);
                                me.setReadOnly(hasValue);
                            }
                        },
                        me
                    );
                }
            } else {
                if (!['view', 'remove'].includes(me.actionMode)) {
                    me.buildAdvancedSearch(sourceStore);
                }
            }
        }

        me.on(
            'change',
            function(cmb, newValue, oldValue, eOpts) {
                var currentRec = me.configData ? me.configData.sourceConfig.record : null;

                if (currentRec) {
                    currentRec.data[me.configData.sourceConfig.dataIndex + '$$'] = newValue ? cmb.getRawValue() : '';
                }
            },
            me
        );

        if (!me.isFilterMode) {
            me.initDefaults();
            // me.initActions(me);
            me.initStyle(me);
        }

        if (!Ex.isEditMode) {
            if (!sourceStore) {
                me.lookupConfig.requestType = 'getLookupData';
                storeConfig.setProxy({
                    type: 'ajax',
                    url: Ex.manifest.handler.lookupManager,
                    extraParams: me.lookupConfig,
                    reader: {
                        type: 'json'
                    }
                });

                if (me.forceLoad) {
                    storeConfig.load();
                }
                storeConfig.getProxy().on('setToken', function(token) {
                    storeConfig.getProxy().extraParams.token = token;
                    storeConfig.load();
                });
            }
        }
        if (!Ext.isEmpty(me.lookupConfig.lookupField)) {
            storeConfig.setSort([
                {
                    property: me.lookupConfig.lookupField,
                    direction: 'ASC'
                }
            ]);
        }

        storeConfig.load();

        Ext.apply(me, {
            store: storeConfig,
            // queryMode: 'local',
            autoLoadOnValue: true,
            displayField: me.lookupConfig.lookupField,
            valueField: me.lookupConfig.pkField,
            id: Ext.id(),
            forceLoad: function() {
                //<debug>

                console.log('MPA - Universal Combo - forceLoad');
                //</debug>
                storeConfig.load();
            }
        });

        me.callParent(arguments);
    },
    /**
     * @method buildAdvancedSearch construlle la vista para invocar a una version de busqueda avanzada
     * @param {Object} store  `{}` store dinamico empleado para la invocacion
     * @private
     */
    buildAdvancedSearch: function(sourceStore) {
        var me = this,
            labelStore = me.stores.labelStore;

        var columnList = sourceStore.columns.filter(function(d, i) {
            return !Ext.Array.contains(['primary', 'foreign', 'both'], d.key);
        });

        me.columnConfig = columnList.map(function(column, i) {
            Ext.apply(column, {
                flex: 1,
                minWidth: 200,
                // maxWidth: 500,
                text: labelStore.getValueByReferenceName(column.labelName)
            });

            if (column.dataType === 'boolean') {
                column.renderer = function(value) {
                    return Ext.String.format(
                        '<i class="fa {0} fa-lg" aria-hidden="true"></i>',
                        value ? 'fa-check-circle fa-color-success' : 'fa-times-circle-o fa-color-danger'
                    );
                };
            }

            return column;
        });

        //<debug>

        console.log('advanced columns - MPA', me.columnConfig);
        //</debug>

        me.getTrigger('search').setVisible(true);
    },
    showWindow: function() {
        var me = this,
            gridStore = me.getStore(),
            customForm = me.up('customform');

        var okButton = Ext.widget('button', {
            text: Ext.localization.buttons._ok,
            disabled: true,
            handler: function() {
                var grid = win.down('grid'),
                    gridStore = gridStore,
                    record = grid.getSelection()[0];

                if (!Ext.isEmpty(record)) {
                    me.setValue(record.get(me.valueField));
                    win.close();
                }
            }
        });
        var win = Ext.create('Ext.window.Window', {
            height: '65%',
            width: '70%',
            modal: true,
            resizable: false,
            title: me.fieldLabel,
            layout: 'fit',
            constrain: true,
            constrainTo: customForm.id,
            closeToolText: Ext.localization.createBoard.closeDialog,
            items: [
                {
                    xtype: 'gridpanel',
                    columns: me.columnConfig,
                    plugins: [
                        {
                            ptype: 'filterbar',
                            renderHidden: false,
                            showClearButton: true
                        }
                    ],
                    store: gridStore,
                    listeners: {
                        celldblclick: function(cell, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                            me.setValue(record.get(me.valueField));
                            win.close();
                        },
                        refeshStore: function() {
                            gridStore.load();
                        },
                        select: function() {
                            okButton.setDisabled(false);
                        }
                    },
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: gridStore,
                        displayInfo: true,
                        plugins: new Ext.ux.ProgressBarPager(),
                        doRefresh: function(btn, event) {
                            gridStore.load();
                        }
                    }
                }
            ],
            buttons: [
                okButton,
                {
                    text: Ext.localization.buttons.cancel,
                    handler: function() {
                        win.close();
                    }
                }
            ],
            listeners: {
                close: function() {
                    gridStore.clearFilter();
                    me.openWin = false;
                }
            }
        });
        if (customForm) {
            customForm.add(win);
        }
        me.openWin = true;
        win.center();
        win.show();
    }
});
