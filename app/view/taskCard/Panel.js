/**
 * @Author Miguel Porras
 * @Date 28/06/2019
 * @xtype floatingButtons
 */
Ext.define('Tasker.view.taskCard.Panel', {
    extend: 'Ext.view.View',
    xtype: 'taskCard',

    requires: [],

    controller: 'taskCardController',

    name: 'taskCards',

    border: true ,

    itemSelector: 'div.containCard',

    layout: {
        type: 'anchor'
    },

    region: 'center',

    tpl: new Ext.XTemplate(
        '<div class="Aligner">',
        '<tpl for=".">',
        '<div cellCls="cellMenu" class="containCard" style="margin: {upPadding};">',
        '<div class="taskCard" style="width:{width}; height:{height}; background-color: {background};" Aligner-item>',
        '<div style="background-color:{color}; width: 100%; height: 10px; border-radius: 25px;">',
        '<span class="cardText">{title}</span>',
        '<div style="background-color: #C1D5E0; color: #848484" class="{cardClass}"> {duration} Hours </div>',
        '<div style="background-color: #90A4AE; color: #E9E9E9;" class="{cardClass}"> {rating} Stars </div>',
        '<div style="background-color: #62757F; color: #FFFFFF;" class="{cardClass}"> {storyPoints} S.P</div>',
        '<span class="dateText" style="line-height: {dateLineHeight}; font-size: {dateFontSize};"> {initDate} - - - - - - - - {endDate}</span>',
        '</div>',
        '</div>',
        '</tpl>',
        '</div>'
    ),
    // color: '#3B939A',
    // title: 'Preview Card',
    // duration: '0',
    // rating: '3',
    // storyPoints: '0',
    // initDate: '00/00/0000',
    // endDate: '00/00/0000',
    // width: '500px',
    // height: '200px'

    listeners: {
        // itemclick: 'onItemclick'
        itemClick: 'openCardEditor',
        boxready: 'onRenderDrag'
    }
    
});