/**
 * Created by DELL on 03/10/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.view.builder.SQLTableGrid', {
    extend: 'Ext.grid.Panel',
    instanceId: null,
    alias: ['widget.sourcerelationshiptablegrid'],
    // requires: ['Ext.ux.callout.Callout'],
    border: false,
    hideHeaders: true,
    autoScroll: true,
    containerObj: 'panel',
    table: null,
    getInternalTypesById: function(type) {
        switch (type) {
            case 0:
                return 'String';
            case 1:
                return 'Integer';
            case 2:
                return 'Text';
            case 3:
                return 'Datetime';
            case 4:
                return 'Image';
            case 5:
                return 'Time';
            case 6:
                return 'Decimal';
            case 7:
                return 'Money';
            case 8:
                return 'Uniqueidentifier';
            case 9:
                return 'SqlVariant';
            case 11:
                return 'HierarchyId';
            case 12:
                return 'Varbinary';
            case 13:
                return 'Binary';
            case 14:
                return 'Xml';
        }
    },
    rebuildTreeReference: function(fkCollection, currentTree, currentOrder, pkTable) {
        var me = this,
            Ex = Ext;
        console.log('rebuildTreeReference');
        console.log(fkCollection);
        console.log(currentTree);
        console.log(currentOrder);
        Ex.Array.each(fkCollection.items, function(child) {
            console.log('rebuildTreeReference');
            var existingPkTable, newPkTable, fkOrder;
            fkOrder = currentOrder + 1;
            existingPkTable = ux.relationshipbuilder.sqlSelect.joins.query('pkTable', child.data.fkTable, false, false, true);
            newPkTable = ux.relationshipbuilder.sqlSelect.getTableById(child.data.fkTable);
            newPkTable.set('tree', currentTree);
            console.log(fkOrder);
            newPkTable.set('order', fkOrder);
            if (existingPkTable.length) {
                me.rebuildTreeReference(existingPkTable, currentTree, fkOrder, newPkTable, null, false);
            }
        });
    },
    checkForCircularReference: function(fkTable, existingFkTable) {
        console.log('checkForCircularReference');
        var pkTableJoin;
        pkTableJoin = ux.relationshipbuilder.sqlSelect.joins.findRecord('pkTable', fkTable.data.id, false, false, true);
        if (pkTableJoin) {
            return pkTableJoin.get('pkTable') !== existingFkTable.get('pkTable');
        }
        return true;
    },
    setTreeReference: function(pkTable, fkTable) {
        console.log('setTreeReference');
        var me = this,
            treeIndex,
            existingPkTable,
            order = pkTable.get('order') + 1 || 1,
            existingFkTable = ux.relationshipbuilder.sqlSelect.joins.findRecord('fkTable', pkTable.data.id, false, false, true);
        if (existingFkTable) {
            if (me.checkForCircularReference(fkTable, existingFkTable)) {
                var parentTable = ux.relationshipbuilder.sqlSelect.getTableById(existingFkTable.get('pkTable'));
                treeIndex = Math.min(parentTable.get('tree'), pkTable.data.tree);
                //   order = pkTable.get('order')+1;
            } else {
                return false;
            }
        } else {
            treeIndex = Math.min(pkTable.data.tree, fkTable.data.tree);
        }

        var fkTableParents = ux.relationshipbuilder.sqlSelect.joins.query('fkTable', fkTable.data.id, false, false, true);
        if (fkTableParents) {
            var relatedpkTable, listParentOrder = [];
            Ext.Array.each(fkTableParents.items, function(record) {
                console.log('setTreeReference');
                relatedpkTable = ux.relationshipbuilder.sqlSelect.getTableById(record.get('pkTable'));
                if (relatedpkTable) {
                    Ext.Array.push(listParentOrder, relatedpkTable.get('order'));
                }
            });
        }

        if (listParentOrder.length) {
            order = Math.max(listParentOrder) + 1;
        }
        console.log(order);
        pkTable.set('tree', treeIndex);
        fkTable.set('tree', treeIndex);
        // fkTable.set('order', order ? order : pkTable.data.order + 1);
        fkTable.set('order', order);
        // Obtains all related tables to the foreign key
        existingPkTable = ux.relationshipbuilder.sqlSelect.joins.query('pkTable', fkTable.data.id, false, false, true);
        if (existingPkTable.length) {
            me.rebuildTreeReference(existingPkTable, treeIndex, fkTable.data.order, null, null, true);
        }

        /* if (pkTable.data.tree){
            fkTable.set('tree',pkTable.data.tree);
            fkTable.set('order',pkTable.data.order +1);
        }else{
            if(fkTable.data.tree){
                pkTable.set('tree',fkTable.data.tree);
                me.rebuildTreeReference(pkTable,fkTable,true);
            }
        } */
        if (!pkTable.data.tree && !fkTable.data.tree) {
            pkTable.set('tree', 1);
            fkTable.set('tree', 1);
            pkTable.set('order', 1);
            fkTable.set('order', 2);
        }

        return true;
    },
    initComponent: function() {
        var me = this,
            Ex = Ext;
        //   me.on('beforeclose', function () {  console.log('beforeClose');  });
        me.columns = [
            // {
            // xtype: 'gridcolumn',
            // width: 16,
            // padding: '5px 10px 4px 2px',
            // dataIndex: 'key',
            // renderer: function (val, meta, model)
            //    {
            //    //if (val == 'PRI') {
            //    if (val == 'primary' || val == "foreign")
            //    {
            //        return '<div class="mpaUI-' + val + 'key"></div>';
            //     //   meta.style = 'background-image:url(resources/images/key.gif) !important;background-position:2px 3px;background-repeat:no-repeat;';
            //    }
            //    return '';
            //   // return '&nbsp;';
            //    }
            // },
            {
                xtype: 'gridcolumn',
                flex: 1,
                dataIndex: 'dataIndex',
                renderer: function(val, meta, model) {
                    var rawHtml = '',
                        typekey = model.get('key'),
                        type = me.getInternalTypesById(model.get('type')),
                        style = 'white-space:nowrap; overflow: hidden; text-overflow: ellipsis;';

                    if (typekey == 'primary' || typekey == 'foreign') {
                        rawHtml = '<div title="' + typekey + '" class="mpaUI-' + typekey + 'key" style="float: left; width: 16px;"></div>';
                    }
                    rawHtml += '<div title="' + val + '" style="' + style + ' float:left;  width:50%;">' + val + '</div>';
                    rawHtml += '<div title="' + type + '" style="' + style + ' float:right;  width:25%;">' + type + '</div>';
                    return rawHtml;
                }
            }
        ];
        Ex.applyIf(me, {
            viewConfig: {
                listeners: {
                    bodyscroll: function() {
                        console.log('bodyscroll');
                        // var me = this;
                        var scrollOffset,
                            sqlTable;
                        // the bodyscroll event of the view was fired
                        // get scroll information
                        // scrollOffset = me.el.getScroll();
                        scrollOffset = this.el.getScroll();
                        // get the parent sqltable
                        // sqlTable = me.up('sqltable');
                        sqlTable = me.table;
                        // change shadowSprites scrollTop property
                        if (scrollOffset.top) {
                            sqlTable.shadowSprite.scrollTop = scrollOffset.top;
                            //   sqlTable.regStartDrag();
                            sqlTable.updateConnectionList();
                            sqlTable.moveConnection();
                        }
                        // redraw all connections to reflect scroll action
                        // for (var i = ux.relationshipbuilder.connections.length; i--;) {
                        //    sqlTable.connection(ux.relationshipbuilder.connections[i]);
                        // }
                    },
                    render: function(view) {
                        console.log('render');
                        var me = this,
                            Ex = Ext,
                            objName = null;
                        me.dd = {};
                        // init the view as a DragZone
                        me.dd.dragZone = new Ex.view.DragZone({
                            view: view,
                            ddGroup: 'SourceRelationshipTableGridDDGroup',
                            dragText: '{0} selected table column{1}',
                            onInitDrag: function(x, y) {
                                var me = this,
                                    data = me.dragData,
                                    view = data.view,
                                    record = view.getRecord(data.item);
                                data.records = [record];
                                me.ddel.update(me.getDragText());
                                me.proxy.update(me.ddel.dom);
                                me.onStartDrag(x, y);
                                objName = view.id;
                                return true;
                            }
                        });
                        // init the view as a DropZone
                        me.dd.dropZone = new Ex.grid.ViewDropZone({
                            view: view,
                            ddGroup: 'SourceRelationshipTableGridDDGroup',
                            handleNodeDrop: function(data, record, position) {
                                // Was soll nach dem Drop passieren?
                            },
                            onNodeOver: function(node, dragZone, e, data) {
                                    console.log('onNodeOver');
                                    var me = this,
                                        Ex = Ext,
                                        view = me.view;
                                    // validate same view inecesary obtain all data related.
                                    me.valid = false;
                                    if (view.id !== data.view.id) {
                                        var overRecord = view.getRecord(node),
                                            draggingRecord = data.records[0];
                                        if (overRecord && draggingRecord) {
                                            me.valid = (draggingRecord.get('key') === 'primary' && overRecord.get('key') === 'foreign') ? true : !!((draggingRecord.get('key') === 'foreign' && overRecord.get('key') === 'primary'));
                                            var boundView = node.boundView || node.getAttribute('data-boundview'),
                                                sqlTable1 = data.view.up('panel [name=sourceSqlTable]'),
                                                sqlTable2 = Ex.getCmp(boundView).up('panel [name=sourceSqlTable]'),
                                                dropTable = ux.relationshipbuilder.sqlSelect.getTableById(sqlTable1.tableId),
                                                targetTable = ux.relationshipbuilder.sqlSelect.getTableById(sqlTable2.tableId);
                                            me.valid = me.valid * !(dropTable.get('sourceName') === targetTable.get('sourceName'));
                                            if (!Ex.Array.contains(data.records, me.view.getRecord(node))) {
                                                me.valid = me.valid * !Ex.Array.contains(draggingRecord, overRecord) && draggingRecord.get('dataIndex') /* data.records[0].get('field') */ != '*';
                                            }
                                        }
                                    }
                                    return me.valid ? me.dropAllowed : me.dropNotAllowed;
                                }
                                //, onContainerOver: function ()
                                // {
                                //    console.log('onContainerOver');
                                //    var me = this;
                                //    // invalid drop target
                                //    me.valid = false;
                                //    return me.dropNotAllowed;
                                // }
                        });
                    },
                    drop: function(node, data) {
                        //  console.log('drop')
                        // var  Ex = Ext,

                        //    sqlTable1,
                        //    sqlTable2,
                        //    connection,
                        //    aBBPos,
                        //    join,
                        //    joinCondition = '',
                        //    dropTable, targetTable,
                        //    pkRecord,
                        //    fkRecord,
                        //       existingRelationship,
                        //        fkField,
                        //        pkField,
                        //        pkTableId,
                        //        fkTableId,
                        //        pkTableName,
                        //        fkTableName,

                        //        existingFkTable,
                        //        pkTable,
                        //        fkTable,
                        var that = me,
                            /* me=this, */
                            boundView = node.boundView || node.getAttribute('data-boundview'),
                            nodeIndex = node.viewIndex || node.getAttribute('data-recordindex'),
                            dataIndex = data.item.viewIndex || data.item.getAttribute('data-recordindex'),
                            joinValidationMessage = '',
                            ELocalization = Ex.localization.sourceRelationship;

                        if (boundView) {
                            //      console.log('boundView')
                            sqlTable1 = data.view.up('panel [name=sourceSqlTable]');
                            sqlTable1.updateSprite();

                            sqlTable2 = Ex.getCmp(boundView).up('panel [name=sourceSqlTable]');
                            sqlTable2.updateSprite();
                            //  sqlTable1.shadowSprite.bConnections = true;
                            // sqlTable2.shadowSprite.bConnections = true;
                            dropTable = ux.relationshipbuilder.sqlSelect.getTableById(sqlTable1.tableId);
                            targetTable = ux.relationshipbuilder.sqlSelect.getTableById(sqlTable2.tableId);
                            dropRecord = data.records[0],
                                targetRecord = sqlTable2.down('grid').store.getAt(nodeIndex);

                            if (dropRecord.get('key') == 'primary') {
                                pkRecord = dropRecord;
                                fkRecord = targetRecord;
                                aBBPos = [nodeIndex, dataIndex];
                                pkTable = dropTable;
                                fkTable = targetTable;
                            } else {
                                pkRecord = targetRecord;
                                fkRecord = dropRecord;
                                aBBPos = [dataIndex, nodeIndex];
                                pkTable = targetTable;
                                fkTable = dropTable;
                            }

                            // droppedFieldDataIndex = dropRecord.get('dataIndex'),
                            //   droppedFieldLength= dropRecord.get('length'),
                            //   droppedFieldType= dropRecord.get('type'),
                            //   droppedFieldKeyType = dropRecord.get('key'),

                            //   targetFieldDataIndex = targetRecord.get('dataIndex'),
                            //   targetFieldLength= targetRecord.get("length"),
                            //   targetFieldType= targetRecord.get("type"),
                            //   targetFieldKeyType = targetRecord.get('key'),
                            // joinStore = Ex.StoreManager.lookup('JoinStore'),
                            var joinStore = ux.relationshipbuilder.sqlSelect.joins,
                                pkTableId = pkRecord.get('tableId'),
                                fkTableId = fkRecord.get('tableId'),
                                fkField = fkRecord.get('dataIndex'),
                                existingFkTable = joinStore.findRecord('fkTable', fkTableId, false, false, true);

                            //   existingPkTable*/;

                            // pkTable = droppedFieldKeyType === 'primary' ? dropTable : targetTable;
                            // fkTable = droppedFieldKeyType === 'foreign'?dropTable:targetTable;
                            // pkTableId = droppedFieldKeyType === 'primary' ? sqlTable1.tableId : sqlTable2.tableId;

                            // fkTableId = droppedFieldKeyType === 'foreign'?sqlTable1.tableId:sqlTable2.tableId;

                            // pkTableName = droppedFieldKeyType === 'primary'?sqlTable1.model.data.targetName:sqlTable2.model.data.targetName;
                            // fkTableName = droppedFieldKeyType === 'foreign'?sqlTable1.model.data.targetName:sqlTable2.model.data.targetName;
                            // fkField = droppedFieldKeyType === 'foreign' ? droppedFieldDataIndex : targetFieldDataIndex;

                            // pkField = droppedFieldKeyType === 'primary' ? droppedFieldDataIndex : targetFieldDataIndex;

                            existingRelationship = joinStore.queryBy(function(record) {
                                if (existingFkTable) {
                                    if (record.get('pkTable') === pkTableId && record.get('fkField') === fkField && record.get('fkTable') === fkTableId) {
                                        if (!joinValidationMessage) {
                                            joinValidationMessage = ELocalization.relationship.duplicate;
                                        }
                                        return true;
                                    }
                                    if (existingFkTable.get('fkField') === fkField) {
                                        if (!joinValidationMessage) {
                                            joinValidationMessage = ELocalization.relationship.fkHasPkAssociated;
                                        }
                                        return true;
                                    }
                                }
                                /* if (record.get('pkTable') === pkTableId && record.get('pkField')===pkField && record.get('fkTable') === fkTableId && record.get('fkField') === fkField){
                                 if (!joinValidationMessage)
                                 joinValidationMessage = ELocalization.sourceRelationship.relationship.duplicate;
                                 return true
                                 }
                                 var tableAlreadyUsed = joinStore.findRecord('fkField',fkField,false,false,true);
                                 var fkFieldAlreadyUsed = joinStore.findRecord('fkField',fkField,false,false,true);
                                 if (record.get('pkTable') !== pkTableId && fkFieldAlreadyUsed){
                                 if (!joinValidationMessage)
                                 joinValidationMessage = 'The foreign key is already associated with another primary key.';
                                 return true
                                 } */
                            });
                            /* existingRelationship = joinStore.findRecord('fkField',fkField,false,false,true);
                             if (existingRelationship){
                             if (existingRelationship.get('pkField') === pkField){
                             if (existingRelationship.get('pkTable')===pkSource){
                             Ex.Msg.alert(ELocalization.apiName, ELocalization.sourceRelationship.relationship.duplicate);
                             return false;
                             }else{
                             Ex.Msg.alert(ELocalization.apiName,'The foreign key is already associated with another primary key.');
                             return false;
                             }
                             }
                             } */
                            if (existingRelationship.length > 0) {
                                me.showMessage(joinValidationMessage, 'error');
                                // Ex.Msg.alert(ELocalization.apiName,joinValidationMessage);
                                return false;
                            }
                            if (!that.setTreeReference(pkTable, fkTable)) {
                                // Ex.Msg.alert(ELocalization.apiName,ELocalization.sourceRelationship.relationship.circularReference);
                                me.showMessage(ELocalization.relationship.circularReference, 'error');
                                return false;
                            }
                            if (pkRecord.get('type') === fkRecord.get('type')) {
                                // console.log('droppedFieldType')
                                if (pkRecord.get('length') === fkRecord.get('length')) {
                                    // validate order key is correct
                                    if (pkRecord.get('key') === 'primary' && fkRecord.get('key') === 'foreign') {
                                        //    var color = "#157fcc"; // blue
                                        //  //   var color = "#13F207"; // green
                                        //    connection = sqlTable2.connection(sqlTable1.shadowSprite, sqlTable2.shadowSprite, color, aBBPos);
                                        // //    console.log('connectionUUIDs');

                                        //    //sqlTable1.connectionUUIDs.push(connection.uuid);
                                        //    // sqlTable2.connectionUUIDs.push(connection.uuid);
                                        //    ux.relationshipbuilder.connections.push(connection);
                                        //    //update connection list
                                        //    sqlTable1.updateConnectionList();
                                        //    sqlTable2.updateConnectionList();
                                        //    // bgLine is white(invisble) and its stroke-width is 10
                                        //    // so it is easier to capture the dblclick event
                                        //    connection.bgLine.el.on('contextmenu', me.showJoinCM, connection);
                                        //    // line is black and its stroke-width is 1
                                        //    connection.line.el.on('contextmenu', me.showJoinCM, connection);
                                        // create an instance of the join model
                                        //                                        join = Ex.create('Ext.ux.relationshipBuilder.model.SourceRelationshipJoin', {
                                        //                                            id: connection.uuid,
                                        //                                            pkTable: pkTableId,
                                        //                                            fkTable: fkTableId,
                                        //                                            pkTableName: pkTableName,
                                        //                                            fkTableName: fkTableName,
                                        //                                            pkField: dropRecord.get('key') === 'primary' ? dropRecord.get('dataIndex') : targetRecord.get('dataIndex'),
                                        //                                            fkField: dropRecord.get('key') === 'foreign' ? dropRecord.get('dataIndex') : targetRecord.get('dataIndex'),
                                        //                                            pkSourceName: pkTable.data.sourceName,
                                        //                                            fkSourceName: fkTable.data.sourceName,
                                        //                                            pkMenu: (sqlTable1.model.get('id') === pkTableId ) ? sqlTable1.model.get('uuidMenu') : sqlTable2.model.get('uuidMenu'),
                                        //                                            fkMenu: (sqlTable1.model.get('id') === fkTableId) ? sqlTable1.model.get('uuidMenu') : sqlTable2.model.get('uuidMenu')
                                        //                                        });

                                        // console.log(join.data)
                                        var join = join = Ex.create('Ext.ux.relationshipBuilder.model.SourceRelationshipJoin', {
                                            pkTable: pkTableId,
                                            fkTable: fkTableId,
                                            pkTableName: pkRecord.get('targetName'),
                                            fkTableName: fkRecord.get('targetName'),
                                            pkField: pkRecord.get('dataIndex'),
                                            fkField: fkRecord.get('dataIndex'),
                                            pkSourceName: pkTable.data.sourceName,
                                            fkSourceName: fkTable.data.sourceName,
                                            pkMenu: pkRecord.get('uuidMenu'),
                                            fkMenu: fkRecord.get('uuidMenu')
                                        });
                                        // console.log(join2.data)
                                        sqlTable1.createConnection(join, aBBPos, true);
                                        // set join id
                                        // join.set('id', connection.uuid);
                                        // sqlTable1 is the left table
                                        // join.set('leftTableId', sqlTable1.tableId);
                                        // join.set('pkTable',pkTableId);
                                        // join.set('fkTable',fkTableId);
                                        // join.set('pkTableName',pkTableName);
                                        // join.set('fkTableName',fkTableName);
                                        // data.records[0] represents the model of the dragged node
                                        // join.set('leftTableField', droppedFieldDataIndex);
                                        // sqlTable1 is the left table
                                        // join.set('rightTableId', sqlTable2.tableId);
                                        // node.viewIndex is the index of the target node
                                        // join.set('rightTableField', targetFieldDataIndex);
                                        // set the defaul join type to INNER
                                        // join.set('joinType', 'INNER');
                                        // joinCondition = joinCondition + dropTable.get('sourceName') + '.' + join.get('leftTableField') + '=';
                                        // joinCondition = joinCondition + targetTable.get('sourceName') + '.' + join.get('rightTableField');
                                        // join.set('joinCondition', joinCondition);
                                        // join.set('pkField',dropRecord.get('key')==='primary' ? dropRecord.get('dataIndex'):targetRecord.get('dataIndex'));
                                        // join.set('fkField',dropRecord.get('key')==='foreign' ? dropRecord.get('dataIndex'):targetRecord.get('dataIndex'));
                                        // join.set('pkSourceName', pkTable.data.sourceName);
                                        // join.set('fkSourceName',fkTable.data.sourceName);
                                        //    ux.relationshipbuilder.sqlSelect.addJoin(join);
                                    } else {
                                        console.log('callout');
                                        // Ex.widget('callout', {
                                        //    cls: 'default',
                                        //    width: 200,
                                        //    target:sqlTable1,
                                        //    html: "Relationship can only be performed between a primary key and a foreign key",
                                        //    calloutArrowLocation: 'bottom-left',
                                        //    relativePosition: 'bl-tr',
                                        //    relativeOffsets: [-35,0],
                                        //    fadeInDuration: 200,
                                        //    fadeOutDuration: 200,
                                        //    dismissDelay: 5000
                                        // }).show();
                                        me.showMessage('Relationship can only be performed between a primary key and a foreign key', 'error');
                                    }
                                } else {
                                    console.log('callout');
                                    // Ex.widget('callout', {
                                    //    cls: 'default',
                                    //    width: 200,
                                    //    target:sqlTable1,
                                    //    html: "Field Length Mismatch",
                                    //    calloutArrowLocation: 'bottom-left',
                                    //    relativePosition: 'bl-tr',
                                    //    relativeOffsets: [-35,0],
                                    //    fadeInDuration: 200,
                                    //    fadeOutDuration: 200,
                                    //    dismissDelay: 5000
                                    // }).show();
                                    me.showMessage('Field Length Mismatch', 'error');
                                }
                            } else {
                                console.log('callout');
                                // Ex.widget('callout', {
                                //    cls: 'default',
                                //    width: 200,
                                //    target:sqlTable1,
                                //    html: "Field Type Mismatch",
                                //    calloutArrowLocation: 'bottom-left',
                                //    relativePosition: 'bl-tr',
                                //    relativeOffsets: [-35,0],
                                //    fadeInDuration: 200,
                                //    fadeOutDuration: 200,
                                //    dismissDelay: 5000
                                // }).show();
                                me.showMessage('Field Type Mismatch', 'error');
                            }
                        }
                    }
                }
            }
        });
        this.callParent(arguments);
    },
    createJoin: function(connection) {

    },
    // showJoinCM: function (event)
    // {

    //    var cm,
    //        join = this,
    //        Ex = Ext;
    //    // stop the browsers event bubbling
    //    event.stopEvent();
    //    // create context menu
    //    cm = Ex.create('Ext.menu.Menu', {
    //        items: [
    //        //    {
    //        //    text: 'Edit Join',
    //        //    //icon: 'resources/images/document_edit16x16.gif',
    //        //    iconCls: 'mpaUI-pencil3'
    //        //    //handler: Ex.Function.bind(function(){

    //        //    //}, join)
    //        //},
    //        {
    //            text: 'Remove Join',
    //            //icon: 'resources/images/remove.gif',
    //            iconCls: 'mpaUI-close2',
    //            handler: function()
    //               // Ex.Function.bind(function ()
    //            {
    //                Ext.getCmp(join.from.componentName).removeConnection(join, true);
    //             //   me.table.removeConnection(join, true);
    //                // var me = this;
    //                // remove any connection lines from surface and from array ux.relationshipbuilder.connections
    //                //ux.relationshipbuilder.connections = Ex.Array.filter(ux.relationshipbuilder.connections, function(connection){
    //                //    var bRemove = true;
    //                //    if (me.uuid == connection.uuid) {
    //                //        me.line.remove();
    //                //        me.bgLine.remove();
    //                //        me.miniLine1.remove();
    //                //        me.miniLine2.remove();
    //                //        bRemove = false;
    //                //    }
    //                //    return bRemove;
    //                //}, this);

    //                // ux.relationshipbuilder.sqlSelect.removeJoinById(me.uuid);
    //            }
    //            //, join)
    //        }
    //        //, {
    //        //    text: 'Close Menu',
    //        //    // icon: 'resources/images/cross.gif',
    //        //    iconCls: 'mpaUI-close2',
    //        //    handler: Ex.emptyFn
    //        //}
    //        ]
    //    });
    //    // show the contextmenu next to current mouse position
    //    cm.showAt(event.getXY());
    // },

    showMessage: function(msg, type, layout, delay) {
        Ext.Notify.msg(
            msg, {
                layout: layout || 'topleft',
                delay: delay || 5000,
                type: type || 'bottom'
            });
    }
});