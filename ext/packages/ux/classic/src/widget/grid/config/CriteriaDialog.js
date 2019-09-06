/**
 * Created by DELL on 10/02/14.
 */
Ext.define('Ext.ux.widget.grid.config.CriteriaDialog', {
    extend: 'Ext.window.Window',
    xtype: 'criteriaconfig',
    requires: ['Ext.form.Panel', /**/
        'Ext.form.field.ComboBox', /**/
        'Ext.form.FieldSet' /**/
    ],
    width: 550,
    height: 480,
    layout: 'fit',
    validPrefix: [],
    actualConfig: [],
    modal: true,
    model: null,
    closeAction: 'destroy',
    instanceId: null, // id context
    initComponent: function() {
        var me = this,
            Ex = Ext,
            ELocale = Ex.localization.configValueConfigurationDialog;

        // Ex.define('FieldTypeDataStoreModel', {
        //    extend: 'Ext.data.Model',

        // });
        var valueTypeStore = Ex.create('Ext.data.Store', {
            // storeId: 'fieldTypeStore',
            //   model: 'FieldTypeDataStoreModel',
            fields: ['uuid', 'name'],
            autoLoad: false,
            proxy: {
                type: 'ajax',
                reader: 'json',
                url: Ex.manifest.handler.repositoryManager,
                method: 'POST',
                extraParams: {
                    action: 'getConfigType'
                },
                success: function(response) {
                    var data = Ex.JSON.decode(response.responseText);
                    if (typeof data !== 'undefined' && data !== null) {
                        if (typeof data.success !== 'undefined') {
                            Ex.Msg.alert(Ex.localization.apiName, ELocale.msgText.cannotRetrieveDataForValueType);
                            return false;
                        }
                    }
                }
            }
        });

        me.typeCombo = Ex.widget('combobox', {
            // id:'fieldTypeCombo',
            name: 'fieldTypeCombo',
            fieldLabel: ELocale.fieldLabel.valueType,
            displayField: 'name',
            valueField: 'name',
            store: valueTypeStore,
            allowBlank: false,
            listeners: {
                /* select:function(combo){
                 me.setCategoryValueToCombo(combo.getValue);
                 }, */
                change: function(combo, newValue) {
                    if (newValue) {
                        if (me.validPrefix.contains(newValue)) {
                            me.setCategoryValueToCombo(newValue);
                        } else {
                            Ex.Notify.msg(
                                Ex.localization.notImplemented, {
                                    layout: 'bottom',
                                    delay: 5000,
                                    type: 'information',
                                    instanceId: me.instanceId
                                });
                            combo.clearValue();
                        }
                    }
                }
            }
        });

        // Ex.define('ValueCategoryDataStoreModel', {
        //    extend: 'Ext.data.Model',
        //    fields: ['storeId']
        // });
        var valueCategoryStore = Ex.create('Ext.data.Store', {
            // storeId: 'valueCategoryStore',
            fields: ['storeId'],
            // model:'ValueCategoryDataStoreModel',
            reader: 'json',
            proxy: {
                type: 'memory'
            }
        });
        me.categoryCombo = Ex.widget('combobox', {
            // id:'categoryCombo',
            name: 'categoryCombo',
            fieldLabel: ELocale.fieldLabel.category,
            displayField: 'storeId',
            valueField: 'storeId',
            autoLoad: false,
            store: valueCategoryStore,
            queryMode: 'local',
            allowBlank: false,
            /**
             * Sets fields depending on the selected data source.
             * @param Data fields of the selected data source.
             */
            loadData: function(data) {
                me.categoryCombo.store.removeAll();
                me.categoryCombo.setValue('');
                me.categoryCombo.store.add(data);
                me.categoryCombo.expand();
            },
            listeners: {
                /* select: function(combo){
                 me.setFieldValueToCombo(combo.getValue());
                 }, */
                change: function(combo, newValue) {
                    me.setFieldValueToCombo(newValue);
                }
            }
        });

        // Ex.define('ValueDataStoreModel',{
        //    extend: 'Ext.data.Model',
        //    fields: ['alias', 'type']
        // });

        var valueDataStore = Ex.create('Ext.data.Store', {
            // storeId: 'valueDataStore',
            fields: ['alias', 'type'],
            // model: 'ValueDataStoreModel',
            reader: 'json',
            proxy: {
                type: 'memory'
            }
        });
        me.valueCombo = Ex.widget('combobox', {
            // id: 'valueCombo',
            name: 'valueCombo',
            autoLoad: false,
            fieldLabel: ELocale.fieldLabel.value,
            displayField: 'alias',
            valueField: 'dataIndex',
            store: valueDataStore,
            queryMode: 'local',
            allowBlank: false,
            /**
             * Sets fields depending on the selected data source.
             * @param Data fields of the selected data source.
             */
            loadData: function(data) {
                me.valueCombo.store.removeAll();
                me.valueCombo.setValue('');
                me.valueCombo.store.add(data);
                me.valueCombo.expand();
            }
        });

        var frmConfigurationValue = Ex.widget('form', {
            // xtype: 'form',
            //   id: 'frmConfigurationValue',
            items: [{
                xtype: 'fieldset',
                layout: 'form',
                title: ELocale.title.valueConfiguration,
                items: [
                    me.typeCombo,
                    me.categoryCombo,
                    me.valueCombo
                ]
            }]
        });
        me.frmConfiguration = frmConfigurationValue;
        Ex.applyIf(me, {
            title: ELocale.title.configurationDialog,
            items: [frmConfigurationValue],
            buttons: [
                '->', {
                    text: ELocale.button.okText,
                    handler: me.completeConfig,
                    scope: me

                }, {
                    text: ELocale.button.cancelText,
                    handler: function() {
                        me.close();
                    }
                }
            ],
            setCategoryValueToCombo: function(value) {
                var context = Ex.getCurrentContext(me.instanceId),
                    ExArray = Ex.Array,
                    displayStoreName = value + 'DisplayStore',
                    // displayStore = ExStoreManager.lookup(displayStoreName),
                    displayStore = context[displayStoreName],
                    valueCategoryStore = valueCategoryStore,
                    categoryArray = [];

                displayStore.queryBy(function(record) {
                    if (record.get('type') === 'ALL' && record.get('storeId') !== me.sourceName) {
                        ExArray.push(categoryArray, record);
                    }
                });
                me.categoryCombo.loadData(categoryArray);
                me.categoryCombo.expand();
            },
            setFieldValueToCombo: function(value) {
                var typeName = me.typeCombo.getValue() || me.actualConfig[0],
                    context = Ext.getCurrentContext(me.instanceId),
                    valueArray = [],
                    displayStoreName = (typeName) ? typeName + 'DisplayStore' : null;
                if (displayStoreName) {
                    var displayStore = context[displayStoreName],
                        ExArray = Ext.Array;
                    displayStore.queryBy(function(record) {
                        if (record.get('type') != 'ALL' && record.get('storeId') == value) {
                            ExArray.push(valueArray, record);
                        }
                    });
                    me.valueCombo.loadData(valueArray);
                    me.valueCombo.expand();
                }
            }
        });
        if (me.actualConfig) {
            me.typeCombo.setValue(me.actualConfig[0]);
            me.categoryCombo.setValue(me.actualConfig[1]);
            me.valueCombo.setValue(me.actualConfig[2]);
        }
        me.callParent(arguments);
    },
    /**
     * Ok button handler of the configuration dialog, this perform a test before the actual dataStore creation.
     */
    completeConfig: function() {
        var me = this,
            Ex = Ext,
            // frm = Ext.getCmp('frmConfigurationValue')
            frm = me.frmConfiguration,
            ELocale = Ex.localization.configValueConfigurationDialog;
        if (frm.isValid()) {
            // var whereStore = Ext.StoreManager.lookup('tableViewWhereDataStore'),
            // fieldTypeCombo = Ext.getCmp('fieldTypeCombo'),
            // categoryCombo = Ext.getCmp('categoryCombo'),
            // valueCombo = Ext.getCmp('valueCombo');
            var value = '{{' + me.typeCombo.getValue().toString() + '.' + me.categoryCombo.getValue().toString() +
                '.' + me.valueCombo.getValue().toString() + '}}';
            // var /*selectedField = Ext.getCmp('whereGrid').columns[2].getEditor().store.query('dataIndex',me.gridRecord.get('field'),false,false,true),*/
            // selectedValue = Ex.StoreManager.lookup('valueDataStore').query('dataIndex', me.valueCombo.getValue(), false, false, true);
            // if (me.gridRecord.get('fieldType')/*selectedField.items[0].get('type')*/ === selectedValue.items[0].get('type')) {
            me.gridRecord.set('value', value);
            me.close();
            // }
            // else{
            //    Ext.Msg.alert(Ex.localization.apiName, ELocale.msgText.valueTypesMismatch);
            //    return false;
            // }
        } else {
            Ext.Msg.alert(Ex.localization.apiName, ELocale.msgText.requiredData);
            return false;
        }
    }
});