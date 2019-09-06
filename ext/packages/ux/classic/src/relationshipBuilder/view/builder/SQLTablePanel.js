/**
 * Created by DELL on 03/10/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.view.builder.SQLTablePanel', {
    extend: 'Ext.panel.Panel',
    instanceId: null,
    alias: ['widget.sourcerelationshiptablepanel'],
    //    id: 'SourceRelationshipTablePanel',
    requires: ['Ext.ux.relationshipBuilder.view.builder.SQLTable'],
    model: null,
    // layout:'fit',
    autoScroll: true,
    // height: 2000,
    // width: 2000,
    keyField: 'id',
    // listeners:{
    //    'afterrender':function(me){
    //     //   me.initEntity()
    //    },
    //    'containercontextmenu': function (view, event)
    //    {
    //        console.log('contextmenu')
    //    }
    // },
    initComponent: function() {
        var me = this,
            Ex = Ext;
        //  if (!me.connectionProxy)
        // me.connectionProxy = Ext.ConnectionStore.data.items[1];
        var drawItem = Ext.create('Ext.draw.Component', {
            viewBox: false,
            autoScroll: true,
            listeners: {
                'afterlayout': function(view, layout, eOpts) {
                    console.log('afterlayout');
                },
                'afterrender': function(panel) {
                    drawItem.initDropTarget();
                },
                'render': function(panel) {
                    // var a = 1;
                    // console.log(panel);
                    panel.getEl().el.on('contextmenu', function(e) {
                        e.stopEvent();
                    }, panel);
                    // //panel.body.on('contextmenu', function (event, item, eOpts)
                    // {
                    //    console.log(panel);
                    // });
                }
            },
            initDropTarget: function() {
                // init draw component inside qbwindow as a DropTarget
                this.dropTarget = Ex.create('Ext.dd.DropTarget', me.el, {
                    ddGroup: 'SourceRelationshipDDGroup',
                    notifyDrop: function(source, event, data) {
                        var relatedTablesStore,
                            duplicatedSources,
                            duplicateMsg = '',
                            that = me;
                        // relatedTablesStore = Ex.StoreManager.lookup('SourceRelationshipTable');
                        relatedTablesStore = ux.relationshipbuilder.sqlSelect.tables;
                        // Checks for no duplicated records in the relationship diagram
                        // duplicatedSources = relatedTablesStore.queryBy(function(record){
                        //    if ((record.get('sourceName') == data.records[0].get('sourceName'))&& !duplicateMsg){
                        //        duplicateMsg = Ex.localization.sourceRelationship.duplicate.name;
                        //        return true;
                        //    }
                        //    if ((record.get('targetName') == data.records[0].get('targetName')) && !duplicateMsg){
                        //        duplicateMsg = Ex.localization.sourceRelationship.duplicate.target.start + record.get('sourceName') +
                        //         Ex.localization.sourceRelationship.duplicate.target.end;
                        //        return true;
                        //    }
                        // });
                        var record = data.records[0];
                        //                        if (!record.get('isIncluded'))
                        var rec = relatedTablesStore.findRecord(me.keyField, record.get(me.keyField), false, false, false, true);
                        if (rec) {
                            // Ex.Msg.alert(Ex.localization.apiName, Ex.localization.sourceRelationship.duplicate.name);
                            me.showMessage(Ex.localization.sourceRelationship.duplicate.name, 'error');
                            return false;
                        } else {
                            // add a sqltable to the sqlTablePanel component

                            var myPos = me.getPosition();
                            me.createEntity(record, event.getX() - myPos[0], event.getY() - myPos[1]);
                            // that.add({
                            //    xtype: 'sourcerelationshiptable',
                            //    connectionProxy: that.connectionProxy,
                            //    constrain: true,
                            //    model: record
                            // }).show();
                            return true;
                            // } else
                            // {
                            //    duplicateMsg = Ex.localization.sourceRelationship.duplicate.name;
                            //    Ex.Msg.alert(Ex.localization.apiName, duplicateMsg);
                            //    return false;
                            // }
                        }
                    }
                });
            }
        });
        Ex.applyIf(me, {
            items: [drawItem],
            getDrawComponent: function() {
                return drawItem;
            }

        });
        me.callParent(arguments);
    },
    // console.log('setJOins');
    // var me=this,Ex=Ext;
    // if (me.model){
    //    var relatedJoins = me.model.joins.data.items, Ex = Ext;
    //    Ex.Array.each(relatedJoins, function (item)
    //    {
    //        console.log('setJoins');
    //        me.createEntity(item)
    //        //me.add({
    //        //    xtype: 'sourcerelationshiptable',
    //        //    connectionProxy: me.connectionProxy,
    //        //    constrain:true,
    //        //    model : item
    //        //}).show();
    //    });
    // }
    // me.doLayout();

    createEntity: function(record, x, y) {
        if (record) {
            var me = this,

                existEntity = me.getTableByProperty(record.get('id'), 'tableId');
            //       existEntity = null;
            if (!existEntity) {
                var table = Ext.widget('sourcerelationshiptable', { //   );
                    // var table  = Ext.widget('window', {                //   );
                    // me.add({
                    //     xtype: 'sourcerelationshiptable',
                    instanceId: me.instanceId,
                    // autoShow: true,
                    connectionProxy: me.connectionProxy,
                    tableId: record.get('id'),
                    constrain: true,
                    model: record,
                    constrainTo: me.id,
                    context: me,
                    x: x || 0,
                    y: y || 0
                        //
                });
                me.add(table);
                table.show();
                // .show();
                // entity.show();
                //   return entity
            } else {
                me.showMessage(Ext.localization.sourceRelationship.duplicate.name, 'error');
            }
            // else
            //  return null;
            // console.log(me.getPosition())
            //  record.set('isIncluded', true);
        }
    },
    getTableByProperty: function(value, property) {
        property = property || 'tableId';
        if (value) {
            return this.down('[' + property + ' =' + value + ']');
        } else {
            return null;
        }
    },
    showMessage: function(msg, type, layout, delay) {
        Ext.Notify.msg(
            msg, {
                layout: layout || 'topright',
                delay: delay || 5000,
                type: type || 'success'
            });
    }
});