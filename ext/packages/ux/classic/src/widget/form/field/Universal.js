/**
 * @author Desar_6 on 06/02/2015.
 * @class Ext.ux.widget.form.field.Universal
 * @extends Ext.container.Container
 */
Ext.define('Ext.ux.widget.form.field.Universal', {
    extend: 'Ext.container.Container',
    mixins: ['Ext.ux.widget.form.util.Action'],
    uses: [
        'Ext.ux.widget.form.field.Text',
        'Ext.ux.widget.form.field.TextArea',
        'Ext.ux.widget.form.field.Number',
        'Ext.ux.widget.form.field.Date',
        'Ext.ux.widget.form.field.DateTime',
        'Ext.button.Button',
        'Ext.layout.container.HBox',
        'Ext.ux.widget.form.field.Checkbox',
        'Ext.ux.widget.form.field.ComboBox'
    ],
    xtype: 'universalField',
    padding: '0px 0px 5px 0px',
    basePath: 'Ext.ux.widget.form.field.',
    blockedCls: 'blockDrop',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    defaults: {
        flex: 1
    },
    /**
     * @method initComponent
     * @override
     */
    initComponent: function() {
        var me = this,
            Ex = Ext,
            ExApplyIf = Ex.applyIf,
            ExArray = Ex.Array,
            store = me.stores.sourceStore,
            helpStore = me.stores.helpStore,
            labelStore = me.stores.labelStore,
            label = null,
            fieldType = 0,
            field = null,
            validationArray = [],
            validations = {},
            lookupConfig = false,
            encryptConfig = false,
            items = [];

        me.configData = Ext.Object.merge(
            {
                styleData: {},
                sourceConfig: {},
                extraFeatures: {
                    editable: false,
                    hidden: false,
                    referenceLabelName: null
                },
                labelStyleData: {},
                actionData: [],
                listenerData: [],
                validations: []
            },
            me.configData
        );

        var fieldClass = null,
            fieldConfig = {
                initialConfig: me.initialConfig,
                configData: me.configData,
                dataOrigin: store,
                flex: 1,
                context: me.stores
            };

        fieldConfig.initialConfig.hidden = me.configData.extraFeatures.hidden;

        var sourceConfig = me.configData.sourceConfig;
        // bind partial view;
        sourceConfig.record = me.configData.record;

        var alertButton = Ext.widget('button', {
            xtype: 'button',
            flex: 0,
            width: 24,
            // style: 'font-size: 16px; background-color: transparent; color: orange;',
            iconCls: 'x-fa fa-exclamation-triangle',
            hidden: true,
            handler: function() {
                Ext.Notify.msg(Ext.localization.field.msgText.multipleRow, {
                    layout: 'bottomright',
                    delay: 5000,
                    type: 'warning'
                });
            }
        });

        if (typeof sourceConfig.name !== 'undefined') {
            if (store.getSourceRecordBySourceName) {
                var source = store.getSourceRecordBySourceName(sourceConfig);
                if (source) {
                    var visible = source.count() > 1;
                    if (visible && !me.configData.record) {
                        alertButton.setVisible(visible);
                        source.on('datachanged', function() {
                            alertButton.setVisible(source.count() > 1);
                        });
                    }
                }
            }

            if (store.getFieldRecordBySourceAndName) {
                var fieldRecord = store.getFieldRecordBySourceAndName(sourceConfig.name, sourceConfig.dataIndex);
                if (fieldRecord) {
                    fieldType = fieldRecord.get('type');
                    validationArray = fieldRecord.get('validation');
                    lookupConfig = fieldRecord.get('lookup') || {};
                    encryptConfig = fieldRecord.get('encrypt');

                    if (!Ext.Object.isEmpty(lookupConfig)) {
                        if (!Ext.isEmpty(lookupConfig.lookupField)) {
                            fieldType = 1000;
                        }
                    }
                    if (!Ext.Object.isEmpty(encryptConfig)) {
                        fieldType = 2000;
                    }
                }
            }
        }

        ExArray.each(validationArray, function(validation) {
            validation = validation || {};
            // FIXME: Corregir uso innapropiado de metodo eval
            validations[validation.propertyName] = eval(Ext.String.format(validation.usageTemplate, validation.value)); // jshint ignore:line
        });

        if (!Ex.isEditMode) {
            switch (fieldType) {
                case 0:
                    fieldClass = me.basePath + 'Text';

                    //debido a la longitud del campo se cambia a textarea
                    if (validations && validations.maxLength && validations.maxLength > 250) {
                        fieldClass = me.basePath + 'TextArea';
                    }

                    break;
                case 1:
                case 6:
                    fieldClass = me.basePath + 'Number';
                    break;
                case 2:
                    fieldClass = me.basePath + 'Text';
                    break;
                case 3:
                    fieldClass = me.basePath + 'Date';
                case 10:
                    fieldClass = me.basePath + 'DateTime';
                    break;
                case 15:
                    fieldClass = me.basePath + 'Checkbox';
                    break;
                case 1000: // lookup secction
                    fieldClass = me.basePath + 'ComboBox';
                    Ex.apply(fieldConfig.initialConfig, {
                        lookupConfig: lookupConfig,
                        test: 1,
                        context: me.stores
                    });
                    delete validations.maxLength;
                    break;
                case 2000:
                    Ext.apply(fieldConfig.initialConfig, {
                        inputType: 'password',
                        actionMode: me.actionMode
                    });
                    if (me.actionMode === 'update') {
                        validations.allowBlank = true;
                    }
                    fieldClass = me.basePath + 'Text';
                    break;
                default:
                    fieldClass = me.basePath + 'Text';
                    break;
            }
        } else {
            fieldClass = me.basePath + 'Text';
        }

        field = Ex.create(fieldClass, fieldConfig);

        if (field) {
            me.editor = field;

            if (me.configData.extraFeatures.actionEnabled) {
                me.actionId = me.configData.extraFeatures.referenceLabelName;
            }

            if (me.configData.actionData) {
                me.initActions();
            }
            var isReadOnly = false;
            if (['view', 'remove'].includes(me.actionMode) || !me.configData.extraFeatures.editable) {
                isReadOnly = true;
            }
            Ex.apply(field, {
                readOnly: isReadOnly
            });

            if (typeof sourceConfig.name !== 'undefined') {
                if (!Ex.isEditMode && store) {
                    store.bindValue(field, sourceConfig);
                    field.on(
                        'afterrender',
                        function() {
                            me.actionHandler(field.getValue());
                        },
                        field,
                        { single: true }
                    );
                    if (labelStore) {
                        var labelValue = labelStore.getValueByReferenceName(me.configData.extraFeatures.referenceLabelName);
                        if (labelValue !== '') {
                            label = labelValue.trim();
                        } else {
                            label = '{%' + me.configData.extraFeatures.referenceLabelName + '%}';
                        }

                        if (field.getAutoFieldLabel) {
                            field.getAutoFieldLabel(label);
                        } else {
                            field.fieldLabel = label;
                        }
                    } else {
                        field.getAutoFieldLabel('[' + me.configData.extraFeatures.referenceLabelName + ']');
                    }
                } else {
                    field.setValue('{%' + sourceConfig.dataIndex + '%}');
                    field.getAutoFieldLabel('[' + me.configData.extraFeatures.referenceLabelName + ']');
                }
            } else {
                field.setSpecifiedValues();
            }

            Ex.apply(field, validations);

            var labelClsExtra = [Ext.baseCSSPrefix + 'style'];

            if (me.configData.styleData.fieldLabelStyle.cls.length) {
                ExArray.push(labelClsExtra, me.configData.styleData.fieldLabelStyle.cls);
            }

            if (!field.allowBlank) {
                ExArray.push(labelClsExtra, ['fs-bold', 'fz-big']);
            }

            if (me.configData.labelStyleData.italic) {
                ExArray.push(labelClsExtra, 'fs-italic');
            }

            if (me.configData.labelStyleData.underline) {
                ExArray.push(labelClsExtra, 'fs-underline');
            }

            Ex.apply(field, {
                labelClsExtra: labelClsExtra.join(' '),
                labelStyle: 'white-space = nowrap;',
                labelAlign: 'left'
            });

            if (me.configData.labelStyleData.labelWidth) {
                Ex.apply(field, {
                    labelWidth: me.configData.labelStyleData.labelWidth
                });
            }

            ExArray.push(items, field, alertButton);
        }

        Ex.apply(me, {
            minWidth: 100,
            minHeight: 20,
            items: items,
            setRequired: function(value) {
                field.setRequired(value);
            },
            setEnable: function(value) {
                field.setEnable(value);
            },
            reset: function() {
                field.reset();
            },
            load: function() {
                field.forceLoad();
            },
            updateParameter: function(value) {
                if (!Ext.Object.isEmpty(sourceConfig)) {
                    var param = [
                        {
                            name: lookupConfig.pkTable || sourceConfig.name,
                            parameters: [
                                {
                                    dataIndex: lookupConfig.pkField || sourceConfig.dataIndex,
                                    gridColumnDataIndex: lookupConfig.pkField || sourceConfig.dataIndex,
                                    readOnly: true,
                                    value: value
                                }
                            ]
                        }
                    ];
                    //<debug>

                    console.log('MPA - Universal Field - updateParameter', param);
                    //</debug>
                    this.stores.parameterManagerStore.setParameterValues(param);
                }
            },
            setVisible: function(visible) {
                field.setVisible(visible);

                return me[visible ? 'show' : 'hide']();
            }
        });

        me.callParent(arguments);
    }
});
