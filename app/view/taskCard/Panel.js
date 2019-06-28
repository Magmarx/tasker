/**
 * @Author Miguel Porras
 * @Date 28/06/2019
 * @xtype floatingButtons
 */
Ext.define('Tasker.view.taskCard.Panel', {
    extend: 'Ext.view.View',
    xtype: 'taskCard',

    requires: [],

    name: 'taskCards',

    // bodyCls: 'taskCard',
    border: true ,

    itemSelector: 'div.containCard',

    layout: {
        type: 'anchor'
    },

    region: 'center',

    tpl: new Ext.XTemplate(
        '<div class="Aligner">',
        '<tpl for=".">',
        '<div cellCls="cellMenu" class="containCard">',
        '<div class="taskCard" style="width:{width}; height:{height}" Aligner-item>',
        '<div style="background-color:{color}; width: 100%; height: 10px; border-radius: 25px;">',
        '<span class="cardText">{title}</span> </div>',
        '</div>',
        '</tpl>',
        '</div>'
    ),

    listeners: {
        // itemclick: 'onItemclick'
        itemClick: function () {
            console.log("click 2")
        }
    }
    
});