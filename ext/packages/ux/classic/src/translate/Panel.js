/**
 * Created by Desar10 on 2/25/2015.
 */
// Ext.define("MPA.view.translate.Dialog",{
Ext.define('Ext.ux.translate.Panel', {
    // extend: "Ext.window.Window",
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.translate.view.TreeGrid',
        'Ext.ux.form.TreeSearchField',
        'Ext.layout.container.Border',
        'Ext.ux.translate.store.Languages',
        'Ext.ux.translate.view.status.Panel',
        'Ext.ux.translate.view.translator.Panel'
    ],
    xtype: 'translationpanel',
    maximized: true,
    layout: {
        type: 'border',
        padding: 2
    },
    errorList: [],
    uuidMenu: null,
    uuidLanguageReference: null,
    uuidLanguage: null,
    uuidModule: null,
    menuTranslationTemp: null,
    selectedRecordMenu: null,
    activatePanelTrans: Ext.emptyFn,
    checkChanges: function(callback) {
        callback = callback || Ext.emptyFn;
        let me = this;
        let labelPackage = me.getSerializedData();
        if (labelPackage.length) {
            Ext.MessageBox.confirm(
                Ext.localization.generic.warning,
                Ext.localization.translationDialog.confirmmessage.changesDetected,
                function(btn) {
                    if (btn === 'yes') {
                        me.enableButtons(false);
                        me.gridTranslationPanel.getStore().loadData([]);
                        me.activatePanelTrans(0);
                    }
                    callback();
                }
            );
        } else {
            me.enableButtons(false);
            me.gridTranslationPanel.getStore().loadData([]);
            me.activatePanelTrans(0);
            callback();
        }
    },
    goBack: function() {
        this.checkChanges();
    },
    initComponent: function() {
        let me = this;
        me.uuidModule = Ext.currentUserInfo ? Ext.currentUserInfo.moduleId : null;
        let ElocaleTrl = Ext.localization.translationDialog,
            languageStore = Ext.create('Ext.ux.translate.store.Languages'),
            languageComboField = Ext.widget('combobox', {
                store: languageStore,
                fieldLabel: ElocaleTrl.comboLanguage,
                displayField: 'description',
                valueField: 'uuid',
                forceSelect: true,
                queryMode: 'local',
                allowBlank: false
            }),
            settingPanel = Ext.widget('panel', {
                region: 'north',
                hidden: true,
                colapsible: true,
                layout: 'form',
                frame: true,
                split: true,
                items: [languageComboField],
                tools: [
                    {
                        type: 'close',
                        tooltip: ElocaleTrl.button.close,
                        handler: function(event, toolEl, panelHeader) {
                            settingPanel.setVisible(false);
                        }
                    }
                ]
            }),
            gridTranslationPanel = Ext.widget('translatorpanel', {
                uuidModule: me.uuidModule,
                modeTrop: me.modeTrop,
                listeners: {
                    editpackagelabel: function(rec, gridTranslationPanel, treePanelMenu, languageComboField) {
                        me.editPackageLabel(rec, gridTranslationPanel, treePanelMenu, languageComboField);
                    }
                }
            }),
            treePanelMenu = Ext.widget('treeLazyLoading', {
                uuidModule: me.uuidModule,
                region: 'west',
                title: 'Menu',
                width: 200,
                split: true,
                collapsible: true,
                floatable: false,
                uuidLanguage: me.uuidLanguageReference,
                storeLanguage: languageStore,
                listeners: {
                    itemclick: function(view, record, item, index, e, eOpts) {
                        me.checkChanges(function() {
                            translationStatus.store.setParams(record.get('uuidDesign'), record.get('id'), true);
                        });
                    },
                    beforerender: function(treePanel) {
                        var treeStore = treePanel.getStore();
                        treeStore.on(
                            'load',
                            function(store, recordList, operation) {
                                var record = recordList[0];
                                treePanel.getSelectionModel().select(record);
                                translationStatus.store.setParams(record.get('uuidDesign'), record.get('id'), true);
                            },
                            me,
                            { single: true }
                        );
                    }
                }
            }),
            translationStatus = Ext.widget('translationstatus', {
                languageStore: languageStore,
                gridTranslationPanel: gridTranslationPanel,
                treePanelMenu: treePanelMenu,
                languageComboField: languageComboField,
                modeTrop: me.modeTrop,
                listeners: {
                    itemdblclick: function(view, record) {
                        me.editPackageLabel(record, gridTranslationPanel, treePanelMenu, languageComboField);
                    },
                    editpackagelabel: function(rec, gridTranslationPanel, treePanelMenu, languageComboField) {
                        me.editPackageLabel(rec, gridTranslationPanel, treePanelMenu, languageComboField);
                    }
                }
            });

        let panelBoard = Ext.widget('panel', {
                frame: true,
                region: 'center',
                layout: 'card',
                xtype: 'panel',
                items: [translationStatus, gridTranslationPanel]
            }),
            resetDialog = function() {
                translationStatus.getStore().load();
            };

        me.gridTranslationPanel = gridTranslationPanel;
        me.activatePanelTrans = function(index) {
            panelBoard.getLayout().setActiveItem(index);
        };

        languageStore.on('load', function(store) {
            let language = store.query('isDefault', true, 0, 1, 1);
            if (language.length) {
                languageComboField.setValue(language.items[0].get('uuid'));
            }
        });

        languageComboField.on('change', function(combo, value) {
            me.uuidLanguageReference = value;
            treePanelMenu.store.setUuidParams(me.uuidModule, value, true);
            treePanelMenu.setTitle(ElocaleTrl.tree.title + ' ' + languageComboField.getRawValue());
            settingPanel.setVisible(false);
        });

        treePanelMenu.on('setSetting', function() {
            settingPanel.setVisible(!settingPanel.isVisible());
        });

        Ext.applyIf(me, {
            items: [treePanelMenu, settingPanel, panelBoard],
            listeners: {
                beforeclose: function(window, eOpts) {
                    me.checkChanges();
                    return false;
                }
            },
            getSerializedData: function() {
                return gridTranslationPanel.getSerializedData();
            },
            isValid: function() {},
            saveTranslation: function() {
                me.enableButtons(false);
                let labelPackage = me.getSerializedData();
                me.mask(Ext.localization.jsonPanel.loadMaskMessage.saving);
                Ext.Ajax.request({
                    url: Ext.manifest.handler.translateDesign,
                    params: {
                        requestType: 'stl',
                        labelPackage: Ext.JSON.encode(labelPackage)
                    },
                    success: function(response) {
                        let result = Ext.JSON.decode(response.responseText);
                        if (result.rows) {
                            Ext.M5Message.show(ElocaleTrl.message.saved);
                            resetDialog();
                        } else {
                            Ext.M5Message.show(ElocaleTrl.errorConnection, 'error');
                            resetDialog();
                        }
                    },
                    callback: function() {
                        me.unmask();
                        gridTranslationPanel.getStore().loadData([]);
                        me.activatePanelTrans(0);
                    }
                });
            },
            updateMenuDescription: function() {
                if (gridTranslationPanel.getMenuTranslationTemp) {
                    me.selectedRecordMenu.set('text', gridTranslationPanel.getMenuTranslationTemp());
                }
            },
            editPackageLabel: function(record, gridEditor, treePanel) {
                let me = this,
                    model = treePanel.store.getNodeById(translationStatus.store.getUuidMenu());
                me.enableButtons(true);
                me.uuidLanguage = record.get('uuidLanguage');
                me.selectedRecordMenu = model;
                me.uuidMenu = translationStatus.store.getUuidMenu();
                if (model) {
                    gridEditor.setParams(model.get('uuidDesign'), model.get('uuid'), me.uuidLanguage, me.uuidLanguageReference, true);
                }

                me.activatePanelTrans(1);
            },
            enableButtons: function(state) {
                if (me.rendered) {
                    Ext.GlobalEvents.fireEvent(state ? 'enablefloatingbutton' : 'disablefloatingbutton', 'save');
                    Ext.GlobalEvents.fireEvent(state ? 'enablefloatingbutton' : 'disablefloatingbutton', 'previous');
                }
            }
        });

        me.callParent(arguments);
    }
});
