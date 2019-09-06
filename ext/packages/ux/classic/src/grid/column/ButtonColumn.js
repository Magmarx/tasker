/**
 * Created by MYAX on 6/15/2015.
 */
Ext.define('Ext.ux.grid.column.ButtonColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.buttoncolumn',
    requires: ['Ext.button.Button'],
    iconCls: null,
    configData: [],
    stopSelection: true,
    disabled: false,
    tooltipType: 'qtip',
    constructor: function() {
        this.scope = this;
        var Ex = Ext,
            me = this;
        me.callParent(arguments);
        Ex.Array.each(me.configData, function(item, index) {
            Ex.apply(me.configData, {
                itemIndex: index
            });
        });
    },
    /**
     * Enables this CheckColumn.
     */
    onEnable: function() {
        this.callParent(arguments);
        this._setDisabled(false);
    },

    /**
     * Disables this CheckColumn.
     */
    onDisable: function() {
        this._setDisabled(true);
    },

    // Don't want to conflict with the Component method
    _setDisabled: function(disabled) {
        var me = this,
            cls = me.disabledCls,
            items;

        items = me.up('tablepanel').el.select(me.getCellSelector());
        if (disabled) {
            items.addCls(cls);
        } else {
            items.removeCls(cls);
        }
    },
    /*
    renderTpl: [
        '<span id="{id}-btnWrap" role="presentation" class="{baseCls}-wrap',
        '<tpl if="splitCls"> {splitCls}</tpl>',
        '{childElCls}" unselectable="on">',
        '<span id="{id}-btnEl" class="{baseCls}-button" role="presentation">',
        '<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}',
        '{childElCls}" unselectable="on">',
        '{text}',
        '</span>',
        '<span role="presentation" id="{id}-btnIconEl" class="{baseCls}-icon-el {iconCls}',
        '{childElCls} {glyphCls}" unselectable="on" style="',
        '<tpl if="iconUrl">background-image:url({iconUrl});</tpl>',
        '<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">',
        '<tpl if="glyph">&#{glyph};</tpl><tpl if="iconCls || iconUrl">&#160;</tpl>',
        '</span>',
        '</span>',
        '</span>',
        // if "closable" (tab) add a close element icon
        '<tpl if="closable">',
        '<span id="{id}-closeEl" role="presentation"',
        ' class="{baseCls}-close-btn"',
        '<tpl if="closeText">',
        ' title="{closeText}" aria-label="{closeText}"',
        '</tpl>',
        '>',
        '</span>',
        '</tpl>'
    ],
    */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e, record, row) {
        var me = this,
            key = type === 'keydown' && e.getKey(),
            mousedown = type == 'mousedown',
            selector = Ext.baseCSSPrefix + 'btn';
        // console.log(e.target.className);
        if (!me.disabled && e.target.className.indexOf(selector) > -1) {
            if (mousedown || (key == e.ENTER || key == e.SPACE)) {
                // ( me.indexIcon < me.configData.length - 1 ) ?  ++me.indexIcon : me.indexIcon = 0;
                (me.itemIndex < me.configData.length - 1) ? ++me.itemIndex: me.itemIndex = 0;
                var dataIndex = me.dataIndex,
                    oldValue = record.get(dataIndex),
                    // newValue = me.configData[me.indexIcon].value
                    newValue = me.configData[me.itemIndex].value;

                // Allow apps to hook beforecheckchange
                me.fireEvent('itemclick', me, oldValue, newValue, record, e);
                if (me.fireEvent('change', me, oldValue, newValue, record, e) !== false) {
                    record.set(dataIndex, newValue);
                    record.dirty = true;
                    // Mousedown on the now nonexistent cell causes the view to blur, so stop it continuing.
                    if (mousedown) {
                        e.stopEvent();
                    }

                    // Selection will not proceed after this because of the DOM update caused by the record modification
                    // Invoke the SelectionModel unless configured not to do so
                    if (!me.stopSelection) {
                        view.selModel.selectByPosition({
                            row: recordIndex,
                            column: cellIndex
                        });
                    }

                    // Prevent the view from propagating the event to the selection model - we have done that job.
                    return false;
                } else {
                    // Prevent the view from propagating the event to the selection model if configured to do so.
                    return !me.stopSelection;
                }
            } else {
                return me.callParent(arguments);
            }
        } else {
            // Prevent the view from propagating the event to the selection model if configured to do so.
            return !me.stopSelection;
        }
    },
    // @private
    clearTip: function() {
        var me = this,
            el = me.el;

        if (Ext.quickTipsActive && Ext.isObject(me.tooltip)) {
            Ext.tip.QuickTipManager.unregister(el);
        } else {
            el.dom.removeAttribute(me.getTipAttr());
        }
    },
    // @private
    getTipAttr: function() {
        return this.tooltipType == 'qtip' ? 'data-qtip' : 'title';
    },
    // @private
    setTooltip: function(tooltip, initial) {
        var me = this;

        if (me.rendered) {
            if (!initial || !tooltip) {
                me.clearTip();
            }
            if (tooltip) {
                if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
                    Ext.tip.QuickTipManager.register(Ext.apply({
                            target: me.el.id
                        },
                        tooltip));
                    me.tooltip = tooltip;
                } else {
                    me.el.dom.setAttribute(me.getTipAttr(), tooltip);
                }
            }
        } else {
            me.tooltip = tooltip;
        }
        return me;
    },
    renderer: function(value, meta) {
        var me = this,
            btnDisable = '',
            objItem;
        if (me.disabled) {
            meta.tdCls += ' ' + me.disabledCls;
        }
        if (value === '' || value === undefined) {
            objItem = me.configData[0];
            meta.record.set(me.dataIndex, objItem.value);
            me.itemIndex = 0;
        } else {
            objItem = Ext.Array.filter(me.configData, function(item, index, array) {
                return (item.value == value);
            })[0];
            if (!objItem)
            //    Ex.log('Error: value not configured equivalent icon ', {iconCls: null});
            {
                me.itemIndex = objItem.itemIndex;
            }
        }
        if (me.disabled) {
            meta.tdCls += ' ' + me.disabledCls;
            btnDisable = '{0}item-disabled {0}disabled x-btn-disabled {0}btn-default-small-disabled';
        }
        me.tooltip = objItem.tooltip || '';
        if (me.tooltip) {
            me.setTooltip(me.tooltip, true);
        }
        var html = '<div class="{0}btn {0}btn-default-small {0}icon {0}btn-icon {0}btn-default-small-icon {0}border-box ' + btnDisable + '">' +
            '<div class="{0}btn-wrap">' +
            '<div class="{0}btn-button">' +
            '<div class="{0}btn-inner {0}btn-inner-center">' +
            '<div class="{0}btn-icon-el ' + objItem.iconCls + ' {0}action-col-icon {0}action-col-0 " style= "' + objItem.iconStyle + '"></div>' +
            '</div>' +
            '</div>' +
            '</div>';
        '</div>';
        return String.format(html, Ext.baseCSSPrefix);
    }
});