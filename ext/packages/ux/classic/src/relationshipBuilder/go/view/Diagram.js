/**
 * Created with IntelliJ IDEA.
 * User: MYAX
 * Date: 11/11/15
 * Time: 07:12 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.relationshipBuilder.go.view.Diagram', {
    extend: 'Ext.container.Container',
    requires: [
        'Ext.ux.util.Compatibility'
    ],
    xtype: 'diagrammaker',
    layout: 'fit',
    overview: true,
    configData: null,
    rawDiagram: null,
    rawSources: null,
    identificator: 'key', // default
    isContentRendered: false,
    extraProperties: false,
    zoomWeel: true,
    nodeData: [],
    linkData: [],
    uniqueSourceConstraint: true,
    solveForest: true, // solve order and tree
    _exist: false,
    initComponent: function() {
        var me = this,
            Ex = Ext,
            diagramId = 'diagram-' + Ex.guid(),
            overviewId = 'overview-' + Ex.guid(),
            goMaker = (go) ? go.GraphObject.make : null,
            ExArray = Ex.Array,
            rawhtml = '',
            myOverview = null,
            myDiagram = null,
            // private object to convert
            convert = {};
        // validate go Js exist.
        if (go) {
            // if exist go js define method's to convert equivalent graps to draw and drop
            Ex.apply(convert, {
                keyFrom: function(value) {
                    switch (value) {
                        case 'primary':
                            return true;
                        case 'foreign':
                            return false;
                        default:
                            return false;
                    }
                },
                keyTo: function(value) {
                    switch (value) {
                        case 'primary':
                            return false;
                        case 'foreign':
                            return true;
                        default:
                            return false;
                    }
                },
                keyFig: function(value) {
                    switch (value) {
                        case 'primary':
                            return 'TenPointedStar';
                        case 'foreign':
                            return 'TenPointedStar';
                        default:
                            return 'TenPointedStar';
                    }
                    return 'TenPointedStar';
                },
                keyColor: function(value) {
                    //    console.log(value);
                    switch (value) {
                        case 'primary':
                            return 'Red';
                        case 'foreign':
                            return 'Blue';
                        default:
                            return 'Transparent';
                    }
                    return 'Transparent';
                },
                visibility: function(value) {
                    switch (value) {
                        case 'public':
                            return '+';
                        case 'private':
                            return '-';
                        case 'protected':
                            return '#';
                        case 'package':
                            return '~';
                        default:
                            return value;
                    }
                },
                keyType: function(value) {
                    switch (value) {
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
                        case 15:
                            return 'Boolean';
                        default:
                            return value;
                    }
                }
            });
            if (me.overview) {
                rawhtml = '<div id="' + overviewId + '" style="z-index:300; height: 100px; width:200px; position: absolute; top:10px; right: 10px; background-color: rgba(0,0,0,0.7);"></div>';
            }
            rawhtml += '<div id="' + diagramId + '" style="height: 100%; width:100%"></div>';
        } else {
            rawhtml = 'Required GoJS to draw this feature.';
        }
        // add html configuration to container
        Ex.applyIf(me, {
            html: rawhtml,
            // add dynamic method to Ext container
            getDiagram: function() {
                return myDiagram;
            },
            getDiagramConfig: function() {
                // set tree and order
                if (me.solveForest) {
                    me.setTreeStructure();
                }
                return myDiagram.model.toJson();
                // return null;
            },
            getOverview: function() {
                return myOverview;
            },
            getSerializedData: function() {
                if (me.solveForest) {
                    me.setTreeStructure();
                }

                var rawGoModel = [],
                    rawTables = [],
                    rawJoins = [],
                    rawSources = [],
                    tempConfig = [];
                if (myDiagram) {
                    var _config = myDiagram.model.toJson();
                    if (_config) {
                        var config = Ex.JSON.decode(_config);
                        if (config.nodeDataArray) {
                            ExArray.each(config.nodeDataArray, function(source) {
                                ExArray.push(rawTables, {
                                    id: source.key,
                                    sourceName: source.name,
                                    targetName: source.targetName,
                                    // uuidMenu: Ex.guid(),
                                    // properties: source.properties, /**/
                                    description: source.description,
                                    order: source.order,
                                    tree: source.tree,
                                    boxHeight: 0,
                                    boxWidth: 0,
                                    location: source.loc
                                });
                            });
                        }
                        if (config.linkDataArray) {
                            var pkSource = null,
                                fkSource = null;
                            ExArray.each(config.linkDataArray, function(source) {
                                pkSource = me.getRawSourceById(source.from);
                                fkSource = me.getRawSourceById(source.to);
                                if (pkSource.length && fkSource.length) {
                                    ExArray.push(rawJoins, {
                                        pkTable: pkSource[0].key,
                                        fkTable: fkSource[0].key,
                                        pkTableName: pkSource[0].targetName,
                                        fkTableName: fkSource[0].targetName,
                                        pkField: source.fromPort,
                                        fkField: source.toPort,
                                        pkMenu: pkSource[0].uuidMenu,
                                        fkMenu: fkSource[0].uuidMenu
                                    });
                                }
                                pkSource = fkSource = null;
                            });
                        }
                    }
                }
                var data = {
                    rawTables: rawTables,
                    rawJoins: rawJoins
                };
                return data;
            },
            getRawSourceById: function(id) {
                if (id && me.rawSources) {
                    return me.rawSources.filter(function(item) {
                        return (item.key === id);
                    }) || [];
                }
                return [];
            },
            getFieldBySourceIdAndFieldName: function(sourceId, nameField) {
                var source = me.getRawSourceById(sourceId);
                if (source.length) {
                    return source[0].properties.filter(function(item) {
                        return (item.name === nameField);
                    }) || [];
                }
                return [];
            },

            setSerializedData: function(rawGOModel) {
                if (myDiagram) {
                    // evaluate implementing to load diagram
                    myDiagram.model.nodeDataArray = rawGOModel;
                }
            },
            setModel: function(model) {
                if (model) {
                    myDiagram.model = goMaker(go.GraphLinksModel, model);
                }
            },
            isValidRelationship: function(join, silent) {
                silent = silent || false;
                if (join) {
                    if (join.to && join.from) {
                        var pkField = me.getFieldBySourceIdAndFieldName(join.from, join.fromPort),
                            fkField = me.getFieldBySourceIdAndFieldName(join.to, join.toPort);
                        if (pkField.length && fkField.length) {
                            if (pkField[0].length === fkField[0].length) {
                                if (pkField[0].type === fkField[0].type) {
                                    return true;
                                } else {
                                    if (!silent) {
                                        me.showMessage('type not match', 'error');
                                    }
                                }
                            } else {
                                if (!silent) {
                                    me.showMessage('length not match', 'error');
                                }
                            }
                        }
                    }
                }
                return false;
            },
            isValidSourceDrop: function(modelEntity, silent) {
                silent = silent || false;
                if (modelEntity) {
                    var dataKey = modelEntity[me.identificator].substring(0, 36);
                    var _count = 0;
                    ExArray.each(myDiagram.model.nodeDataArray, function(i) {
                        if (i[me.identificator].indexOf(dataKey) > -1) {
                            _count += 1;
                        }
                    });
                    if (_count > 1) {
                        if (!silent) {
                            me.showMessage('this source allready included in the diagram.', 'error');
                        }
                        return false;
                    } else {
                        return true;
                    }
                }
                return false;
            },
            setTreeStructure: function() {
                var tableList = myDiagram.model.nodeDataArray,
                    joinList = myDiagram.model.linkDataArray,
                    pkJoinList = [],
                    fpkJoinList = [],
                    tree = 1,
                    firstNodeList = [];

                ExArray.each(tableList, function(table) {
                    table.order = 0;
                    table.tree = 0;
                    if (table) {
                        pkJoinList = joinList.filter(function(link) {
                            return (link.to == table.key);
                        });
                        fkJoinList = joinList.filter(function(link) {
                            return (link.from == table.key);
                        });
                        // remove entity
                        if (!pkJoinList.length && !fkJoinList.length) {
                            myDiagram.remove(myDiagram.findNodeForKey(table.key));
                        }
                        // first node without foreign key references
                        if (!pkJoinList.length && fkJoinList.length) {
                            // set root node "0" and tree asigned
                            table.tree = tree++;
                            ExArray.push(firstNodeList, table.key);
                        }
                    }
                });

                if (firstNodeList.length) {
                    ExArray.each(firstNodeList, function(key) {
                        fkJoinList = joinList.filter(function(link) {
                            return (link.from == key);
                        });
                        if (fkJoinList.length) {
                            ExArray.each(fkJoinList, function(join) {
                                me.updateOrderAndTree(join);
                            });
                        }
                    });
                }
            },
            setLinkDataArray: function(linkList) {
                myDiagram.linkDataArray = linkList;
            },
            updateOrderAndTree: function(join) {
                if (join) {
                    var pkNode = myDiagram.findNodeForKey(join.from),
                        fkNode = myDiagram.findNodeForKey(join.to),
                        pkOrder = 0,
                        fkOrder = 0,
                        pkTree = 0,
                        fkTree = 0;

                    if (pkNode, fkNode) {
                        pkOrder = pkNode.data.order;
                        pkTree = pkNode.data.tree;
                        fkOrder = fkNode.data.order;
                        pkTree = pkNode.data.tree;

                        if (fkOrder == 0 || fkOrder < pkOrder || fkOrder == pkOrder) {
                            fkNode.data.order = pkOrder + 1;
                        }
                        if (fkTree <= pkTree) {
                            fkNode.data.tree = pkTree;
                        }

                        var joinList = ExArray.filter(myDiagram.model.linkDataArray, function(j) {
                            return j.from == fkNode.data.key;
                        });
                        if (joinList.length) {
                            ExArray.each(joinList, function(join) {
                                // recursive
                                me.updateOrderAndTree(join);
                            });
                        }
                    }
                }
            },
            isRendered: function() {
                return me.isContentRendered;
            },
            showMessage: function(msg, type, layout, delay) {
                Ex.Notify.msg(
                    msg, {
                        layout: layout || 'bottom',
                        delay: delay || 5000,
                        type: type || 'success'
                    });
            }
        });

        me.callParent(arguments);

        // apply component extencions Go js
        if (go) {
            function nodeInfo(d) { // Tooltip info for a node data object
                var str = 'Node ' + d.key + ': ' + d.text + '\n';
                if (d.group) {
                    str += 'member of ' + d.group;
                } else {
                    str += 'top-level node';
                }
                return str;
            }

            me.on('afterrender', function() {
                var nodeSelectionAdornmentTemplate = goMaker(go.Adornment, 'Auto',
                    goMaker(go.Shape, {
                        fill: null,
                        stroke: 'deepskyblue',
                        strokeWidth: 1.5,
                        strokeDashArray: [4, 2]
                    }),
                    goMaker(go.Placeholder)
                );
                var nodeResizeAdornmentTemplate = goMaker(go.Adornment, 'Spot', {
                        locationSpot: go.Spot.Right
                    },
                    goMaker(go.Placeholder),
                    /* goMaker(go.Shape, {
                        alignment: go.Spot.TopLeft,
                        cursor: "nw-resize",
                        desiredSize: new go.Size(6, 6),
                        fill: "lightblue",
                        stroke: "deepskyblue"
                    }),
                    goMaker(go.Shape, {
                        alignment: go.Spot.Top,
                        cursor: "n-resize",
                        desiredSize: new go.Size(6, 6),
                        fill: "lightblue",
                        stroke: "deepskyblue"
                    }),
                    goMaker(go.Shape, {
                        alignment: go.Spot.TopRight,
                        cursor: "ne-resize",
                        desiredSize: new go.Size(6, 6),
                        fill: "lightblue",
                        stroke: "deepskyblue"
                    }),
                    */
                    goMaker(go.Shape, {
                        alignment: go.Spot.Left,
                        cursor: 'w-resize',
                        desiredSize: new go.Size(6, 6),
                        fill: 'lightblue',
                        stroke: 'deepskyblue'
                    }),
                    goMaker(go.Shape, {
                        alignment: go.Spot.Right,
                        cursor: 'e-resize',
                        desiredSize: new go.Size(6, 6),
                        fill: 'lightblue',
                        stroke: 'deepskyblue'
                    })
                    /*,

                                            goMaker(go.Shape, {
                                                alignment: go.Spot.BottomLeft,
                                                cursor: "se-resize",
                                                desiredSize: new go.Size(6, 6),
                                                fill: "lightblue",
                                                stroke: "deepskyblue"
                                            }),
                                            goMaker(go.Shape, {
                                                alignment: go.Spot.Bottom,
                                                cursor: "s-resize",
                                                desiredSize: new go.Size(6, 6),
                                                fill: "lightblue",
                                                stroke: "deepskyblue"
                                            }),
                                            goMaker(go.Shape, {
                                                alignment: go.Spot.BottomRight,
                                                cursor: "sw-resize",
                                                desiredSize: new go.Size(6, 6),
                                                fill: "lightblue",
                                                stroke: "deepskyblue"
                                            }) */
                );

                myDiagram = goMaker(go.Diagram, diagramId, {
                    grid: goMaker(go.Panel, 'Grid',
                        goMaker(go.Shape, 'LineH', {
                            stroke: 'lightgray',
                            strokeWidth: 0.5
                        }),
                        goMaker(go.Shape, 'LineH', {
                            stroke: 'gray',
                            strokeWidth: 0.5,
                            interval: 10
                        }),
                        goMaker(go.Shape, 'LineV', {
                            stroke: 'lightgray',
                            strokeWidth: 0.5
                        }),
                        goMaker(go.Shape, 'LineV', {
                            stroke: 'gray',
                            strokeWidth: 0.5,
                            interval: 10
                        })
                    ),
                    allowDrop: true,
                    initialContentAlignment: go.Spot.Center,
                    'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
                    'draggingTool.dragsLink': false,
                    'draggingTool.isGridSnapEnabled': true,
                    'linkingTool.isUnconnectedLinkValid': false,
                    'linkingTool.portGravity': 20,
                    'relinkingTool.isUnconnectedLinkValid': false,
                    'relinkingTool.portGravity': 20,
                    'relinkingTool.fromHandleArchetype': goMaker(go.Shape, 'Diamond', {
                        segmentIndex: 0,
                        cursor: 'pointer',
                        desiredSize: new go.Size(8, 8),
                        fill: 'tomato',
                        stroke: 'darkred'
                    }),
                    'relinkingTool.toHandleArchetype': goMaker(go.Shape, 'Diamond', {
                        segmentIndex: -1,
                        cursor: 'pointer',
                        desiredSize: new go.Size(8, 8),
                        fill: 'darkred',
                        stroke: 'tomato'
                    }),
                    'linkReshapingTool.handleArchetype': goMaker(go.Shape, 'Diamond', {
                        desiredSize: new go.Size(7, 7),
                        fill: 'lightblue',
                        stroke: 'deepskyblue'
                    }),
                    'undoManager.isEnabled': true
                });
                var fieldTemplate =
                    goMaker(go.Panel, 'TableRow', // this Panel is a row in the containing Table
                        new go.Binding('portId', 'name'), // this Panel is a "port"
                        {
                            background: 'transparent', // so this port's background can be picked by the mouse
                            fromSpot: go.Spot.Right, // links only go from the right side to the left side
                            toSpot: go.Spot.Left
                        },

                        new go.Binding('fromLinkable', 'key', convert.keyFrom),
                        new go.Binding('toLinkable', 'key', convert.keyTo),

                        goMaker(go.Shape, {
                                width: 12,
                                height: 12,
                                column: 0,
                                strokeWidth: 2,
                                margin: 4,
                                // but disallow drawing links from or to this shape:
                                fromLinkable: false,
                                toLinkable: false
                            },

                            new go.Binding('figure', 'key', convert.keyFig),
                            new go.Binding('fill', 'key', convert.keyColor).ofObject(),
                            new go.Binding('stroke', 'key', convert.keyColor)
                        ),
                        goMaker(go.TextBlock, {
                                margin: new go.Margin(0, 2),
                                column: 1,
                                alignment: go.Spot.Left,
                                font: 'bold 13px sans-serif',
                                // and disallow drawing links from or to this text:
                                fromLinkable: false,
                                toLinkable: false
                            },
                            new go.Binding('text', 'name')),
                        goMaker(go.TextBlock, {
                                margin: new go.Margin(0, 2),
                                alignment: go.Spot.Right,
                                column: 2,
                                font: '9px sans-serif'
                            },
                            new go.Binding('text', 'type', convert.keyType))
                    );

                myDiagram.nodeTemplate = goMaker(go.Node, 'Auto',
                    new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify), {
                        selectable: true,
                        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate

                    }, {
                        resizable: true,
                        resizeObjectName: 'PANEL',
                        resizeAdornmentTemplate: nodeResizeAdornmentTemplate
                    },
                    // this rectangular shape surrounds the content of the node
                    goMaker(go.Shape, {
                        fill: '#EEEEEE'
                    }),
                    goMaker(go.Panel, 'Vertical', {
                            stretch: go.GraphObject.Horizontal
                        },
                        goMaker(go.Panel, 'Horizontal', {
                                stretch: go.GraphObject.Horizontal,
                                background: '#1570A6'
                            },
                            // header
                            /* goMaker(go.Panel, "Auto",
                                {
                                    stretch: go.GraphObject.Horizontal
                                },
                                /*goMaker(go.Shape,
                                    {
                                        fill: "#1570A6",
                                        stroke: null
                                    }
                                ), */
                            goMaker(go.TextBlock, {
                                    alignment: go.Spot.Center,
                                    margin: 3,
                                    stroke: 'white',
                                    textAlign: 'center',
                                    font: 'bold 12pt sans-serif'
                                },
                                new go.Binding('text', 'name').makeTwoWay(),
                                new go.Binding('key', 'key')
                            )
                            // )
                        ),
                        goMaker(go.Panel, 'Table',
                            new go.Binding('itemArray', 'properties'), {
                                name: 'TABLE',
                                // padding: 2,
                                defaultStretch: go.GraphObject.Horizontal,
                                itemTemplate: fieldTemplate,
                                alignment: go.Spot.Left
                            }
                        )
                    )
                );
                //   myDiagram.validCycle = go.Diagram.CycleDestinationTree;
                myDiagram.validCycle = go.Diagram.CycleSourceTree;
                var linkSelectionAdornmentTemplate = goMaker(go.Adornment, 'Link',
                    goMaker(go.Shape,
                        // isPanelMain declares that this Shape shares the Link.geometry
                        {
                            isPanelMain: true,
                            fill: null,
                            stroke: 'deepskyblue',
                            strokeWidth: 0
                        }
                    ) // use selection object's strokeWidth
                );
                myDiagram.linkTemplate =
                    goMaker(go.Link, // the whole link panel
                        {
                            selectable: true,
                            selectionAdornmentTemplate: linkSelectionAdornmentTemplate
                        }, {
                            doubleClick: function(e, obj) {
                                // obj.data.uuid = obj.data.uuid || Ex.guid().toUpperCase(); // write identifier
                                // obj.data.name = obj.data.from + "_" + obj.data.to;
                                me.fireEvent('linkselected', myDiagram, obj.data, obj, e);
                            }
                        }, {
                            relinkableFrom: false,
                            relinkableTo: false,
                            reshapable: true
                        }, {
                            routing: go.Link.AvoidsNodes,
                            curve: go.Link.JumpOver,
                            corner: 5,
                            toShortLength: 4

                        },
                        new go.Binding('points').makeTwoWay(),
                        goMaker(go.Shape, // the arrowhead
                            {
                                fromArrow: 'Line'
                            }),
                        goMaker(go.Shape, // the link path shape
                            {
                                isPanelMain: true,
                                strokeWidth: 2
                            }),
                        goMaker(go.Shape, // the arrowhead
                            {
                                toArrow: 'Fork'
                            }),
                        goMaker(go.Panel, 'Auto',
                            new go.Binding('visible', 'isSelected').ofObject(),
                            goMaker(go.Shape, 'RoundedRectangle', // the link shape
                                {
                                    fill: '#F8F8F8',
                                    stroke: null
                                }), // label
                            goMaker(go.TextBlock, {
                                    textAlign: 'center',
                                    font: '10pt helvetica, arial, sans-serif',
                                    stroke: '#919191',
                                    margin: 2,
                                    minSize: new go.Size(10, NaN),
                                    editable: true
                                },
                                new go.Binding('text', 'text').makeTwoWay())
                            // new go.Binding("text", 'name', function (a, b, c, d)
                            // {
                            //    var a = a || {};

                            //    console.log(a);
                            // }))
                        )
                    );
                /**/
                var nodedata = me.nodeData;
                var linkdata = me.linkData;
                /**/
                myDiagram.model = goMaker(go.GraphLinksModel, {
                    copiesArrays: true,
                    copiesArrayObjects: true,
                    nodeDataArray: nodedata,
                    linkDataArray: linkdata,
                    //  makeUniqueKeyFunction: convert.unique,
                    'linkFromPortIdProperty': 'fromPort',
                    'linkToPortIdProperty': 'toPort'
                });

                // notice whenever a transaction or undo/redo has occurred
                myDiagram.addDiagramListener('LinkDrawn', function(e, f, g) {
                    // structure join.
                    // var join = {
                    //    to: e.subject.toNode.data.key,
                    //    from: e.subject.fromNode.data.key,
                    //    toPort: e.subject.toPortId,
                    //    fromPort: e.subject.fromPortId
                    // };

                    // set name  constraint and uuid
                    if (me.extraProperties) {
                        e.subject.data.fromName = e.subject.fromNode.data.name;
                        e.subject.data.toName = e.subject.toNode.data.name;
                        e.subject.data.name = 'fk_' + e.subject.toNode.data.name + '_' + e.subject.fromNode.data.name + '_' + e.subject.toPortId + '_' + e.subject.fromPortId;

                        e.subject.data.value = '{{Parameter.' + (e.subject.fromNode.data.isMainSource ? 'MainDesign' : e.subject.fromNode.data.name) + '.' + e.subject.fromPortId + '}}';
                        //  e.subject.data.text = e.subject.data.name;
                    }
                    e.subject.data.uuid = Ex.guid();

                    if (!me.isValidRelationship(e.subject.data)) {
                        myDiagram.rollbackTransaction();
                    }
                });
                myDiagram.addDiagramListener('LinkRelinked', function(e, f, g) {
                    if (!me.isValidRelationship(e.subject.data)) {
                        myDiagram.rollbackTransaction();
                    }
                    /* else
                    {
                        me.updateOrderAndTree(_join);
                    } */
                });

                // myDiagram.addDiagramListener('SelectionDeleting', function (e, a)
                // {
                //    //var data = e.subject.first().data;
                //    //if (data)
                //    //    if (data.hasOwnProperty('fromPort')) //is join
                //    //        me.removeOrderAndTree(data)
                //    //var listJoins = ExArray.each(myDiagram.model.mo)
                // });

                // myDiagram.addDiagramListener("SelectionMoved", function (e, a)
                // {
                //    console.log(e);
                // });

                // myDiagram.addDiagramListener("ObjectSingleClicked", function (e, a)
                // {
                //    console.log(e);
                // });
                // myDiagram.addDiagramListener("ObjectDoubleClicked", function (e, a)
                // {
                //    console.log(e);
                // });

                myDiagram.addDiagramListener('ExternalObjectsDropped', function(e, a) {
                    if (me.uniqueSourceConstraint) {
                        if (!me.isValidSourceDrop(e.subject.first().data)) {
                            myDiagram.rollbackTransaction();
                        }
                    }
                });
                /*
                myDiagram.addDiagramListener('LinkDrawn', function (e, a)
                {
                    console.log(e);
                    console.log(a);
                });

                myDiagram.model.addChangedListener(function (e, a)
                {
                    console.log(e);
                }); */
                // myDiagram.addDiagramListener('nodeParentKey', function (e, a)
                // {
                //    console.log(e);
                // })
                if (me.overview) {
                    myOverview = goMaker(go.Overview, overviewId, {
                        observed: myDiagram,
                        maxScale: 0.5
                            // /   contentAlignment: go.Spot.Center
                    });
                    //  change color of viewport border in Overview
                    myOverview.box.elt(0).stroke = 'dodgerblue';
                }
                // flag to completo to afterrender
                me.isContentRendered = true;
                if (me.configData) {
                    me.setSerializedData(me.configData);
                }
            });
        } // end to apply canvas conponent based Go JS
    }
});