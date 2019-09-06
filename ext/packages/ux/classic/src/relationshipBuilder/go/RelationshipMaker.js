/**
 * Created with IntelliJ IDEA.
 * User: MYAX
 * Date: 11/11/15
 * Time: 07:15 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Ext.ux.relationshipBuilder.go.RelationshipMaker', {
    extend: 'Ext.panel.Panel',
    xtype: 'relationshipmaker',
    requires: [
        'Ext.layout.container.Border',
        'Ext.ux.relationshipBuilder.go.view.Palette',
        'Ext.ux.relationshipBuilder.go.view.Diagram'
    ],
    // layout: 'border',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    height: 700,
    instanceId: null,
    style: 'background-color: white',
    identificator: 'key', // default
    rawSources: null, // [array list of source model]
    extraProperties: false,
    initComponent: function() {
        var me = this,
            Ex = Ext,
            rawData = [];
        var diagramMaker = Ex.widget('diagrammaker', {
                extraProperties: me.extraProperties,
                instanceId: me.instanceId,
                identificator: me.identificator,
                style: me.style,
                flex: 5,
                //   region: "center",
                // layout: "fit",
                rawSources: (me.rawSources) ? me.rawSources : rawData
            }),
            paletteMaker = Ex.widget('paletemaker', {
                instanceId: me.instanceId,
                style: me.style,
                flex: 1,
                // region: "west",
                // layout: "fit",
                collapsible: true,
                split: true,
                width: 200,
                rawSources: (me.rawSources) ? me.rawSources : rawData
            });

        Ex.applyIf(me, {
            items: [
                paletteMaker,
                diagramMaker
            ],
            getPalette: function() {
                return paletteMaker;
            },
            getDiagram: function() {
                return diagramMaker;
            },
            getSerializedData: function() {
                return diagramMaker.getSerializedData();
            }
        });
        me.callParent(arguments);
    }
});