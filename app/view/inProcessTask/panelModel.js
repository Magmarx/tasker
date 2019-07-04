/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Tasker.view.inProcessTask.panelModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.inProcessTaskModel',

    data: {},

    stores: {
        taskCards: {
            storeId: 'taskCards',
            fields: ['idTask', 'color', 'title', 'duration', 'rating', 'storyPoints', 'initDate', 'endDate', 'width', 'height'],
            data: []
        }
    }


});