/**
 * Created by Desar_6 on 21/01/2015.
 */
Ext.define('Ext.ux.panel.ConfigurableHeaderIcon', {
    extend: 'Ext.Component',
    config: {},
    initComponent: function() {
        var me = this;
        var defaults = {
            tag: 'span',
            style: 'width:18px; height:18px;'
        };
        Ext.apply(defaults, me.config);
        Ext.apply(me, {
            autoEl: defaults
        });
        me.autoEl.cls = me.autoEl.cls.join(' ');
        // console.log(me.autoEl.cls);
        me.callParent(arguments);
    }
});