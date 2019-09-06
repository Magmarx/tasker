/**
 * Created by DELL on 03/10/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.view.VisualBuilder', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.visualrelationbuilder'],
    instanceId: null,
    requires: [
        'Ext.ux.relationshipBuilder.view.builder.SQLTablePanel',
        'Ext.ux.relationshipBuilder.view.builder.SQLSelect',
        'Ext.ux.relationshipBuilder.view.builder.SourceGrid'
    ],
    height: 620,
    width: 1000,
    model: {},
    sourceStore: null,
    closeWithoutSave: false,
    uuidModule: null,
    modal: true,
    listeners: {
        'beforeclose': function(me) {
            var tableCount;
            tableCount = ux.relationshipbuilder.sqlSelect.tables.data.length;
            if (!me.closeWithoutSave && tableCount) {
                me.closeConfirmationDialog();
                return false
            }
        },
        'close': function(me) {
            me.fireEvent('close', me);
        },
        'afterrender': function(me) {
            me.initEntity();
        }
    },
    layout: {
        type: 'border'
    } //,
    /*items: [{
        xtype: 'panel',
        border: false,
        height: 400,
        margin: 5,
        layout: {
            type: 'border'
        },
        region: 'center',
        split: true,
        items: [{
            xtype: 'sourcerelationshiptablepanel',
            border: false,
            region: 'center',
            height: 280,
            split: true,
            layout: 'fit',
            model: this.model ? this.model : null
        }, {
            xtype: 'relationshipsourcegrid',
            border: false,
            region: 'west',
            width: 200,
            height: 400,
            split: true
        }]
    }]*/
    ,
    initComponent: function() {
        var me = this,
            Ex = Ext,
            context = Ex.getCurrentContext(me.instanceId),
            sourceStore = me.sourceStore || context.SourceStore,
            decode = Ex.JSON.decode;

        // create user extension namespace ux.relationshipbuilder
        Ex.namespace('ux.relationshipbuilder');
        // disable gutter (linenumbers) and toolbar for SyntaxHighlighter
        SyntaxHighlighter.defaults['gutter'] = false;
        SyntaxHighlighter.defaults['toolbar'] = false;
        ux.relationshipbuilder.connections = [];




        var sqlManager = Ex.widget('sqlselectsource', {
            instanceId: me.instanceId,
            sourceStore: sourceStore, // temporal 
            config: {
                tables: decode(me.rawTables),
                joins: decode(me.rawJoins),
                sources: decode(me.rawSources)
            }
        });



        ux.relationshipbuilder.sqlSelect = sqlManager;
        ux.relationshipbuilder.testStore = me.testStore;
        // ux.relationshipbuilder.sqlManager.connection = connectionStore
        if (sqlManager.tables.data.items)
            me.model.tables = sqlManager.tables;
        if (sqlManager.joins.data.items)
            me.model.joins = sqlManager.joins
            // add toolbar to the dockedItems

        me.tablePanel = Ex.widget('sourcerelationshiptablepanel', {
            instanceId: me.instanceId,
            border: false,
            region: 'center',
            height: 280,
            split: true,
            layout: 'fit',
            model: me.model ? me.model : null
        });
        me.gridPanel = Ex.widget('relationshipsourcegrid', {
            instanceId: me.instanceId,
            // xtype: 'relationshipsourcegrid',
            border: false,
            region: 'west',
            width: 200,
            height: 400,
            split: true,
            store: sqlManager.sources,
            listeners: {
                'itemdblclick': function(grid, record, item, index, e, eOts) {
                    me.tablePanel.createEntity(record, 0, 0);
                }
            }
        })
        Ex.apply(me, {
            //            title: Ext.localization.sourceRelationshipWindow.visualBuilder.title,            
            items: [{
                xtype: 'panel',
                border: false,
                height: 400,
                margin: 5,
                layout: {
                    type: 'border'
                },
                region: 'center',
                split: true,
                items: [
                    me.tablePanel,
                    me.gridPanel
                ]
            }],
            initSources: function() {
                sqlManager.loadSurces();
                me.initEntity();
            }
        });
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
                    xtype: 'tbfill'
                }, {
                    text: Ex.localization.sourceRelationshipWindow.visualBuilder.dockedItems.button.ok,
                    // icon: "resources/images/icon-save.gif",
                    iconCls: "mpaUI-save",
                    handler: function() {
                        me.isValid()
                    }
                }, {
                    text: Ex.localization.sourceRelationshipWindow.visualBuilder.dockedItems.button.cancel,
                    // icon: "resources/images/cancel.png",
                    iconCls: "mpaUI-cancelFilled",
                    handler: function() {
                        me.closeConfirmationDialog();
                    }
                }
                //,
                //{
                //    text: 'relations',
                //    handler: function ()
                //    {
                //        me.initEntity();
                //    }
                //}
            ]
        }];
        ux.relationshipbuilder.initEntity = me.initEntity
        this.callParent(arguments);
        // this.setModel();
    },
    closeConfirmationDialog: function() {
        var me = this,
            Ex = Ext;
        if (ux.relationshipbuilder.sqlSelect.tables.data.length) {
            Ex.Msg.confirm(Ex.localization.apiName, Ex.localization.sourceRelationshipWindow.visualBuilder.confirmationMessage, function(button) {
                if (button === "yes") {
                    ux.relationshipbuilder.sqlSelect.tables.removeAll();
                    ux.relationshipbuilder.sqlSelect.joins.removeAll();
                    me.closeWithoutSave = true;
                    me.close();
                }
            });
        } else {
            me.closeWithoutSave = true;
            me.close()
        }
    },
    isValid: function() {
        var me = this,
            Ex = Ext,
            ExLocalization = Ex.localization,
            rawConfigSorce = ux.relationshipbuilder.sqlSelect.sources.getSerializedData(),
            record = me.testStore.getRecordByInstanceId(me.uuidModule || me.instanceId);

        if (!ux.relationshipbuilder.sqlSelect.joins.data.length) {
            Ex.Msg.alert(ExLocalization.apiName, ExLocalization.sourceRelationshipWindow.visualBuilder.saveData.missingJoinAlert);
            return false
        } else {
            var tableRelationships = [],
                tableWithoutRelationship = [];
            ux.relationshipbuilder.sqlSelect.tables.each(function(table) {
                tableRelationships = ux.relationshipbuilder.sqlSelect.joins.queryBy(function(record) {
                    if (record.get('pkTableName') === table.get('targetName') || record.get('fkTableName') === table.get('targetName'))
                        return true;
                });
                if (!tableRelationships.length) {
                    tableWithoutRelationship.push(table)
                }
            });
            if (tableWithoutRelationship.length) {
                Ex.Msg.confirm(ExLocalization.apiName, ExLocalization.sourceRelationshipWindow.visualBuilder.saveData.tableWillBeDiscarded,
                    function(button) {
                        if (button === "yes") {
                            var rawConfigTables = ux.relationshipbuilder.sqlSelect.tables.getSerializedData(),
                                rawConfigJoins = ux.relationshipbuilder.sqlSelect.joins.getSerializedData();

                            ux.relationshipbuilder.sqlSelect.tables.remove(tableWithoutRelationship);


                            record.set('rawTables', Ex.JSON.encode(rawConfigTables));
                            record.set('rawJoins', Ex.JSON.encode(rawConfigJoins));

                            me.testStore.sync();
                            //   me.masterRecord.set('rawJoins', Ex.JSON.encode(rawConfigJoins)),
                            //Ex.RelationshipUsedTableStore.add(ux.relationshipbuilder.sqlSelect.tables.data.items);
                            //Ex.RelationshipJoinStore.add(ux.relationshipbuilder.sqlSelect.joins.data.items);
                            me.closeWithoutSave = true;
                            delete ux.relationshipbuilder
                            delete ux;
                            me.close();
                        }
                    });
            } else {
                //Ex.RelationshipUsedTableStore.add(ux.relationshipbuilder.sqlSelect.tables.data.items);
                //Ex.RelationshipJoinStore.add(ux.relationshipbuilder.sqlSelect.joins.data.items);
                var rawConfigTables = ux.relationshipbuilder.sqlSelect.tables.getSerializedData(),
                    rawConfigJoins = ux.relationshipbuilder.sqlSelect.joins.getSerializedData();

                if (record) {
                    record.set('rawTables', Ex.JSON.encode(rawConfigTables));
                    record.set('rawJoins', Ex.JSON.encode(rawConfigJoins));
                } else {
                    me.testStore.add({
                        instanceId: me.uuidModule || me.instanceId,
                        rawTables: Ex.JSON.encode(rawConfigTables),
                        rawJoins: Ex.JSON.encode(rawConfigJoins),
                        rawSources: Ex.JSON.encode(rawConfigSorce)
                    });
                }

                me.testStore.sync();
                me.closeWithoutSave = true;
                delete ux.relationshipbuilder;
                delete ux;
                //me.fireEvent('close', me)
                me.close();
            }
        }
    },
    //showJoinCM : function(event){
    //    var cm,Ex=Ext;
    //    // stop the browsers event bubbling
    //    event.stopEvent();
    //    // create context menu
    //    cm = Ex.create('Ext.menu.Menu', {
    //        items: [{
    //            text: 'Remove Join',
    //            //icon: 'resources/images/remove.gif',
    //            iconCls: "mpaUI-delete4",
    //            handler: Ex.Function.bind(function(){
    //                var me=this;
    //                // remove any connection lines from surface and from array ux.relationshipbuilder.connections
    //                ux.relationshipbuilder.connections = Ex.Array.filter(ux.relationshipbuilder.connections, function(connection){
    //                    var bRemove = true;
    //                    if (me.uuid == connection.uuid) {
    //                        me.line.remove();
    //                        me.bgLine.remove();
    //                        me.miniLine1.remove();
    //                        me.miniLine2.remove();
    //                        bRemove = false;
    //                    }
    //                    return bRemove;
    //                }, this);
    //                ux.relationshipbuilder.sqlSelect.removeJoinById(me.uuid);
    //            }, this)
    //        }, {
    //            text: 'Close Menu',
    //            // icon: 'resources/images/cross.gif',
    //            iconCls: "mpaUI-close1",
    //            handler: Ex.emptyFn
    //        }]
    //    });
    //    // show the contextmenu next to current mouse position
    //    cm.showAt(event.getXY());
    //},

    initEntity: function() {
        var me = this,
            tablePanel = me.tablePanel,
            Ex = Ext;
        sourceStore = ux.relationshipbuilder.sqlSelect.sources
        var entityList = ux.relationshipbuilder.sqlSelect.tables.data.items;
        if (entityList.length) {
            Ex.Array.each(entityList, function(entity, index) {
                console.log(index)
                var source = sourceStore.findRecord('id', entity.get('id'), false, false, false, true);

                console.log(entity.get('id'));
                if (source)
                //for (var i = 0; i < entityList.length; i++)
                //{
                //tablePanel.createEntity(entityList[i], entityList[i].get('x'), entityList[i].get('y'));
                    tablePanel.createEntity(source);
                //}

                source = null;
            })
        }
        var relationList = ux.relationshipbuilder.sqlSelect.joins.data.items;
        if (relationList.length) {
            console.log(relationList.length);
            Ex.Array.each(relationList, function(item, index) {
                item.set('id', '');
                var pkTable = tablePanel.getTableByProperty(item.data.pkTable, 'tableId'),
                    fkTable = tablePanel.getTableByProperty(item.data.fkTable, 'tableId');
                if (pkTable && fkTable) {
                    console.log('create Entity join ' + index)

                    pkFieldRecord = pkTable.getFieldByProperty('dataIndex', item.get('pkField')),
                        fkFieldRecord = fkTable.getFieldByProperty('dataIndex', item.get('fkField')),
                        pkFieldIndex = pkTable.getFieldStore().indexOf(pkFieldRecord),
                        fkFieldIndex = fkTable.getFieldStore().indexOf(fkFieldRecord),
                        aBBPos = [fkFieldIndex, pkFieldIndex];
                    pkTable.createConnection(item, aBBPos, false);
                }
            })
        }
        // setModel:function(){
        //  var me = this,
        //      Ex = Ext;
        ////  console.log('setModel');
        //  //if (me.model)
        //  //{

        //      var tablePanel = me.tablePanel;

        //      var relatedTables = ux.relationshipbuilder.sqlSelect.tables.data.items,
        //          tableJoins = ux.relationshipbuilder.sqlSelect.joins.data.items;

        //      Ex.Array.each(relatedTables, function (item)
        //      {
        //          console.log('setModel');
        //          console.log(item)
        //          //tablePanel.add({
        //          //    xtype: 'sourcerelationshiptable',
        //          //    connectionProxy: me.connectionProxy,
        //          //    tableId: item.get('id'),
        //          //    constrain: true,
        //          //    context: tablePanel,
        //          //    x: item.get('x'),
        //          //    y: item.get('y'),
        //          //    // constrainTo: 'SourceRelationshipTablePanel',
        //          //    constrainTo: me.tablePanel.id,
        //          //    model: item
        //          //}).show();
        //          tablePanel.createEntity(item, item.get('x'), item.get('y'));
        //      });
        //      if (relatedTables.length >= 2)
        //          Ex.Array.each(tableJoins, function (item)
        //          {
        //              console.log('setModel-2');
        //          //var pkTable = me.down('[tableId=' + item.data.pkTable + ']'),


        //              //fkFieldRecord = fkTable.down('sourcerelationshiptablegrid').store.findRecord('dataIndex', item.data.fkField, false, false, true),
        //              //fkFieldRecord = fkTable.getGridField().store.findRecord('dataIndex', item.data.fkField, false, false, true),
        //              // fkFieldRecord = fkTable.getFieldByProperty('dataIndex', item.get('fkField')),
        //              //pkFieldIndex = pkTable.down('sourcerelationshiptablegrid').store.indexOf(pkFieldRecord),
        //              //pkFieldIndex = pkTable.getFieldStore().indexOf(pkFieldRecord)
        //              // fkFieldIndex = fkTable.down('sourcerelationshiptablegrid').store.indexOf(fkFieldRecord),
        //              // fkFieldIndex = fkTable.getFieldStore().indexOf(fkFieldRecord)
        //              //aBBPos = [pkFieldIndex, fkFieldIndex];



        //              //var pkTable = tablePanel.getTableByProperty(item.data.pkTable, 'tableId'),
        //              //    fkTable = tablePanel.getTableByProperty(item.data.fkTable, 'tableId');
        //              //if (pkTable && fkTable)
        //              //{
        //              //    pkFieldRecord = pkTable.getFieldByProperty('dataIndex', item.get('pkField')),
        //              //    fkFieldRecord = fkTable.getFieldByProperty('dataIndex', item.get('fkField')),
        //              //    pkFieldIndex = pkTable.getFieldStore().indexOf(pkFieldRecord),
        //              //    fkFieldIndex = fkTable.getFieldStore().indexOf(fkFieldRecord),
        //              //    aBBPos = [pkFieldIndex, fkFieldIndex];

        //              //    pkTable.createConnection(item, aBBPos);
        //              //}

        //              //console.log(pkTable);
        //              //console.log(fkTable);

        //              //if (pkTable && fkTable)
        //              //{
        //              ////}pkFieldRecord = pkTable.down('sourcerelationshiptablegrid').store.findRecord('dataIndex', item.data.pkField, false, false, true),
        //              ////var pkFieldRecord = pkTable.getGridField().store.findRecord('dataIndex', item.data.pkField, false, false, true),
        //              //var pkFieldRecord = pkTable.getFieldByProperty('dataIndex', item.get('pkField')),
        //              ////fkFieldRecord = fkTable.down('sourcerelationshiptablegrid').store.findRecord('dataIndex', item.data.fkField, false, false, true),
        //              ////fkFieldRecord = fkTable.getGridField().store.findRecord('dataIndex', item.data.fkField, false, false, true),
        //              //fkFieldRecord = fkTable.getFieldByProperty('dataIndex', item.get('fkField')),
        //              ////pkFieldIndex = pkTable.down('sourcerelationshiptablegrid').store.indexOf(pkFieldRecord),
        //              //pkFieldIndex = pkTable.getFieldStore().indexOf(pkFieldRecord)
        //              //// fkFieldIndex = fkTable.down('sourcerelationshiptablegrid').store.indexOf(fkFieldRecord),
        //              //fkFieldIndex = fkTable.getFieldStore().indexOf(fkFieldRecord)
        //              //aBBPos = [pkFieldIndex, fkFieldIndex];
        //              //connection;
        //              //  pkTable.shadowSprite.bConnections = true;
        //              //                fkTable.shadowSprite.bConnections = true;
        //       //       connection = fkTable.connection(pkTable.shadowSprite, fkTable.shadowSprite, "#157fcc", aBBPos, item.data.id);
        //              // pkTable.connectionUUIDs.push(connection.uuid);
        //              // fkTable.connectionUUIDs.push(connection.uuid);
        //              // ux.relationshipbuilder.connections.push(connection);
        //              // connection.bgLine.el.on('contextmenu', me.showJoinCM, connection);
        //              // connection.line.el.on('contextmenu', me.showJoinCM, connection);

        //              //var join = Ex.create('MPA.model.SourceRelationshipJoin');
        //              //join.set('id', connection.uuid);
        //              //join.set('pkTable', item.data.pkTable);
        //              //join.set('fkTable', item.data.fkTable);
        //              //join.set('pkTableName', item.data.pkTableName);
        //              //join.set('fkTableName', item.data.fkTableName);
        //              //join.set('pkField', item.data.pkField);
        //              //join.set('fkField', item.data.fkField);
        //              //join.set('pkSourceName', item.data.sourceName);
        //              //join.set('fkSourceName', item.data.sourceName);
        //            //  ux.relationshipbuilder.sqlSelect.addJoin(join);
        //          //}

        //         // pkTable.initConnection();
        //          // fkTable.initConnection()
        //      });
        ////  }
    }
});