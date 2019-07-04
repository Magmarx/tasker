/**
 * @Author Miguel Porras
 * @Date 28/06/2019
 * @xtype inProcessTaskPanel
 */
Ext.define('Tasker.view.inProcessTask.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'inProcessTaskPanel',

    requires: [],

    bodyCls: 'taskHolder',

    viewModel: 'inProcessTaskModel',
    controller: 'processController',

    scrollable: true,

    html: '<div style="position: absolute; font-size: 50px; color: #A7A6A6; line-height: 40px; top: 10px; left: 10px; "> In Process </div>',

    items: [
        {
            xtype: 'taskCard',
            bind: {
                store: '{taskCards}'
            },
            margin: 10,
            padding: '50px 0px'
        }
    ],
    listeners: {
        render: 'onRenderDrop'
    }
});
