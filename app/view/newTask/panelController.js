/**
 * @class Tasker.view.newTask.PanelController
 * @author mporras
 * @alias newTaskController
 *
 */
Ext.define('Tasker.view.newTask.PanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.newTaskController',

    onRenderDrop: function(item, eOpts) {

        let _this = this,
            view = _this.getView(),
            model = view.getViewModel(),
            newTaskStore = model.getStore('taskCards');

        item.dropZone = Ext.create('Ext.dd.DropZone', item.getEl(), {
            onNodeEnter: function(target, dd, e, data) {
                let record = data.record,
                    recordData = record.getData();

                if (!recordData.isNew) {
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
                    inProcessStore = parentViewModel.getStore(data.storeId),
                    taskCardData = inProcessStore.findRecord('id', recordData.id);;

                if (!recordData.isNew) {

                    taskCardData.set('isNew', true)

                    newTaskStore.add(taskCardData)

                    inProcessStore.remove(inProcessStore.findRecord('id', recordData.id))

                    return Ext.dd.DropZone.prototype.dropAllowed;
                } else {
                    return Ext.dd.DropZone.prototype.dropNotAllowed;
                }

            },

            onNodeOver: function(target, dd, e, data) {
                let record = data.record,
                    recordData = record.getData();

                if (!recordData.isNew) {
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