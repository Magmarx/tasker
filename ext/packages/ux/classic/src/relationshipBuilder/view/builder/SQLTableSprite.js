/**
 * Created by Desar_6 on 04/09/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.view.builder.SQLTableSprite', {
    extend: 'Ext.draw.Sprite',
    instanceId: null,
    alias: ['widget.sourcerelationshiptablesprite'],
    //   bConnections: false,
    table: null,
    countDrag: 0,
    listeners: {
        'render': function() {
            console.log('render');
        }
    },
    startDrag: function(id) {
        try {
            console.log('startDrag');

            var me = this,
                Ex = Ext,
                win, sqlTablePanel, xyParentPos, xyChildPos;
            me.countDrag++;
            console.log(me.countDrag);
            // get a reference to a sqltable
            win = Ex.getCmp(id);
            // get the main sqlTablePanel
            // sqlTablePanel = Ex.getCmp('SourceRelationshipTablePanel');
            sqlTablePanel = me.table.context;
            // get the main sqlTablePanel position
            xyParentPos = sqlTablePanel.el.getXY();
            // get the size of the previously added sqltable
            xyChildPos = win.el.getXY();
            me.prev = me.surface.transformToViewBox(xyChildPos[0] - xyParentPos[0] + 2, xyChildPos[1] - xyParentPos[1] + 2);
        } catch (ex) {
            console.error(ex);
        }
    },
    onDrag: function(relPosMovement) {
        //  console.log('onDrag');
        try {
            var me = this,
                newX, newY;
            me.countDrag++;
            console.log(me.countDrag + ' onDrag');
            // move the sprite
            // calculate new x and y position
            var prevx = me.prev ? me.prev[0] : 0,
                prevy = me.prev ? me.prev[1] : 0;
            newX = prevx + relPosMovement[0];
            newY = prevy + relPosMovement[1];
            // set new x and y position and redraw sprite
            me.setAttributes({
                x: newX,
                y: newY

            }, true);
        } catch (ex) {
            console.error(ex);
        }
        // me.fireEvent('ondrag');
    }
});