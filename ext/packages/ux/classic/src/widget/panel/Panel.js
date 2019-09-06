/**
 * @author MYAX <mig_dj@hotmail.com>
 * date 11/18/2016
 * refactoring custom panel.
 */
/**
 * Container **Panel** which implements a custom scroll-bar to be used in form designer
 * @class Ext.ux.widget.panel.Panel
 * @extends Ext.panel.Panel
 * @xtype custompanel
 */
Ext.define('Ext.ux.widget.panel.Panel', {
    extend: 'Ext.panel.Panel',
    mixins: ["Ext.ux.widget.form.util.Action"],
    xtype: 'custompanel',
    layout: 'anchor',
    uses: [
        'Ext.ux.widget.panel.AccordionLayout',
        'Ext.ux.widget.panel.ColumnLayout',
        'Ext.ux.widget.panel.RowLayout',
        'Ext.ux.widget.grid.Panel'
    ],
    // reference: 'custompanel',
    scrollable: true,
    border: true,
    /**
     * Set enable
     * @method setEnable
     * @param  {Boolean}  value
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
     * @method setCollapse
     * @param  {Boolean}    value
     */
    setCollapse: function (value) {
        var me = this;
        if (value) {
            me.collapse();
        } else {
            me.expand();
        }
    },
    showMessage: function (msg, type, layout, delay) {
        Ext.Notify.msg(msg, {
            layout: layout || 'bottomright',
            delay: delay || 5000,
            type: type || 'success'
        });
    },
    /**
     * TODO: Add function historical
     * @type {Function} historical
     */
    historical: Ext.emptyFn,

    /**
     * @method initComponent
     * @override
     */
    initComponent: function () {
        var me = this;

        me.callback = function () {
            me.fireEvent('updatedobject');
        };

        me.configData = me.configData || {};
        me.completeConfigData(me.configData);
        // add listeners
        if (me.configData.listenerData) {
            me.initListeners(me, me.configData.listenerData);
        }


        // Ext.apply(me, {
        //     listeners: {
        //         afterlayout: me.doAfterLayout || Ext.emptyFn
        //     }
        // });
        var titleStyle;
        me.title = '';

        me.on('afterrender', function () {
            me.hidden = me.configData.extraFeatures.hidden;
            me.collapsed = me.configData.extraFeatures.collapsed;
        }, me, {
                single: true
            });

        Ext.apply(me, {
            border: me.configData.styleData.border,
            scrollable: me.scrollable || me.configData.extraFeatures.autoScroll,
            collapsible: me.configData.extraFeatures.collapsible,
            collapseDirection: me.configData.extraFeatures.collapseDirection
        });

        if (!me.width) {

            me.setDynamicSize(me.configData.styleData, 'width');
        }
        if (!me.height) {
            me.setDynamicSize(me.configData.styleData, 'height');
        }

        Ext.apply(me, {
            layout: me.configData.extraFeatures.layout
        });

        me.callParent(arguments);
    },
    /**
     * @method setDynamicWidth description
     * @return {Object} styleData `default` description
     * @private
     */
    setDynamicSize: function (styleData, property) {
        var me = this,
            value = null;

        try {
            styleData = styleData || {};

            if (styleData[property]) {
                switch (me.configData.styleData[property + 'Unit']) {
                    case 'px':
                        me[property] = parseInt(styleData[property]);
                        break;
                    case 'percent':
                        me[property] = styleData[property].toString() + '%';
                        break;
                    case 'proportional':
                        value = parseInt(styleData[property]);
                        var oldFlex = me.flex || 0;
                        if (value >= oldFlex) {
                            me.flex = value;
                        }
                        break;
                }
            }
        } catch (error) {
            // <debug>
            console.log('setDynamicSize', error);
            // </debug>
        }
    },
    /**
     * getLabelByReferenceName set property
     * @private
     */
    setTitleByReferenceName: function (referenceName, titleStyleData) {
        var me = this;
        var labelStore = me.stores.labelStore,
            label = null;
        if (labelStore) {
            if (!Ext.isEditMode) {
                var labelValue = labelStore.getValueByReferenceName(referenceName);

                if (labelValue !== '') {
                    label = labelValue;
                } else {
                    label = '{' + referenceName + '}';
                }
            } else {
                label = '{' + referenceName + '}';
            }
        }

        // var titleStyleData = me.configData.titleStyleData,
        if (titleStyleData) {
            var titleText = label;

            if (titleStyleData.bold) {
                titleText = '<b>' + titleText + '</b>';
            }
            if (titleStyleData.italic) {
                titleText = '<i>' + titleText + '</i>';
            }
            if (titleStyleData.underline) {
                titleText = '<u>' + titleText + '</u>';
            }

            var titleHeight = parseInt(titleStyleData.fontSize);
            titleHeight = titleHeight + 5;
            var titleStyle = "<div style='font-family:tahoma, arial, verdana, sans-serif; !important;" +
                'font-weight: bold !important; ' +
                'text-transform: none;' +
                'font-size: ' + titleStyleData.fontSize + 'pt !important; ' +
                'line-height: ' + titleHeight.toString() + 'px !important; ' +
                "'>" +
                titleText +
                '</div>';

            Ext.apply(me, {
                title: titleStyle
            });
        }
    },
    /**
     * @method copleteConfigData description
     * @param {Object} configData  `{}` config to panel
     * @return {Object} configData `{}` apply default values
     * @private
     */
    completeConfigData: function (configData) {
        Ext.Object.merge(configData, {
            styleData: {
                // border: this.border,
                border: false,
                borderSize: 1
            },
            sourceConfig: {},
            extraFeatures: {
                referenceLabelName: '',
                hidden: false,
                collapsed: false,
                collapsible: false,
                collapseDirection: 'top',
                layout: this.layout || 'anchor'
            },
            titleStyleData: {
                bold: false,
                italic: false,
                underline: false,
                fontSize: '8'
            }
        });

        return configData;
    }
});