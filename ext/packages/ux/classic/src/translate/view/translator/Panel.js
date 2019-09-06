Ext.define('Ext.ux.translate.view.translator.Panel', {
    extend: 'Ext.grid.Panel',
    requires: ['Ext.grid.plugin.CellEditing', 'Ext.grid.feature.Grouping', 'Ext.Template', 'Ext.ux.translate.store.Labels'],
    xtype: 'translatorpanel',
    uuidModule: null,
    modeTrop: true,
    languageStore: null,
    menuTranslationTemp: null,
    initComponent: function() {
        var me = this,
            Ex = Ext,
            ElocaleTrl = Ex.localization.translationDialog,
            columnsConf = [
                {
                    text: ElocaleTrl.grid.column.referenceName,
                    dataIndex: 'referenceName',
                    flex: 1,
                    hideable: false
                },
                {
                    text: ElocaleTrl.grid.column.reference,
                    dataIndex: 'reference',
                    flex: 1,
                    hideable: true
                },
                {
                    text: ElocaleTrl.grid.column.translation,
                    dataIndex: 'translation',
                    hideable: false,
                    flex: 1
                },
                {
                    text: ElocaleTrl.grid.column.tropicalization,
                    dataIndex: 'tropicalization',
                    hideable: false,
                    flex: 1,
                    editor: me.modeTrop
                        ? {
                            xtype: 'textfield',
                            allowBlank: false,
                            minLength: 2,
                            maxLength: 200
                        }
                        : null
                }
            ],
            labelStore = Ex.create('Ext.ux.translate.store.Labels');
        labelStore.setUuidModule(me.uuidModule, false);
        Ex.applyIf(me, {
            store: labelStore,
            title: ElocaleTrl.grid.panel.label,
            uuidLanguage: null,
            features: [
                {
                    groupHeaderTpl: new Ext.Template(ElocaleTrl.grid.groupHeaderText.type + ' ' + '{name:this.getNameLabel}', {
                        getNameLabel: function(name) {
                            return ElocaleTrl.grid.groupHeaderText.option[name] || name;
                        }
                    }),
                    ftype: 'grouping'
                }
            ],

            selType: 'cellmodel',
            columns: columnsConf,
            showMessage: function(msg, type, layout, delay) {
                Ext.M5Message.show(msg, type, layout, delay);
            },
            setParams: function(uuidDesign, uuidMenu, uuidLanguage, uuidLanguageReference) {
                labelStore.setParams(uuidDesign, uuidMenu, uuidLanguage, uuidLanguageReference, true);
                me.columns[1].setVisible(uuidLanguage == uuidLanguageReference ? false : true);
            }
        });

        if (me.modeTrop) {
            Ext.apply(me, {
                plugins: [
                    Ext.create('Ext.grid.plugin.CellEditing', {
                        clicksToEdit: 1,
                        listeners: {
                            beforeedit: function(e, editor) {
                                if (editor.record.get('action') === 'trop' && editor.field === 'translation') {
                                    // me.showMessage('you can not edit this value, as this is the default translation!', 'error');
                                    return false;
                                }
                                if (editor.record.get('action') === 'add' && editor.field === 'tropicalization') {
                                    // me.showMessage('You can not add this value, You must first translate the label properly!', 'error');
                                    return false;
                                }
                            },
                            edit: function(e, editor, opts) {
                                console.log('edit');
                                editor.record.set('reset', 'false');
                            }
                        }
                    })
                ]
            });
        }

        me.callParent(arguments);
    },
    getSerializedData: function() {
        var me = this,
            ExArray = Ext.Array,
            labelPackage = [],
            labelMenu = [],
            store = me.getStore(),
            labelModified = store.getModifiedRecords(),
            uuidLanguage = store.getUuidLanguage();
        ExArray.each(labelModified, function(labelItem) {
            ExArray.push(labelPackage, {
                uuidTranslation: labelItem.get('uuidTranslation'),
                uuidLabel: labelItem.get('uuidLabel'),
                uuidLanguage: uuidLanguage,
                valueTropicalization: labelItem.get('tropicalization'),
                valueTranslation: labelItem.get('translation'),
                uuidModule: me.uuidModule,
                action: me.modeTrop ? 'trop' : labelItem.get('action')
            });
            if (labelItem.get('typeLabel') == 'menu') {
                if (me.modeTrop) {
                    me.menuTranslationTemp = labelItem.get('tropicalization');
                }
            }
        });
        return labelPackage;
    },
    getMenuTranslationTemp: function() {
        return this.menuTranslationTemp;
    }
});
