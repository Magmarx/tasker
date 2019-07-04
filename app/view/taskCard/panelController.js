/**
 * @class M5.view.formManager.assignParameters.sourceParameters.sourceParametersController
 * @extends Ext.app.ViewController
 * @author cgaldamez
 * @alias sourceParameters
 *
 */
Ext.define('Tasker.view.taskCard.PanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.taskCardController',

    onRenderDrag: function(item, eOpts) {

        let _this = this,
            view = _this.getView();

        item.dragZone = Ext.create('Ext.dd.DragZone', item.getEl(), {
            /**
             * Getting all the data needed for making the funcionality
             * of the drag object
             *
             * @param {any} e
             * @returns
             */
            getDragData: function(e) {
                e.preventDefault();
                var sourceEl = e.getTarget(item.itemSelector, 10);
                var d;
                if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    
                    d.getElementsByClassName('taskCard')[0].setAttribute('style', "width:300px; height:150px; background-color: #FFFFFF;")

                    const infoCardsLength = d.getElementsByClassName('infoCards-small').length;
                    for (let i = 0; i < infoCardsLength; i++) {
                        d.getElementsByClassName('infoCards-small')[0].setAttribute('class', "infoCards-floating")
                    }

                    d.getElementsByClassName('dateText')[0].setAttribute('style', "position: relative; top: 80px; right: 520px; line-height: 10px; font-size: 15px;")
                    
                    d.id = Ext.id();
                    var rec = item.getRecord(d);
                    if (rec.get('id') !== '-1') {
                        return (item.dragData = {
                            sourceEl: sourceEl,
                            repairXY: Ext.fly(sourceEl).getXY(),
                            ddel: d,
                            storeId: 'taskCards',
                            parentView: view.ownerCt,
                            record: rec
                        });
                    } else {
                        return false;
                    }
                }
            },

            /**
             * Provide coordinates for the proxy to slide back to on failed dragData
             * This is the original XY coordinates of the draggable content
             *
             * @returns Coordinates
             */
            getRepairXY: function() {
                return this.dragData.repairXY;
            },

            ddGroup: 'group1'
        });

    },
    
    openCardEditor: function (item, record, item, index, e, eOpts ) {
        
        let _this = this,
            view = _this.getView(),
            mainTasker = view.up('mainTasker'),
            window = Ext.create('Tasker.view.addNewTask.window', {
                parentView: mainTasker,
                actionMode: 'edit',
                recordData: record.getData()
            });

        window.show();
    }
});
