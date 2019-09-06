/**
 * Created by hmorjan on 04-Mar-16.
 */
Ext.define('Ext.ux.timeline.MenuList', {
    extend: 'Ext.view.View',
    requires: [],
    xtype: 'selectedTagMenuList',
    uses: 'Ext.data.Store',
    cls: 'metro',
    singleSelect: true,
    trackOver: true,
    autoScroll: true,
    overItemCls: 'green-flat',
    // selectedItemCls: 'active',
    itemSelector: 'div.list-content',
    titleField: 'text',
    bgField: 'tileBG',
    iconField: 'iconCls',
    selectedRecord: null,
    compactView: false,
    compactStyle: {
        'color': 'red',
        'position': 'absolute',
        'right': 0,
        'top': 0,
        'font-size': '6px !important;',
        'width': '12px',
        'height': '13px'
    },
    normalStyle: {
        'color': 'red',
        'position': 'absolute',
        'right': 0,
        'top': 0,
        'font-size': '8px !important;',
        'width': '15px',
        'height': '16px'
    },
    initComponent: function() {
        var me = this;
        me.tpl = this.createTemplate();
        Ext.apply(me, {
            listeners: {
                refresh: function() {
                    if (!me.compactView) {
                        var renderSelector = Ext.query(me.itemSelector);
                        for (var i in renderSelector) {
                            /* Ext.create('Ext.button.Button',{
                                cls:Ext.manifest.globals.fontBasePrefix+"close",
                                handler: function (view,record) {
                                    me.fireEvent("removeTag",me.selectedRecord);
                                },
                                //style:me.compactView?me.compactStyle:me.normalStyle,
                                style:me.normalStyle,
                                renderTo:renderSelector[i]
                            }); */
                        }
                    }
                },
                beforeitemmousedown: function(view, record, eOpts) {
                    me.selectedRecord = record;
                }
            }
        });
        me.callParent(arguments);
    },
    createTemplate: function() {
        var me = this;
        return new Ext.XTemplate(
            '<div style="width: 100% !important;">' +
            '<div class="listview">' +
            '<div class="list">' +
            '<tpl for=".">' +
            '<div class="list-content tag-field{% out.push(' + me.compactView + '?"-compact":" ");%} bg-{' + me.bgField + '}" title="{' + me.titleField + '}">' +
            '<span class="icon ' + Ext.manifest.globals.menuFontBasePrefix + '{' + me.iconField + '}"></span>' +
            '<div class="text-value text-ellipsis">{' + me.titleField + '}</div>' +
            '</div>' +
            '</tpl>' +
            '</div>' +
            '</div>' +
            '</div>');
    }
});