/**
 * @Author Miguel Porras
 * @Date 28/06/2019
 * @xtype newTaskPanel
 */
Ext.define('Tasker.view.newTask.Panel', {
    extend: 'Ext.panel.Panel',

    xtype: 'newTaskPanel',

    requires: [],

    bodyCls: 'taskHolder',

    viewModel: 'newTaskModel',

    controller: 'newTaskController',

    scrollable: true,

    html: '<div style="position: absolute; font-size: 50px; color: #A7A6A6; line-height: 40px; top: 10px; left: 10px; "> New </div>',

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
