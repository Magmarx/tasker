/**
 * Created by Desar_6 on 06/04/2015.
 */
Ext.define('Ext.ux.grid.column.CounterAction', {
    extend: 'Ext.grid.column.Action',
    xtype: 'counterActionColumn',
    iconStyle: '',
    disableOnZero: true,
    showValue: false,
    // Renderer closure iterates through items creating an <img> element for each and tagging with an identifying
    // class name x-action-col-{n}
    defaultRenderer: function(v, meta, record, rowIdx, colIdx, store, view) {
        var me = this,
            prefix = Ext.baseCSSPrefix,
            scope = me.origScope || me,
            items = me.items,
            len = items.length,
            i = 0,
            item, ret, disabled, tooltip;
        v = v || null;
        // Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
        // Assign a new variable here, since if we modify "v" it will also modify the arguments collection, meaning
        // we will pass an incorrect value to getClass/getTip
        ret = Ext.isFunction(me.origRenderer) ? me.origRenderer.apply(scope, arguments) || '' : '';

        meta.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
        for (; i < len; i++) {
            item = items[i];

            disabled = item.disabled || (item.isDisabled ? item.isDisabled.call(item.scope || scope, view, rowIdx, colIdx, item, record) : false);
            tooltip = disabled ? null : (item.tmpTooltip || item.tooltip || (item.getTip ? item.getTip.apply(item.scope || scope, arguments) : null));

            // Only process the item action setup once.
            if (!item.hasActionConfiguration) {
                // Apply our documented default to all items
                item.stopSelection = me.stopSelection;
                item.disable = Ext.Function.bind(me.disableAction, me, [i], 0);
                item.enable = Ext.Function.bind(me.enableAction, me, [i], 0);
                item.hasActionConfiguration = true;
            }

            var iconCls = (item.iconCls || item.tmpIconCls || me.iconCls || ''),
                iconStyle = (me.iconStyle || item.iconStyle || '');
            if (iconStyle.length > 0) {
                if (iconStyle.trim().substr(iconStyle.length - 1, 1) !== ';') {
                    iconStyle += ';';
                }
            }

            if (iconStyle.indexOf('font-size') == -1) {
                iconStyle += ' font-size: 16px !important;';
            }

            /* if (iconStyle.indexOf ('padding')==-1)
                 iconStyle += " padding: 1px 3px 0px 3px !important;";
                 */
            if (iconStyle.indexOf('color') == -1) {
                iconStyle += ' color: gray !important;';
            }
            if (iconStyle.indexOf('background-color') == -1) {
                iconStyle += ' background-color:transparent;';
            }

            var actionIconCls = (me.actionIconCls || item.actionIconCls || '');
            var storeCounter = 0;
            var hasValues = '';
            if (typeof v === 'number') {
                storeCounter = v;
            } else {
                storeCounter = 0;
            }
            if (storeCounter > 0) {
                hasValues = Ext.actionCounterColor;
            }
            /* else if(storeCounter===-2)
                hasValues="fg-orange"; */
            var temporalWidget = Ext.widget('button', {
                renderTo: me.el.dom,
                text: me.showValue ? storeCounter : null,
                style: iconStyle,
                disabled: (me.disableOnZero ? storeCounter <= 0 : false),
                iconCls: iconCls + ' ' + actionIconCls + ' ' + prefix + 'action-col-' + String(i) + ' ' + (disabled ? prefix + 'item-disabled' : ' ') + hasValues
            });
            var testDom = temporalWidget.el ? temporalWidget.el.dom.outerHTML : '';
            ret += testDom;
            temporalWidget.destroy();
        }
        return ret;
    }
});