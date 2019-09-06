/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 29/07/13
 * Time: 09:34 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.form.field.Date', {
    extend: 'Ext.form.field.Date',
    mixins: ['Ext.ux.widget.form.field.Base'],
    labelStyle: 'word-wrap: break-word;',
    xtype: 'universaldate',
    initComponent: function() {
        var me = this;
        me.initDefaults();
        // me.initActions(me);
        me.initStyle(me);
        Ext.apply(me, {
            id: Ext.id(),
            width: 400
        });
        me.callParent(arguments);
    }
});