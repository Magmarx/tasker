/**
 * Update @esanchez
 * Created by Desar_6 on 21/01/2015.
 * @param  {[type]} "Ext.ux.design.ConfigurableHeaderIcon" [description]
 * @return {[type]}                                         [description]
 */
Ext.define('Ext.ux.design.ConfigurableHeaderIcon', {
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
        me.callParent(arguments);
    }
});