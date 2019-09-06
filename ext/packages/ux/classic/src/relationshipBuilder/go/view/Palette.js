/**
 * Created with IntelliJ IDEA.
 * User: MYAX
 * Date: 11/11/15
 * Time: 07:11 AM
 * To change this template use File | Settings | File Templates.
 */

Ext.define('Ext.ux.relationshipBuilder.go.view.Palette', {
    extend: 'Ext.container.Container',
    xtype: 'paletemaker',
    layout: 'fit',
    configData: null,
    collapsible: true,
    //   isRendered: false,
    rawSources: null,
    isContentRendered: false,
    initComponent: function() {
        var me = this,
            Ex = Ext,
            goMaker = (go) ? go.GraphObject.make : null,
            rawhtml = '',
            myPalette = null,
            paletteId = 'palette-' + Ex.guid();
        // validate go Js exist.
        if (go) {
            rawhtml = '<div id="' + paletteId + '" style="height: 100%; width:100%"></div>';
        } else {
            rawhtml = 'Required GoJS to draw this feature.';
        }
        // add html configuration to container
        Ex.applyIf(me, {
            html: rawhtml,
            getPalette: function() {
                return myPalette;
            },

            setSerializedData: function(data) {
                if (data) {
                    if (data.length) {
                        myPalette.model = new goMaker(go.GraphLinksModel, {
                            nodeDataArray: data
                        });
                    }
                }
            },
            isRendered: function() {
                return me.isContentRendered;
            }
        });
        me.callParent(arguments);

        // apply component extencions Go js
        if (go) {
            me.on('afterrender', function() {
                // must name or refer to the DIV HTML element
                myPalette = goMaker(go.Palette, paletteId, {
                    // slightly longer than default (600ms) animation
                    'animationManager.duration': 800
                });
                // the Palette's node template is different from the main Diagram's

                myPalette.nodeTemplate =
                    goMaker(go.Node, 'Horizontal',
                        goMaker(go.Shape, {
                                width: 14,
                                height: 14,
                                fill: 'white'
                            },
                            new go.Binding('fill', 'color')),
                        goMaker(go.TextBlock,
                            new go.Binding('text', 'name'))
                    );
                // flag to completo to afterrender
                me.isContentRendered = true;

                if (me.rawSources) {
                    me.setSerializedData(me.rawSources);
                }
            });
        }
    }
});