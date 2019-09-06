/**
 * Created by Desar_6 on 26/01/2015.
 */
Ext.define('Ext.ux.widget.parameter.Panel', {
    extend: 'Ext.form.Panel',
    mixins: ['Ext.ux.widget.parameter.Util'],
    requires: [
        'Ext.ux.Msg.DetailBubble',
        'Ext.ux.widget.parameter.advancedsearch.Dialog',
        'Ext.ux.widget.grid.CriteriaPanel',
        'Ext.ux.widget.grid.store.CriteriaStore',
        'Ext.ux.widget.grid.plugin.CellEditing',
        'Ext.grid.column.Action'
    ],
    // title : 'Parameters',
    layout: 'anchor',
    width: 400,
    height: 400,
    autoScroll: true,
    scope: null,
    xtype: 'parameterPanel',
    /**
     * At the init of the object this dialog needs a vector like this to create automatically a form to setup the values of the parameters of the dialog.
     * [{
     *       "name" : "test",
     *       "parameters" : [{
     *           "alias":"CAMPO",
     *           "dataIndex":"CAMPO",
     *           "type":1
     *       },{
     *           "alias":"FECHA",
     *           "dataIndex":"FECHA",
     *           "type":1
     *       },{
     *           "alias":"UUID",
     *           "dataIndex":"UUID",
     *           "type":0
     *       },{
     *           "alias":"UUID_MATRIZ_ENTIDAD",
     *           "dataIndex":"UUID_MATRIZ_ENTIDAD",
     *           "type":0
     *       }]
     * }]
     * @override
     */
    initComponent: function() {
        var me = this;
        var initParameterVector = me.scope.initParameterVector || [];
        var items = [];

        Ext.Array.each(initParameterVector, function(category) {
            var categoryItems = [];
            var grid = category.params ? category.params.columns : [];
            if (typeof grid === 'string') {
                grid = Ext.JSON.decode(grid);
            }

            Ext.Array.each(grid, function(parameter) {
                if (parameter.parameter) {
                    var parameterEditor = me.getEditorByType(parameter.type, parameter);
                    Ext.Array.push(categoryItems, parameterEditor);
                }
            });

            var afterAdvancedDialogCallBack = function(data) {
                Ext.Array.each(categoryItems, function(item) {
                    if (item) {
                        item.setValue(data[item.dataIndex]);
                    }
                });
            };

            var searchItems = [];

            Ext.Array.each(grid, function(field) {
                if (field.advancedSearch) {
                    Ext.Array.push(searchItems, field);
                }
            });

            var advancedTools = (category.proxy && searchItems.length) ? [{
                iconCls: Ext.manifest.globals.fontBasePrefix + 'searchmore' + Ext.manifest.globals.fontBasePostfix,
                border: true,
                style: 'border: 1px solid gray; font-size: 17px; color: gray',
                tooltip: Ext.localization.parameterSetupDialog.advancedSearchTooltip,
                handler: function() {
                    var advanced = Ext.create('Ext.ux.widget.parameter.advancedsearch.Dialog', {
                        initParameterVector: category,
                        instanceId: me.scope.instanceId,
                        constrain: true,
                        callback: afterAdvancedDialogCallBack
                    });

                    me.scope.add(advanced);
                    advanced.show();
                }
            }] : [];

            var categoryFieldSetConfig = {
                title: '<b>' + (category.description ? category.description : '') + '</b>[<i>' + category.name + '</i>]',
                categoryName: category.name,
                categoryDescription: category.description,
                items: categoryItems,
                bodyPadding: '5 10 0 10',
                layout: 'anchor',
                anchor: '100%'
            };

            if (searchItems.length) {
                categoryFieldSetConfig.rbar = advancedTools;
            }

            var categoryFieldSet = Ext.create('Ext.panel.Panel', categoryFieldSetConfig);
            Ext.Array.push(items, categoryFieldSet);
        });

        Ext.apply(me, {
            title: Ext.localization.parameterSetupDialog.title.parameters,
            items: items,
            tbar: [{
                text: Ext.localization.parameterSetupDialog.buttonText._continue,
                formBind: true,
                handler: function() {
                    var dialogForm = me.getForm();
                    if (dialogForm.isValid()) {
                        var returnSerializedVector = [];

                        Ext.Array.each(items, function(category) {
                            var categorySerializedVector = {};
                            categorySerializedVector.name = category.categoryName;
                            categorySerializedVector.description = category.categoryDescription;
                            categorySerializedVector.parameters = [];
                            Ext.Array.each(category.items.items, function(parameter) {
                                Ext.Array.push(categorySerializedVector.parameters, parameter.getSerializedData());
                            });

                            Ext.Array.push(returnSerializedVector, categorySerializedVector);
                        });

                        me.scope.close();

                        if (me.scope.callback) {
                            me.scope.callback(returnSerializedVector);
                        }
                    } else {
                        Ext.widget('detailBubbleCallout', {
                            type: 'error',
                            form: dialogForm,
                            target: this,
                            calloutArrowLocation: 'bottom-left',
                            relativePosition: 'bl-tr',
                            relativeOffsets: [-30, 0],
                            dismissDelay: 0
                        }).show();
                        this.focus();
                    }
                }
            }, {
                text: Ext.localization.parameterSetupDialog.buttonText.cancel,
                handler: function() {
                    me.scope.close();

                    if (me.scope.closeCallback) {
                        me.scope.closeCallback();
                    }

                    return false;
                }
            }]
        });

        me.callParent(arguments);
    }
});