/**
 * @Author Miguel Porras
 * @Date 28/06/2019
 * @xtype floatingButtons
 */
Ext.define('Tasker.view.floatingButtons.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'floatingButtons',

    requires: [
        'Tasker.view.floatingButtons.PanelController'
    ],

    controller: 'floatingButtonController',

    items: [
        {
            xtype: 'button',
            cls: 'fab-create',
            iconCls: 'fa fa-plus',
            handler: 'createAddTaskWindow'
        }, {
            xtype: 'button',
            cls: 'fab-export' ,
            iconCls: 'fa fa-download'
        }
    ]
});
