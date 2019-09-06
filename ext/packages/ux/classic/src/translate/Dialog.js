/**
 * Created by MYAX on 2/25/2015.
 */
Ext.define('Ext.ux.translate.Dialog', {
    extend: 'Ext.window.Window',
    height: '100%',
    width: '100%',
    title: 'Translation Center',
    xtype: 'translationcenter',
    draggable: false,
    resizable: false,
    requires: ['Ext.ux.translate.Panel'],
    layout: 'fit',
    initComponent: function() {
        Ext.apply(this, {
            title: Ext.localization.translationDialog.title,
            items: [
                {
                    xtype: 'translationpanel',
                    uuidModule: Ext.currentUserInfo.moduleId,
                    uuidLanguage: Ext.currentUserInfo.language,
                    modeTrop: false
                }
            ]
        });

        this.callParent(arguments);
    }
});
