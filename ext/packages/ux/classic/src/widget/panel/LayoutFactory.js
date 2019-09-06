/**
 * @author Unknown
 * @class Ext.ux.widget.panel.LayoutFactory
 * @extends Ext.panel.Panel
 * @xtype layoutFactory
 */
Ext.define('Ext.ux.widget.panel.LayoutFactory', {
    // extend: "Ext.panel.Panel",
    extend: 'Ext.ux.widget.panel.Panel',
    // blockedCls: 'blockDrop',
    border: false,
    // width: '100%',
    // height: '100%',
    xtype: 'layoutFactory'
        // /**
        //  * @method setEnable
        //  * @param  {[type]}  value [description]
        //  */
        // setEnable: function (value) {
        //     var me = this;
        //     if (value) {
        //         me.enable();
        //     } else {
        //         me.disable();
        //     }
        // },
        // /**
        //  * [setCollapse description]
        //  * @method setCollapse
        //  * @param  {[type]}    value [description]
        //  */
        // setCollapse: function (value) {
        //     var me = this;
        //     if (value) {
        //         me.collapse();
        //     } else {
        //         me.expand();
        //     }
        // },
        /**
         * @method initComponent
         * @override
         */
        // initComponent: function () {
        //     var me = this;
        //     me.configData = me.configData || {};

    //     //<debug>
    //     console.log('google', arguments);
    //     //</debug>
    //     me.callParent(arguments);
    // },
    // var me = this,
    //     Ex = Ext,
    //     ExApplyIf = Ex.applyIf;

    // me.callback = function () {
    //     me.fireEvent("updatedobject");
    // };

    // if (me.initialConfig) {
    //     delete me.initialConfig.__JSON__configData;
    // }

    // ExApplyIf(me.configData, {
    //     styleData: {}, titleStyleData: {}, extraFeatures: {}
    // });
    // // NOTE: no se necesita ya que el titilo no se utiliza
    // //var context = me.context;
    // labelStore = false; //context.stores.labelStore;
    // label = null;

    // ExApplyIf(me.configData.styleData, {
    //     width: (me.width || 100),
    //     height: (me.height || 100),
    //     widthUnit: me.widthUnit || 'percent',
    //     heightUnit:me.heightUnit || 'percent'
    // });

    // ExApplyIf(me.configData.titleStyleData, {
    //     bold: false,
    //     italic: false,
    //     underline: false,
    //     fontSize: '8'
    // });

    // ExApplyIf(me.configData.extraFeatures, {
    //     layout: 'anchor',
    //     referenceLabelName: null
    // });
    // var items = me.items || [];
    // if (!items.length) {
    //     me.initDefaultColumns(items);
    // }

    // me.initialConfig.configData = me.configData;
    // var defaultsValue = me.configData.extraFeatures.layout === "anchor" ? { anchor: "100%" } : {};
    // var titleStyle;
    // var panelTitle = me.configData.extraFeatures.referenceLabelName;

    // if (panelTitle) {
    //     if (labelStore) {
    //         if (!Ex.isEditMode) {
    //             var labelValue = labelStore.getValueByReferenceName(panelTitle);
    //             if (labelValue !== "") {
    //                 label = labelValue;
    //             } else {
    //                 label = "{" + me.configData.extraFeatures.referenceLabelName + "}";
    //             }
    //         } else {
    //             label = "{" + me.configData.extraFeatures.referenceLabelName + "}";
    //         }
    //     }

    //     var titleStyleData = me.configData.titleStyleData,
    //         titleText = label;

    //     if (titleStyleData.bold) {
    //         titleText = "<b>" + titleText + "</b>";
    //     }

    //     if (titleStyleData.italic) {
    //         titleText = "<i>" + titleText + "</i>";
    //     }

    //     if (titleStyleData.underline) {
    //         titleText = "<u>" + titleText + "</u>";
    //     }

    //     var titleHeight = parseInt(titleStyleData.fontSize);
    //     titleHeight = titleHeight + 5;
    //     titleStyle = "<div style='font-family:tahoma, arial, verdana, sans-serif; !important; font-weight: bold !important; text-transform: none; font-size: " + titleStyleData.fontSize + "pt !important; " +
    //         "line-height: " + titleHeight.toString() + "px !important;'>" + titleText + "</div>";
    // }

    // if (Ex.isEditMode) {
    //     Ex.Array.each(items, function (item, index) {
    //         item.parentComponentId = me.id;
    //     });
    // }

    // Ex.apply(me, {
    //     title: titleStyle,
    //     border: me.configData.styleData.border,
    //     autoScroll: me.configData.extraFeatures.autoScroll,
    //     collapsible: me.configData.extraFeatures.collapsible || false,
    //     collapseDirection: me.configData.extraFeatures.collapseDirection || "top",
    //     items: items
    // });
    // if (!me.width) {
    //     me.setDynamicWidth(me.configData.styleData);
    //     // switch (me.configData.styleData.widthUnit) {
    //     //     case 'px':
    //     //         Ex.apply(me, {
    //     //             width: parseInt(me.configData.styleData.width)
    //     //         });
    //     //         break;
    //     //     case 'percent':
    //     //         Ex.apply(me, {
    //     //             width: me.configData.styleData.width.toString() + "%"
    //     //         });
    //     //         break;
    //     //     case 'proportional':
    //     //         Ex.apply(me, {
    //     //             flex: parseInt(me.configData.styleData.width)
    //     //         });
    //     //         break;
    //     // }
    // }
    // if (!me.height) {
    //     me.setDynamicHeight(me.configData.styleData);
    //     // switch (me.configData.styleData.heightUnit) {
    //     //     case 'px':
    //     //         Ex.apply(me, {
    //     //             height: parseInt(me.configData.styleData.height)
    //     //         });
    //     //         break;
    //     //     case 'percent':
    //     //         Ex.apply(me, {
    //     //             height: me.configData.styleData.height.toString() + "%"
    //     //         });
    //     //         break;
    //     //     case 'proportional':
    //     //         Ex.apply(me, {
    //     //             flex: parseInt(me.configData.styleData.height)
    //     //         });
    //     //         break;
    //     // }
    // }

    // //<debug>
    // console.log(me.xtype, me.width, me.height, me.flex, me.id);
    // //</debug>
    // ExApplyIf(me, {
    //     layout: me.configData.extraFeatures.layout,
    //     defaults: defaultsValue
    // });

    // me.initialConfig.items = items;
    //     me.callParent(arguments);
    // },
    /**
     * @method initDefaultColumns
     * @param  {[type]}           columns [description]
     * @return {[type]}                   [description]
     */
    // initDefaultColumns: function (columns) {
    //     Ext.Array.push(columns, {
    //         noTitle: true,
    //         xtype: 'columnpanel',
    //         configData: {
    //             styleData: {
    //                 border: false
    //             },
    //             extraFeatures: {
    //                 collapsed: false,
    //                 layout: 'anchor',
    //                 collapsible: false,
    //                 collapseDirection: 'top'
    //             },
    //             titleStyleData: {
    //                 bold: false,
    //                 italic: false,
    //                 underline: false,
    //                 fontColor: '000000',
    //                 fontSize: '8'
    //             }
    //         }
    //     }, {
    //             noTitle: true,
    //             xtype: 'columnpanel',
    //             configData: {
    //                 styleData: {
    //                     border: false
    //                 },
    //                 extraFeatures: {
    //                     layout: 'anchor'
    //                 },
    //                 titleStyleData: {
    //                     bold: false,
    //                     italic: false,
    //                     underline: false,
    //                     fontColor: '000000',
    //                     fontSize: '8'
    //                 }
    //             }
    //         });
    // }

});