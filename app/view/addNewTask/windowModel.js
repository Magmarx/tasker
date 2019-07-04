/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Tasker.view.addNewTask.windowModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.windowModel',

    data: {
        name: 'Tasker'
    },

    stores: {
       categoryStore: {
           fields: ['id','show'],
           data: [
               {id: 0, show: 'Planning'},
               {id: 1, show: 'Design'},
               {id: 2, show: 'Development'},
               {id: 3, show: 'Testing'},
               {id: 4, show: 'Post-Mortem'},
               {id: 5, show: 'Daily Scrum'},
               {id: 6, show: 'Sprint Review'}
           ]
       },
        priority: {
            storeId: 'priorityStore',
            fields: ['severity', 'name'],
            data : [
                {"severity":"1", "name":"1 - Blocker"},
                {"severity":"2", "name":"2 - Critical"},
                {"severity":"3", "name":"3 - Major"},
                {"severity":"4", "name":"4 - Minor"},
                {"severity":"5", "name":"5 - Trivial"},
            ]
        },
        project: {
            fields: ['id', 'name'],
            data : [
                {"id":0, "name":"Personal Project"},
                {"id":1, "name":"Monitor 5"},
                {"id":2, "name":"RMI"},
                {"id":3, "name":"GCI"},
                {"id":4, "name":"Data Mining"},
                {"id":5, "name":"Certification"}
            ]
        },
        taskCards: {
            storeId: 'taskCards',
            fields: ['idTask', 'color', 'title', 'duration', 'rating', 'storyPoints', 'initDate', 'endDate', 'width', 'height'],
            data: [
                {
                    idTask: 'prevTask',
                    color: '#3B939A',
                    title: 'Preview Card',
                    duration: '0',
                    rating: '0',
                    storyPoints: '0',
                    initDate: '00/00/0000',
                    endDate: '00/00/0000',
                    width: '500px',
                    height: '200px',
                    background: '',
                    cardClass: 'infoCards',
                    dateLineHeight: '80px',
                    dateFontSize: '23px'
                }
            ]
        }
    }

    
});