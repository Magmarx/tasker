/**
 * Created with IntelliJ IDEA.
 * User: Desar_6
 * Date: 29/07/13
 * Time: 09:34 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.widget.form.field.Text', {
    extend: 'Ext.form.field.Text',
    mixins: ['Ext.ux.widget.form.field.Base'],
    xtype: 'universalTextField',
    initComponent: function () {
        var me = this;

        var fieldType = me.initialConfig.inputType || 'text';

        me.initDefaults();
        // me.initActions(me);
        me.initStyle(me);
        Ext.apply(me, {
            inputType: fieldType,

            id: Ext.id(),
            width: 400
        });
        if (fieldType === 'password') {
            if (['view', 'remove'].includes(me.initialConfig.actionMode)) {
                Ext.apply(me, {
                    value: '•••••'
                });
            }
            if (me.initialConfig.actionMode === 'update') {
                Ext.apply(me, {
                    emptyText: '•••••'
                });
            }
            Ext.apply(me, {
                isEncrypted: true
            });
        }
        me.callParent(arguments);
    }
});