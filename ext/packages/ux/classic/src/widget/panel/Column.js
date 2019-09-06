/**
 * Container **Panel** which implements a custom scroll-bar to be used in form designer
 * @author
 * @class Ext.ux.widget.panel.Column
 * @extends Ext.panel.Panel
 */
Ext.define('Ext.ux.widget.panel.Column', {
    extend: 'Ext.ux.widget.panel.Panel',
    // extend: "Ext.panel.Panel",
    // border: false,
    //  cls: "blockDDRegion",
    xtype: 'columnpanel'
        /**
         * [setEnable description]
         * @method setEnable
         * @param  {[type]}  value [description]
         */
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
     * [initComponent description]
     * @method initComponent
     * @override
     */
    // initComponent: function () {
    //     var me = this,
    //         Ex = Ext,
    //         ExApplyIf = Ex.applyIf;

    //     me.on("afterlayout", me.doAfterLayout, me);
    //     me.callback = function () {
    //         me.fireEvent("updatedobject");
    //     };

    //     if (me.initialConfig) {
    //         delete me.initialConfig.__JSON__configData;
    //     }
    //     me.configData = me.configData || {};
    //     ExApplyIf(me.configData, {
    //         styleData: {}, sourceConfig: {}, extraFeatures: {}, titleStyleData: {}
    //     });
    //     var //context = me.context || Ext.getCurrentContext(me.configData.instanceId),
    //         labelStore = false,//context['LabelStore'],
    //         label = null;

    //     // if (me.width) {
    //     //     ExApplyIf(me.configData.styleData, {
    //     //         width: 100,
    //     //         // height: 500,
    //     //         widthUnit: 'percent',
    //     //         // heightUnit: 'px',
    //     //     });
    //     // }

    //     // if (me.height) {
    //     //     ExApplyIf(me.configData.styleData, {
    //     //         height: 100,
    //     //         // height: 500,
    //     //         widthUnit: 'percent',
    //     //         // heightUnit: 'px',
    //     //     });
    //     // }

    //     // ExApplyIf(me.configData.styleData, {
    //     //     width: (me.width || 400),
    //     //     height: (me.height || 500),
    //     //     widthUnit: 'px',
    //     //     heightUnit: 'px',
    //     //     // border: true,
    //     //     // borderSize: 1
    //     // });
    //     ExApplyIf(me.configData.titleStyleData, {
    //         bold: false,
    //         italic: false,
    //         underline: false,
    //         fontSize: '8'
    //     });
    //     ExApplyIf(me.configData.extraFeatures, {
    //         layout: 'anchor',
    //         referenceLabelName: null
    //     });

    //     me.initialConfig.configData = me.configData;
    //     var defaultsValue = me.configData.extraFeatures.layout === "anchor" ? { anchor: "100%" } : {};
    //     var titleStyle;
    //     var panelTitle = me.configData.extraFeatures.referenceLabelName;
    //     if (panelTitle) {
    //         if (labelStore) {
    //             if (!Ex.isEditMode) {
    //                 var labelValue = labelStore.getValueByReferenceName(panelTitle);
    //                 if (labelValue !== "") {
    //                     label = labelValue;
    //                 } else {
    //                     label = "{" + me.configData.extraFeatures.referenceLabelName + "}";
    //                 }
    //             } else {
    //                 label = "{" + me.configData.extraFeatures.referenceLabelName + "}";
    //             }
    //         }
    //         var titleStyleData = me.configData.titleStyleData,
    //             titleText = label;

    //         if (titleStyleData.bold) {
    //             titleText = "<b>" + titleText + "</b>";
    //         }

    //         if (titleStyleData.italic) {
    //             titleText = "<i>" + titleText + "</i>";
    //         }
    //         if (titleStyleData.underline) {
    //             titleText = "<u>" + titleText + "</u>";
    //         }

    //         var titleHeight = parseInt(titleStyleData.fontSize);
    //         titleHeight = titleHeight + 5;
    //         titleStyle = "<div style='font-family:tahoma, arial, verdana, sans-serif; !important;" +
    //             "font-weight: bold !important; " +
    //             "text-transform: none;" +
    //             "font-size: " + titleStyleData.fontSize + "pt !important; " +
    //             "line-height: " + titleHeight.toString() + "px !important; " +
    //             "'>" +
    //             titleText +
    //             "</div>";
    //     }

    //     me.on("afterrender", function () {
    //         me.hidden = me.configData.extraFeatures.hidden || false;
    //         me.collapsed = me.configData.extraFeatures.collapsed || false;
    //     }, me, { single: true });

    //     Ext.apply(me, {
    //         title: titleStyle,
    //         border: me.configData.styleData.border,
    //         autoScroll: me.configData.extraFeatures.autoScroll,
    //         collapsible: me.configData.extraFeatures.collapsible || false,
    //         collapseDirection: me.configData.extraFeatures.collapseDirection || "top"
    //     });

    //     switch (me.configData.styleData.widthUnit) {
    //         case 'px':
    //             Ext.apply(me, {
    //                 width: parseInt(me.configData.styleData.width)
    //             });
    //             break;
    //         case 'percent':
    //             Ext.apply(me, {
    //                 width: me.configData.styleData.width.toString() + "%"
    //             });
    //             break;
    //         case 'proportional':
    //             Ext.apply(me, {
    //                 flex: parseInt(me.configData.styleData.width)
    //             });
    //             break;
    //     }
    //     if (!me.height) {
    //         switch (me.configData.styleData.heightUnit) {
    //             case 'px':
    //                 Ext.apply(me, {
    //                     height: parseInt(me.configData.styleData.height)
    //                 });
    //                 break;
    //             case 'percent':
    //                 Ext.apply(me, {
    //                     height: me.configData.styleData.height.toString() + "%"
    //                 });
    //                 break;
    //             case 'proportional':
    //                 Ext.apply(me, {
    //                     flex: parseInt(me.configData.styleData.height)
    //                 });
    //                 break;
    //         }
    //     }
    //     //<debug>
    //         console.log(me.xtype, me.width, me.height, me.flex);
    //     //</debug>
    //     Ext.applyIf(me, {
    //         layout: me.configData.extraFeatures.layout,
    //         defaults: defaultsValue
    //     });

    //     me.callParent(arguments);
    // },
    // /**
    // * Set custom scroll to container if configured as `autoScroll`
    // * @param me {object} container body
    // * @protected
    // */
    // doAfterLayout: function (me) {
    //     if (me.autoScroll) {
    //         fleXenv.fleXcrollMain(me.body.dom);
    //     }
    // },
    /**
     * Overloading of method in abstractComponent class
     * this method search for existing scroll divs and hide them with attribute `display = none`, copy the `contentwrapper` content
     * to component body to finally sets autoScroll property to body to resize the container.
     * @protected
     */
    // beforeLayout: function () {
    //     //<debug>
    //     console.log('beforeLayout', arguments);
    //     //</debug>
    //     var me = this;
    //     if (me.autoScroll) {
    //         var wrapperContent = Ext.get(me.id).select("div.contentwrapper");
    //         var scrollWrapper = Ext.get(me.id).select("div.scrollwrapper");
    //         var xParentId;
    //         for (var scrollItem in scrollWrapper.elements) {
    //             var scrollElement = Ext.get(scrollWrapper.elements[scrollItem].id);
    //             if (scrollElement) {
    //                 xParentId = scrollWrapper.elements[scrollItem].id.substring(0, scrollWrapper.elements[scrollItem].id.length - 19);
    //                 if (me.id == xParentId) {
    //                     scrollElement.dom.style.width = "100%";
    //                     scrollElement.dom.style.display = "none";
    //                 }

    //             }
    //         }
    //         for (var item in wrapperContent.elements) {
    //             var contentElement = Ext.get(wrapperContent.elements[item].id);
    //             if (contentElement) {
    //                 xParentId = wrapperContent.elements[item].id.substring(0, wrapperContent.elements[item].id.length - 20);
    //                 if (me.id == xParentId) {
    //                     contentElement.parent("div.mcontentwrapper").dom.style.display = "none";
    //                     contentElement.parent("div.mcontentwrapper").dom.style.width = "100%";
    //                     while (wrapperContent.elements[item].firstChild) {
    //                         me.body.dom.appendChild(wrapperContent.elements[item].firstChild);
    //                     }

    //                 }
    //             }
    //         }
    //         me.body.dom.style.overflow = "auto";
    //     }
    //     me.callParent(arguments);
    // },
    // /**
    // * Overloading of method in abstractComponent class
    // * Set display attribute to `block` to display scroll divs after the resize event has occurred, finally copy the body content
    // * to `contentwrapper` element.
    // * @protected
    // */
    // afterComponentLayout: function () {
    //     //<debug>
    //     console.log('afterComponentLayout', arguments);
    //     //</debug>
    //     var me = this;
    //     if (me.autoScroll) {
    //         var wrapperContent = Ext.get(me.id).select("div.contentwrapper");
    //         var scrollWrapper = Ext.get(me.id).select("div.scrollwrapper");
    //         var xParentId;
    //         for (var scrollItem in scrollWrapper.elements) {
    //             var scrollElement = Ext.get(scrollWrapper.elements[scrollItem].id);
    //             if (scrollElement) {
    //                 xParentId = scrollWrapper.elements[scrollItem].id.substring(0, scrollWrapper.elements[scrollItem].id.length - 19);
    //                 if (me.id == xParentId)
    //                     scrollElement.dom.style.display = "block";
    //             }
    //         }
    //         if (wrapperContent.elements.length) {
    //             var contentElement = Ext.get(wrapperContent.elements[0].id);
    //             if (contentElement) {
    //                 xParentId = wrapperContent.elements[0].id.substring(0, wrapperContent.elements[0].id.length - 20);
    //                 if (me.id == xParentId) {
    //                     var divContent = me.body.dom.firstChild;
    //                     while (divContent) {
    //                         if (divContent.className == "mcontentwrapper" || divContent.className == "scrollwrapper") {
    //                             divContent = divContent.nextSibling;
    //                         } else {
    //                             var prevSibling = divContent.previousSibling;
    //                             wrapperContent.elements[0].appendChild(divContent);
    //                             divContent = prevSibling.nextSibling;
    //                         }

    //                     }
    //                     contentElement.parent("div.mcontentwrapper").dom.style.display = "block";
    //                 }
    //             }
    //         }
    //         me.body.dom.style.overflow = "hidden";
    //     }
    //     this.callParent(arguments);
    // }

});