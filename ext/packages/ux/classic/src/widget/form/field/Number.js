/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 29/07/13
 * Time: 09:34 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.form.field.Number', {
    extend: 'Ext.form.field.Number',
    mixins: ['Ext.ux.widget.form.field.Base'],
    increment: 30,
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