/**
 * @class M5.view.formManager.assignParameters.sourceParameters.sourceParametersController
 * @extends Ext.app.ViewController
 * @author cgaldamez
 * @alias sourceParameters
 *
 */
Ext.define('Tasker.view.inProcessTask.PanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.processController',

    onRenderDrop: function(item, eOpts) {

        let _this = this,
            view = _this.getView(),
            model = view.getViewModel(),
            inProcessStore = model.getStore('taskCards');

        item.dropZone = Ext.create('Ext.dd.DropZone', item.getEl(), {
            onNodeEnter: function(target, dd, e, data) {
                let record = data.record,
                    recordData = record.getData();
                
                if (recordData.isNew) {
                    return Ext.dd.DropZone.prototype.dropAllowed;
                } else {
                    return Ext.dd.DropZone.prototype.dropNotAllowed;
                }
            },

            onNodeDrop: function(target, dd, e, data) {

                let record = data.record,
                    recordData = record.getData(),
                    parentView = data.parentView,
                    parentViewModel = parentView.getViewModel(),
                    newTaskStore = parentViewModel.getStore(data.storeId),
                    taskCardData = newTaskStore.findRecord('id', recordData.id);

                if (recordData.isNew) {

                    taskCardData.set('isNew', false)

                    inProcessStore.add(taskCardData)

                    newTaskStore.remove(newTaskStore.findRecord('id', recordData.id))

                    return Ext.dd.DropZone.prototype.dropAllowed;

                } else {

                    return Ext.dd.DropZone.prototype.dropNotAllowed;
                    
                }
                
            },

            onNodeOver: function(target, dd, e, data) {
                let record = data.record,
                    recordData = record.getData();

                if (recordData.isNew) {
                    return Ext.dd.DropZone.prototype.dropAllowed;
                } else {
                    return Ext.dd.DropZone.prototype.dropNotAllowed;
                }
            },

            getTargetFromEvent: function(e) {
                return e.getTarget(item.rowSelector);
            },

            ddGroup: 'group1'
        });
    }
});