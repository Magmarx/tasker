/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Tasker.view.newTask.panelModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.newTaskModel',

    data: {},

    stores: {
        taskCards: {
            storeId: 'taskCards',
            fields: ['idTask', 'color', 'title', 'duration', 'rating', 'storyPoints', 'initDate', 'endDate', 'width', 'height'],
            data: []
        }
    }


});