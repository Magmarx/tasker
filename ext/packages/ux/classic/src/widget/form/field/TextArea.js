/**
 * @User: FCANU
 * @Date: 9/2/2017
 * Time: 09:34 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.form.field.TextArea', {
    extend: 'Ext.form.field.TextArea',
    mixins: ['Ext.ux.widget.form.field.Base'],
    xtype: 'universalTextField',
    initComponent: function() {
        var me = this;
        me.initDefaults();
        // me.initActions(me);
        me.initStyle(me);
        Ext.apply(me, {
            id: Ext.id(),
            //width: 400
            anchor: '100%'
        });
        me.callParent(arguments);
    }
});
