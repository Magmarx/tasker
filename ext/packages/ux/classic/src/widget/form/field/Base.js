/**
 *
 * To change this template use File | Settings | File Templates.
 * @author User: Desar_6 Date: 29/07/13 Time: 09:34 AM
 * @class Ext.ux.widget.form.field.Base
 */
Ext.define('Ext.ux.widget.form.field.Base', {
    sourceConfig: {},
    labelStyle: 'word-wrap: break-word;',
    context: null,
    oldValue: '',
    /**
     * callback function executed when a change ocours
     * @param cfg {object} new configuration
     */
    callback: function (cfg) {
        this.fireEvent('updatedobject', cfg);
    },
    /**
     * forceLoad abstract method implements in universalcombobox
     * @private
     */
    forceLoad: function () {
        //<debug>

        console.log('MPA - Base field forceLoad');
        //</debug>
    },
    /**
     * @method setRequired require value on editor
     * @returns {String} allowBlank `fase` description
     * @private
     */
    setRequired: function (value) {
        var me = this;

        me.setAllowBlank(!value);

        if (me.labelEl) {
            if (value) {
                me.labelEl.addCls(['fs-bold', 'fz-big']);
            } else {
                me.labelEl.removeCls(['fs-bold', 'fz-big']);
            }
        }
    },
    /**
     * @method setEnable public method to enable or disable this object by a parameter
     * @param value {boolean} flag to enable or disable this field
     */
    setEnable: function (value) {
        var me = this;
        if (value) {
            me.enable();
        } else {
            me.disable();
        }
    },
    /**
     * init the configData object with the field defaults
     * @method initDefaults
     */
    initDefaults: function () {
        var me = this,
            Ex = Ext;
        if (me.initialConfig) {
            delete me.initialConfig.__JSON__configData;
        }
        // initialize the configData this is the default configuration for this field
        me.configData = me.configData || {};

        // create the basic structure of the configuration object
        Ex.applyIf(me.configData, {
            styleData: {},
            sourceConfig: {},
            extraFeatures: {},
            actionData: [],
            validations: []
        });

        Ext.applyIf(me.configData.styleData, {
            basicStyle: {},
            fieldLabelStyle: {}
        });

        Ext.applyIf(me.configData.styleData.basicStyle, {
            border: false,
            cls: []
        });

        Ext.applyIf(me.configData.styleData.fieldLabelStyle, {
            align: 'right',
            width: 180,
            cls: []
        });
        var fieldName = me.configData.sourceConfig.name + '-' + me.configData.sourceConfig.dataIndex;


        Ext.apply(me, {
            name: fieldName,
            listeners: {
                specialkey: function (field, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER && e.shiftKey) {
                        var form = field.up('form');
                        if (form.getForm().isValid()) {
                            form.onSuccess();
                        }
                    }
                }
            }
        });
    },
    initStyle: function (scope) {
        var me = scope,
            Ex = Ext;
        if (me.configData.styleData.fieldLabelStyle.cls.length) {
            Ex.apply(me, {
                labelCls: Ext.baseCSSPrefix + 'style ' + me.configData.styleData.fieldLabelStyle.cls.join(' ')
            });
        }
        if (me.configData.styleData.basicStyle.cls.length) {
            Ex.apply(me, {
                fieldCls: Ext.baseCSSPrefix + 'style ' + me.configData.styleData.basicStyle.cls.join(' ')
            });
        }

        Ex.apply(me, {
            border: me.configData.styleData.basicStyle.border,
            labelAlign: 'right',
            labelWidth: me.configData.styleData.fieldLabelStyle.width ? me.configData.styleData.fieldLabelStyle.width : 180
        });
    },
    // /**
    //  * register the actions for this field
    //  * @param scope {object} referred scope from the parent
    //  */
    // initActions: function (scope) {
    //     var me = scope,
    //         Ex = Ext;
    //     if (!Ex.isEditMode) {
    //         me._actionList = [];
    //         if (me.configData.actionData) {
    //             var actionData = Ex.JSON.decode(me.configData.actionData);
    //             if (actionData.length) {
    //                 var ExArray = Ex.Array;
    //                 var instanceScope = Ex.getScope(me.configData.instanceId);

    //                 ExArray.each(actionData, function (item) {
    //                     ExArray.push(me._actionList, {
    //                         'id': item.targetId,
    //                         'action': item.action,
    //                         'criteria': item.criteria,
    //                         'dataIndex': item.dataIndex,
    //                         'textValue': me.defaultValue ? me.defaultValue : me.value,
    //                         'controlType': me.configData.controlType
    //                     });
    //                 });

    //                 me.on('change', function (field, newValue, oldValue) {
    //                     me.oldValue = oldValue;

    //                     ExArray.each(me._actionList, function (item) {
    //                         var store = (me.getStore) ? me.getStore() : null,
    //                             record = (store) ? me.findRecordByValue(newValue) : null;
    //                         item.textValue = (record) ? record.get(item.dataIndex) : newValue;
    //                     });

    //                     instanceScope.processQueue(null, me._actionList);
    //                 });
    //             }
    //         }
    //     }
    // },
    /**
     * @method getAutoFieldLabel
     * @param  {String} label return the default label, or replace the default
     */
    getAutoFieldLabel: function (label) {
        var me = this;
        if (!label) {
            if (!me.initialConfig.fieldLabel) {
                me.initialConfig.fieldLabel = me.configData.sourceConfig.field;
                me.setFieldLabel(me.configData.sourceConfig.field);
            }
        } else {
            me.initialConfig.fieldLabel = label;
            me.setFieldLabel(label);
        }
    },
    /**
     * set the default value to this field
     * @method setSpecifiedValues
     */
    setSpecifiedValues: function () {
        var me = this;
        if (me.defaultValue) {
            me.setValue(me.defaultValue);
        }
    },
    /**
     * getCurrentRecord obtiene el record vinculado al editor en base a su configuracion.
     * @private
     */
    getCurrentRecord: function () {
        var me = this,
            configData = me.configData || {},
            sourceConfig = configData.sourceConfig || {},
            record = sourceConfig.record || {
                set: Ext.emptyFn,
                get: Ext.emptyFn,
                data: {}
            };

        return record;
    }
});