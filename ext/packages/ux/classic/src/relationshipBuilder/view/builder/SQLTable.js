/**
 * Created by DELL on 03/10/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.view.builder.SQLTable', {
    extend: 'Ext.window.Window',
    instanceId: null,
    minWidth: 120,
    alias: ['widget.sourcerelationshiptable'],
    requires: [
        'Ext.ux.relationshipBuilder.view.builder.SQLTableGrid',
        'Ext.ux.relationshipBuilder.view.builder.SQLTableSprite'
    ],
    cascadeOnFirstShow: 20,
    // connectionUUIDs: [],
    connectionList: [],
    height: 180,
    pixelDelay: 10,
    name: 'sourceSqlTable',
    width: 140,
    tableId: null,
    border: false,
    //  border: 1,
    bMouseDown: false,
    shadowSprite: null,
    layout: {
        type: 'fit'
    },
    closable: true,
    listeners: {
        // show: function(){
        //    var me=this;

        // },
        'beforeremove': function() {
            console.log('beforeremove');
        },

        'beforeclose': function(me) {
            // var me=this;
            // me.closeSQLTable();
            //      console.log('beforeclose');
            //    eOpts.stopEvent();
            return me.messageBeforeClose(me);
            // else
            // {
            //    me.closeSQLTable();
            // }
        },
        'move': function(win, x, y, eOpts) {
            // force last draw
            win.moveConnection('#157fcc');
            win.bMouseDown = false;
            if (win.record && !win.cascadeOnFirstShow) {
                if (win.context) {
                    // relative position in window referenced container panel.
                    var p = win.getPosition(true);
                    win.record.set('x', p[0]);
                    win.record.set('y', p[0]);
                }
            }
        },
        'close': function(win, eOpts) {
            win.getHeader().el.un('mousedown', win.regStartDrag, win);
            win.getHeader().el.un('mouseup', function() {
                win.bMouseDown = false;
            }, win);
            win.getHeader().el.un('contextmenu', win.showSQLTableCM, win);
            win.body.el.un('contextmenu', function(e) {
                e.stopEvent();
            });
            win.context.remove(win, true);
            // console.log('closewindow');
            // if (win.model)
            //  win.model.set('isIncluded', false);
        },
        'afterrender': function(win, eOpts) {
                win.cascadeOnFirstShow = false;
                win.getHeader().el.on('mousedown', win.regStartDrag, win);
                win.getHeader().el.on('mouseup', function() {
                    win.bMouseDown = false;
                }, win);
                win.getHeader().el.on('contextmenu', win.showSQLTableCM, win);
                win.body.el.on('contextmenu', function(e) {
                    e.stopEvent();
                });
            }
            /*,
            'resize':function(resizer, width, height){
                var me=this;
                me.shadowSprite.setAttributes({
                    width: width - 6,
                    height: height - 6
                }, true);
                // also move the associated connections
                for (var i = ux.relationshipbuilder.connections.length; i--;) {
                    me.connection(ux.relationshipbuilder.connections[i]);
                }
            } */
    },
    messageBeforeClose: function(me) {
        var Ex = Ext;
        if (me.connectionList.length) {
            Ex.Msg.confirm(Ex.localization.apiName, Ex.localization.sourceRelationshipWindow.visualBuilder.existRelation, function(button) {
                if (button === 'yes') {
                    me.closeSQLTable();
                }
            });
            return false;
        } else {
            // no exist relation's and remove to source store.
            ux.relationshipbuilder.sqlSelect.removeSourceByName(me.tableId);
            return true;
        }
    },
    createConnection: function(joinRecord, aBBPos, isNew) {
        console.log(joinRecord);
        if (joinRecord) {
            var uuid = joinRecord.get('id'),
                conn = null;
            if (uuid) {
                conn = ux.relationshipbuilder.connections.filter(function(conn) {
                    if (conn.uuuid == uuid) {
                        return true;
                    }
                });
            }
            if (!conn) {
                var me = this,
                    color = '#157fcc'; // blue
                //   var color = "#13F207"; // green
                var sqlTable1 = me.context.getTableByProperty(joinRecord.get('fkTable')),
                    sqlTable2 = me.context.getTableByProperty(joinRecord.get('pkTable')),
                    connection = sqlTable2.connection(sqlTable1.shadowSprite,
                        sqlTable2.shadowSprite, color, aBBPos),
                    uuid = joinRecord.get('id');
                //    console.log('connectionUUIDs');

                // sqlTable1.connectionUUIDs.push(connection.uuid);
                // sqlTable2.connectionUUIDs.push(connection.uuid);
                ux.relationshipbuilder.connections.push(connection);
                // update connection list
                sqlTable1.updateConnectionList();
                sqlTable2.updateConnectionList();
                // bgLine is white(invisble) and its stroke-width is 10
                // so it is easier to capture the dblclick event
                connection.bgLine.el.on('contextmenu', me.showJoinCM, connection);
                // line is black and its stroke-width is 1
                connection.line.el.on('contextmenu', me.showJoinCM, connection);
                joinRecord.set('id', connection.uuid);
                if (!uuid && isNew) {
                    ux.relationshipbuilder.sqlSelect.addJoin(joinRecord);
                }
            }
        }
    },
    removeConnection: function(conn, update) {
        var me = this;
        // line is black and its stroke-width is 1
        conn.bgLine.el.un('contextmenu', me.showJoinCM, conn);
        conn.line.el.un('contextmenu', me.showJoinCM, conn);
        // remove join reference in objects
        conn.line.remove();
        conn.bgLine.remove();
        conn.miniLine1.remove();
        conn.miniLine2.remove();
        var table1 = Ext.getCmp(conn.from.componentName);
        // table1.connectionUUIDs.remove(conn.uuid);
        var table2 = Ext.getCmp(conn.to.componentName);
        // table2.connectionUUIDs.remove(conn.uuid);
        // delete join in store
        ux.relationshipbuilder.sqlSelect.removeJoinById(conn.uuid);
        // remove connection y array  list
        ux.relationshipbuilder.connections.remove(conn);

        // update Connection
        if (update) {
            if (table1) {
                table1.updateConnectionList();
            }
            if (table2) {
                table2.updateConnectionList();
            }
        }
    },
    closeSQLTable: function(force) {
        var me = this,
            Ex = Ext;
        // remove fields / columns from sqlFieldsStore
        ux.relationshipbuilder.sqlSelect.removeFieldsByTableId(me.tableId);

        // remove table from sqlTables store inside ux.relationshipbuilder.sqlSelect
        ux.relationshipbuilder.sqlSelect.removeSourceByName(me.tableId);

        // unregister mousedown event
        //      me.getHeader().el.un('mousedown', me.regStartDrag, me);
        // unregister mousemove event
        // var contextEl = me.context.getEl().el;
        // var hederEl = me.getHeader().el
        // if (hederEl)
        // {
        //    hederEl.un('mousedown', me.regStartDrag, me);
        //    hederEl.un('mouseup', function () { me.bMouseDown = false; }, me);
        //    //hederEl.un('contextmenu', me.showSQLTableCM, me);
        // }
        Ex.EventManager.un(document, 'mousemove', me.moveWindow, me);
        //  Ex.EventManager.un(contextEl, 'mousemove', me.moveWindow, me);
        // remove sprite from surface
        // Ex.getCmp('SourceRelationshipTablePanel').down('draw').surface.remove(me.shadowSprite, false);

        // remove any connection lines from surface and from array ux.relationshipbuilder.connections
        // ux.relationshipbuilder.connections = Ex.Array.filter(ux.relationshipbuilder.connections, function(connection){
        // var bRemove = true;
        // for (var j = 0, l = me.connectionUUIDs.length; j < l; j++) {
        me.updateConnectionList();
        for (var j = 0, l = me.connectionList.length; j < l; j++) {
            // ux.relationshipbuilder.sqlSelect.removeJoinById(connection.uuid);
            // bRemove = false;
            me.removeConnection(me.connectionList[j], true);
        }

        // return bRemove;
        // }, me);
        // me.context.down('draw').surface.remove(me.shadowSprite, false);
        if (me.shadowSprite) {
            me.shadowSprite.destroy();
        }
        me.close();
    },
    initSQLTable: function() {
        var me = this,
            Ex = Ext,
            sqlTablePanel, xyParentPos, xyChildPos, childSize, sprite;
        if (!me.shadowSprite) {
            // get the main sqlTablePanel
            console.log('initSqlTable');
            //  sqlTablePanel = Ex.getCmp('SourceRelationshipTablePanel');
            sqlTablePanel = me.context;

            // get the main sqlTablePanel position
            xyParentPos = sqlTablePanel.el.getXY();

            // get position of the previously added sqltable
            xyChildPos = me.el.getXY();

            // get the size of the previously added sqltable
            childSize = me.el.getSize();

            // var tablePropertyRecord = ux.relationshipbuilder.sqlSelect.tables.findRecord('id',me.tableId,false,false,true);
            var tablePropertyRecord = me.record || ux.relationshipbuilder.sqlSelect.getTableById(me.tableId);
            if (tablePropertyRecord) {
                me.x = tablePropertyRecord.get('x');
                me.y = tablePropertyRecord.get('y');
                //  tablePropertyRecord.set('y',me.y);
                tablePropertyRecord.set('boxHeight', childSize.height);
                tablePropertyRecord.set('boxWidth', childSize.width);
                if (!me.record) {
                    me.record = tablePropertyRecord;
                }
            }

            // create a sprite of type rectangle and set its position and size
            // to position and size of the the sqltable
            sprite = Ex.widget('sourcerelationshiptablesprite', {
                table: me,
                componentName: me.id,
                type: 'rect',
                //     stroke: "transparent !important",
                stroke: '#fff',
                height: childSize.height - 4,
                width: childSize.width - 4,
                x: xyChildPos[0] - xyParentPos[0] + 2,
                y: xyChildPos[1] - xyParentPos[1] + 2,
                scrollTop: 0,
                style: {
                    borderColor: '#ff0000',
                    borderStyle: 'solid'
                }
            });
            // add the sprite to the surface of the sqlTablePanel

            // me.shadowSprite = sqlTablePanel.down('draw').surface.add(sprite).show(true);
            me.shadowSprite = sqlTablePanel.getDrawComponent().surface.add(sprite).show(true);
            // handle resizeing of sqltabel
            // me.resizer.on('resize', function(resizer, width, height){
            me.on('resize', function(resizer, width, height) {
                console.log('resize');
                me.shadowSprite.setAttributes({
                    width: width - 6,
                    height: height - 6
                }, true);
                // also move the associated connections
                // for (var i = ux.relationshipbuilder.connections.length; i--;) {
                for (var i = me.connectionList.length; i--;) {
                    me.connection(me.connectionList[i]);
                }
            }, this);
            // register a function for the mousedown event on the previously added sqltable and bind to this scope
            //  me.getHeader().el.on('mousedown', me.regStartDrag, me);

            // me.getHeader().el.on('dblclick', me.showTableAliasEditForm, me);
            me.getHeader().origValue = '';
            var contextEl = me.context.getEl().el;
            // register method this.moveWindow for the mousemove event on the document and bind to this scope
            Ex.EventManager.on(document, 'mousemove', me.moveWindow, me);
            //      Ex.EventManager.on(contextEl, 'mousemove', me.moveWindow, me);
            // register a function for the mouseup event on the document and add the this scope
            // Ex.EventManager.on(document, 'mouseup', function ()
            // Ex.EventManager.on(contextEl, 'mouseup', function ()
            // {
            //    // save the mousedown state
            //    me.bMouseDown = false;
            // }, me);
        }
    },
    showSQLTableCM: function(event) {
        var me = this,
            Ex = Ext,
            cm;
        // stop the browsers event bubbling
        event.stopEvent();
        // create context menu
        cm = Ex.create('Ext.menu.Menu', {
            items: [
                    /* {
                                    text: 'Add/Edit Alias',
                                    icon: 'resources/images/document_edit16x16.gif',
                                    handler: Ex.Function.bind(function(){
                                        me.showTableAliasEditForm();
                                    }, me)
                                }, */
                    {
                        text: 'Remove Table',
                        // icon: 'resources/images/delete.gif',
                        iconCls: 'mpaUI-close2',
                        handler: Ex.Function.bind(function() {
                            // remove the sqltable
                            me.closeSQLTable();
                        }, me)
                    }
                ]
                // }, {
                //    text: 'Close Menu',
                //    icon: 'resources/images/cross.gif',
                //    handler: Ex.emptyFn
                // }]
        });
        // show the contextmenu next to current mouse position
        cm.showAt(event.getXY());
    },
    initConnection: function() {
        var me = this;
        me.updateConnectionList();
        me.regStartDrag();
        me.moveConnection();
    },
    updateConnectionList: function() {
        var me = this;
        me.connectionList = ux.relationshipbuilder.connections.filter(function(conn) {
            if (conn.from.componentName == me.id || conn.to.componentName == me.id) {
                return true;
            }
        });
        if (!me.connectionList.length) {
            me.shadowSprite.destroy();
        }
    },
    regStartDrag: function(event, target, eOpts) {
        var me = this;
        // update list jo

        if (me.connectionList.length) {
            // save the mousedown state
            me.bMouseDown = true;
            if (event) // is null invoque scroll
            {
                me.oldX = event.getX();
                me.oldY = event.getY();
                //   me.updateConnectionList()
            }
            // start the drag of the sprite
        }
        if (me.shadowSprite) {
            me.shadowSprite.startDrag(me.getId());
        }
    },
    getSpace: function(x, y) {
        // MYAX: calculates the distance between a start point to an end point
        // It is calculated by the method of Pythagoras
        // c^2 = a^2 + b^2 ==>  c^2 = (X - Xo)^2 + (Y - Yo)^2
        // space = sqrt(c^2)
        //
        var me = this;
        var deltaX = Math.pow((x - me.oldX), 2);
        var deltaY = Math.pow((y - me.oldY), 2);
        var sumXY = deltaX + deltaY;
        var space = Math.sqrt(sumXY);
        if (me.pixelDelay <= space) {
            me.oldX = x;
            me.oldY = y;
            return true;
        } else {
            return false;
        }
    },
    moveConnection: function(color) {
        color = color || '#13F207';
        var me = this;
        if (me.connectionList.length) {
            console.log('redrawin ' + me.connectionList.length + 'connection(s)');
            me.updateSprite();
            // also move the associated connections
            // for (var i = ux.relationshipbuilder.connections.length; i--;)
            for (var i = me.connectionList.length; i--;) {
                me.connection(me.connectionList[i], null, color);
            }
        }
    },
    moveWindow: function(event, taget, eOpts) {
        //   console.log(event)
        var me = this;
        // check mousedown
        if (me.bMouseDown) {
            // get relative x and y values (offset)
            // check if the sprite has any connections
            if (me.getSpace(event.getX(), event.getY())) {
                // move connection  asociated.
                me.moveConnection('#13F207');
            }
        }
    },
    updateSprite: function() {
        var me = this;
        if (me.shadowSprite) {
            // move the sprite to the position of the window
            var relPosMovement = me.getOffset('point');
            if (relPosMovement) {
                me.shadowSprite.onDrag(relPosMovement);
            }
        } else {
            me.initSQLTable();
        }
    },
    getLeftRightCoordinates: function(obj1, obj2, aBBPos) {
        if (aBBPos) {
            var bb1, bb2, p = [],
                dx, dy, leftBoxConnectionPoint, rightBoxConnectionPoint, columnHeight = 25,
                headerHeight = 50;
            // BoundingBox Koordinaten fÃ¼r beide Sprites abrufen
            bb1 = obj1.getBBox();
            // y Wert fÃ¼r connection Points auf der linken und rechten Seite von bb1
            bb1.pY = bb1.y + headerHeight + ((aBBPos[0] - 1) * columnHeight) + (columnHeight / 2) - obj1.scrollTop;
            bb2 = obj2.getBBox();
            // y Wert fÃ¼r connection Points auf der linken und rechten Seite von bb2
            bb2.pY = bb2.y + headerHeight + ((aBBPos[1] - 1) * columnHeight) + (columnHeight / 2) - obj2.scrollTop;
            // code fÃ¼r linke boundingBox
            if (bb1.pY > (bb1.y + 4) && bb1.pY < (bb1.y + bb1.height - 4)) {
                p.push({
                    x: bb1.x - 1, // Punkt auf linker Seite auf HÃ¶he der verknÃ¼pften Spalte
                    y: bb1.pY
                });
                p.push({
                    x: bb1.x + bb1.width + 1, // Punkt auf rechter Seite auf HÃ¶he der verknÃ¼pften Spalte
                    y: bb1.pY
                });
            } else {
                if (bb1.pY < (bb1.y + 4)) {
                    p.push({
                        x: bb1.x - 1, // Punkt auf linker Seite max. obere Position
                        y: bb1.y + 4
                    });
                    p.push({
                        x: bb1.x + bb1.width + 1, // Punkt auf rechter Seite max. obere Position
                        y: bb1.y + 4
                    });
                } else {
                    p.push({
                        x: bb1.x - 1, // Punkt auf linker Seite max. untere Position
                        y: bb1.y + bb1.height - 4
                    });
                    p.push({
                        x: bb1.x + bb1.width + 1, // Punkt auf rechter Seite max. untere Position
                        y: bb1.y + bb1.height - 4
                    });
                }
            }
            //  code fÃ¼r rechte boundingBox
            if (bb2.pY > (bb2.y + 4) && bb2.pY < (bb2.y + bb2.height - 4)) {
                p.push({
                    x: bb2.x - 1, // Punkt auf linker Seite auf HÃ¶he der verknÃ¼pften Spalte
                    y: bb2.pY
                });
                p.push({
                    x: bb2.x + bb2.width + 1, // Punkt auf rechter Seite auf HÃ¶he der verknÃ¼pften Spalte
                    y: bb2.pY
                });
            } else {
                if (bb2.pY < (bb2.y + 4)) {
                    p.push({
                        x: bb2.x - 1, // Punkt auf linker Seite max. obere Position
                        y: bb2.y + 4
                    });
                    p.push({
                        x: bb2.x + bb2.width + 1, // Punkt auf rechter Seite max. obere Position
                        y: bb2.y + 4
                    });
                } else {
                    p.push({
                        x: bb2.x - 1, // Punkt auf linker Seite max. untere Position
                        y: bb2.y + bb2.height - 4
                    });

                    p.push({
                        x: bb2.x + bb2.width + 1, // Punkt auf rechter Seite max. untere Position
                        y: bb2.y + bb2.height - 4
                    });
                }
            }
            // Schleife Ã¼ber die Punkte der ersten BoundingBox
            for (var i = 0; i < 2; i++) {
                // Schleife Ã¼ber die Punkte der zweiten BoundingBox
                for (var j = 2; j < 4; j++) {
                    // Berechnung der Offsets zwischen den jeweils vier Punkten beider BoundingBoxes
                    dx = Math.abs(p[i].x - p[j].x);
                    dy = Math.abs(p[i].y - p[j].y);
                    // bb1 links mit bb2 rechts
                    if (((i == 0 && j == 3) && dx < Math.abs(p[1].x - p[2].x)) || ((i == 1 && j == 2) && dx < Math.abs(p[0].x - p[3].x))) {
                        leftBoxConnectionPoint = p[i];
                        rightBoxConnectionPoint = p[j];
                    }
                }
            }
            return {
                leftBoxConnectionPoint: leftBoxConnectionPoint,
                rightBoxConnectionPoint: rightBoxConnectionPoint
            };
        }
    },
    connection: function(obj1, obj2, line, aBBPos, uuid) {
        //   line = line || '#' + Math.floor(Math.random() * 16777215).toString(16);
        var me = this,
            LeftRightCoordinates,
            line1,
            line2,
            miniLine1,
            miniLine2,
            path,
            surface,
            color = typeof line === 'string' ? line : '#157fcc';
        if (obj1.line && obj1.from && obj1.to && obj1.aBBPos) {
            line = obj1;
            obj1 = line.from;
            obj2 = line.to;
            aBBPos = line.aBBPos;
        }
        // set reference to the wright surface
        surface = obj1.surface;
        obj1.stroke = color;
        obj1.stroke = color;
        // get coordinates for the left and right box
        LeftRightCoordinates = me.getLeftRightCoordinates(obj1, obj2, aBBPos);

        // check if the LeftBox is still on the left side or not
        if (LeftRightCoordinates.leftBoxConnectionPoint) {
            if (LeftRightCoordinates.leftBoxConnectionPoint.x - LeftRightCoordinates.rightBoxConnectionPoint.x < 0) {
                line1 = 12;
                line2 = 12;
            } else {
                line1 = -12;
                line2 = -12;
            }
            // define the path between the left and the right box
            path = ['M', LeftRightCoordinates.leftBoxConnectionPoint.x, LeftRightCoordinates.leftBoxConnectionPoint.y, 'H', LeftRightCoordinates.leftBoxConnectionPoint.x + line1, 'L', LeftRightCoordinates.rightBoxConnectionPoint.x - line2, LeftRightCoordinates.rightBoxConnectionPoint.y, 'H', LeftRightCoordinates.rightBoxConnectionPoint.x].join(',');
            miniLine1 = ['M', LeftRightCoordinates.leftBoxConnectionPoint.x, LeftRightCoordinates.leftBoxConnectionPoint.y, 'H', LeftRightCoordinates.leftBoxConnectionPoint.x + line1].join(',');
            miniLine2 = ['M', LeftRightCoordinates.rightBoxConnectionPoint.x - line2, LeftRightCoordinates.rightBoxConnectionPoint.y, 'H', LeftRightCoordinates.rightBoxConnectionPoint.x].join(',');
            // check if it is a new connection or not
            if (line && line.line) {
                // old connection, only change path
                line.bgLine &&
                    line.bgLine.setAttributes({
                        path: path,
                        stroke: color
                    }, true);
                line.line.setAttributes({
                    path: path,
                    stroke: color
                }, true);
                line.miniLine1.setAttributes({
                    path: miniLine1,
                    stroke: color
                }, true);
                line.miniLine2.setAttributes({
                    path: miniLine2,
                    stroke: color
                }, true);
            } else {
                // new connction, return new connection object
                var Ex = Ext;
                return {
                    line: Ex.create('Ext.draw.Sprite', {
                        type: 'path',
                        path: path,
                        stroke: color,
                        fill: 'none',
                        'stroke-width': 1,
                        surface: surface
                    }).show(true),
                    miniLine1: Ex.create('Ext.draw.Sprite', {
                        type: 'path',
                        path: miniLine1,
                        stroke: color,
                        fill: 'none',
                        'stroke-width': 2,
                        surface: surface
                    }).show(true),
                    miniLine2: Ex.create('Ext.draw.Sprite', {
                        type: 'path',
                        path: miniLine2,
                        stroke: color,
                        fill: 'none',
                        'stroke-width': 2,
                        surface: surface
                    }).show(true),
                    bgLine: Ex.create('Ext.draw.Sprite', {
                        type: 'path',
                        path: path,
                        opacity: 0,
                        stroke: '#fff',
                        fill: 'none',
                        'stroke-width': 10,
                        surface: surface
                    }).show(true),
                    from: obj1,
                    to: obj2,
                    aBBPos: aBBPos,
                    uuid: uuid ? uuid : Ex.guid()
                };
            }
        }
    },
    getSourceFields: function() {
        var me = this,
            Ex = Ext,
            sourceStore = Ex.getCurrentContext(me.instanceId).SourceStore,
            fields = [],
            allFields,
            idTable = me.model.get('id'),
            targetName = me.model.get('targetName'),
            uuidMenu = me.model.get('uuidMenu'),
            source;
        // source = sourceStore.query('name', me.model.get('sourceName'), false, false, true);
        source = sourceStore.query('id', idTable, false, false, true);
        if (source.items.length) {
            allFields = Ex.JSON.decode(source.items[0].data.params.columns);

            Ex.Array.each(allFields, function(field) {
                if (field['key'] === 'primary' || field['key'] === 'foreign') {
                    Ex.Array.push(fields, {
                        'dataIndex': field['dataIndex'],
                        'label': field['label'],
                        'type': field['type'],
                        'length': field['length'],
                        'isVisible': field['isVisible'],
                        'key': field['key'],
                        'tableId': idTable,
                        'targetName': targetName,
                        'uuidMenu': uuidMenu
                    });
                }
            });
        }

        // for (var i = 0; i < 36; i++)
        // {
        //    // uuidSecurity
        //    Ex.Array.push(fields, {
        //        "dataIndex": "key" + i,
        //        "label": "key" + i,
        //        "type": 0,
        //        "length": 36,
        //        "isVisible": "",
        //        "key": (i % 2) ?  "primary" : "foreign"
        //    });
        // }
        return fields;
    },
    initComponent: function() {
        var fieldStore, tableModel, me = this,
            Ex = Ext;
        me.bMouseDown = false;
        // assign a uuid to the window, this builds relationship with sqlTable
        //     me.tableId = me.model.get('id') ? me.model.get('id') : Ex.guid();
        // sets panel title
        me.title = me.model.get('sourceName');
        // var proxyClone = Ex.ConnectionStore.cloneConnectionFromRecord(Ext.ConnectionStore.data.items[1]);
        fieldStore = Ex.create('Ext.data.Store', {
            fields: ['dataIndex',
                'label',
                'type',
                'length',
                'isVisible',
                'key',
                'tableId',
                'targetName',
                'uuidMenu'
            ],
            proxy: {
                type: 'memory',
                reader: 'json'
            },
            //   storeId:'tableGridFieldStore',
            autoLoad: false
        });
        fieldStore.loadData(me.getSourceFields());
        // add sql table to ux.relationshipbuilder.sqlSelect tables store
        // also asign same id as stores uuid
        var groups = ux.relationshipbuilder.sqlSelect.tables.getGroups(),
            treeCorrelative = 2;
        if (groups.length) {
            var maxId = groups[0].name; // initialise to the first record's id value.
            Ex.Array.each(groups, function(rec) // go through all the records
                {
                    maxId = Math.max(maxId, rec.name);
                });
            treeCorrelative = maxId + 1;
        }

        var tablePropertyRecord = ux.relationshipbuilder.sqlSelect.getTableById(me.tableId);
        if (!tablePropertyRecord) {
            tableModel = Ex.create('Ext.ux.relationshipBuilder.model.SourceRelationshipTable', {
                id: me.tableId,
                sourceName: me.model.get('sourceName'),
                targetName: me.model.get('targetName'),
                tree: !groups.length ? 1 : treeCorrelative,
                order: 1,
                x: 0,
                y: 0,
                boxHeight: 0,
                boxWidth: 0
            });

            var recordList = ux.relationshipbuilder.sqlSelect.addTable(tableModel);
            me.record = recordList[0];
        } else {
            me.record = tablePropertyRecord;
        }

        var gridField = Ex.widget('sourcerelationshiptablegrid', {
            // xtype: 'sourcerelationshiptablegrid',
            store: fieldStore,
            table: me
        });
        me.items = [gridField];
        me.getGridField = function() {
            return gridField;
        };
        me.getFieldStore = function() {
            return fieldStore;
        };
        me.getFieldByProperty = function(dataIndex, value) {
            if (dataIndex && value) {
                return fieldStore.findRecord(dataIndex, value, false, false, true);
            } else {
                return null;
            }
        };
        me.callParent(arguments);
    },
    getOffset: function(constrain) {
        try {
            console.log('getOffset');
            var me = this,
                xy = me.dd.getXY(constrain),
                s = me.dd.startXY;
            // return the the difference between the current and the drag&drop start position
            return [xy[0] - s[0], xy[1] - s[1]];
        } catch (ex) {
            // console.err(ex);
            return null;
        }
    },
    // createUUID: function(){
    //    // http://www.ietf.org/rfc/rfc4122.txt
    //    var s = [];
    //    var hexDigits = "0123456789abcdef";
    //    for (var i = 0; i < 36; i++) {
    //        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    //    }
    //    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    //    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    //    s[8] = s[13] = s[18] = s[23] = "-";
    //    return s.join("");
    // },
    beforeShow: function() {
        var me = this,
            Ex = Ext,
            aWin, prev, o;
        // cascading window positions
        if (!me.cascadeOnFirstShow) {
            if (!me.x && !me.y) {
                if (me.record) {
                    console.log(me.record);
                    var x = me.record.get('x'),
                        y = me.record.get('y');
                    if (!x && !y) {
                        // o = (typeof me.cascadeOnFirstShow == 'number') ? me.cascadeOnFirstShow : 20;
                        o = 20;
                        // get all instances from xtype sqltable
                        aWin = Ex.ComponentQuery.query('sourcerelationshiptable');
                        // start position if there is only one table
                        if (aWin.length == 1) {
                            me.x = o;
                            me.y = o;
                        } else {
                            // loop through all instances from xtype sqltable
                            for (var i = 0, l = aWin.length; i < l; i++) {
                                if (aWin[i] == me) {
                                    if (prev) {
                                        me.x = prev.x + o;
                                        me.y = prev.y + o;
                                    }
                                }
                                if (aWin[i].isVisible()) {
                                    prev = aWin[i];
                                }
                            }
                        }
                    } else {
                        me.x = x;
                        me.y = y;
                    }
                    me.setPosition(me.x, me.y);
                }
            }
        }
    },
    showJoinCM: function(event) {
        var cm,
            join = this,
            Ex = Ext;
        // stop the browsers event bubbling
        event.stopEvent();
        // create context menu
        cm = Ex.create('Ext.menu.Menu', {
            items: [
                //    {
                //    text: 'Edit Join',
                //    //icon: 'resources/images/document_edit16x16.gif',
                //    iconCls: 'mpaUI-pencil3'
                //    //handler: Ex.Function.bind(function(){

                //    //}, join)
                // },
                {
                    text: 'Remove Join',
                    // icon: 'resources/images/remove.gif',
                    iconCls: 'mpaUI-close2',
                    handler: function()
                        // Ex.Function.bind(function ()
                        {
                            Ext.getCmp(join.from.componentName).removeConnection(join, true);
                            //   me.table.removeConnection(join, true);
                            // var me = this;
                            // remove any connection lines from surface and from array ux.relationshipbuilder.connections
                            // ux.relationshipbuilder.connections = Ex.Array.filter(ux.relationshipbuilder.connections, function(connection){
                            //    var bRemove = true;
                            //    if (me.uuid == connection.uuid) {
                            //        me.line.remove();
                            //        me.bgLine.remove();
                            //        me.miniLine1.remove();
                            //        me.miniLine2.remove();
                            //        bRemove = false;
                            //    }
                            //    return bRemove;
                            // }, this);

                            // ux.relationshipbuilder.sqlSelect.removeJoinById(me.uuid);
                        }
                        //, join)
                }
                //, {
                //    text: 'Close Menu',
                //    // icon: 'resources/images/cross.gif',
                //    iconCls: 'mpaUI-close2',
                //    handler: Ex.emptyFn
                // }
            ]
        });
        // show the contextmenu next to current mouse position
        cm.showAt(event.getXY());
    }
});