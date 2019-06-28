/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('Tasker.view.addNewTask.windowModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.windowModel',

    data: {
        name: 'Tasker',

        loremIpsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },

    stores: {
       categoryStore: {
           fields: ['id','show'],
           data: [
               {id: 0, show: 'Battlestar Galactica'},
               {id: 1, show: 'Doctor Who'},
               {id: 2, show: 'Farscape'},
               {id: 3, show: 'Firefly'},
               {id: 4, show: 'Star Trek'},
               {id: 5, show: 'Star Wars: Christmas Special'}
           ]
       },
        priority: {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"AL", "name":"Alabama"},
                {"abbr":"AK", "name":"Alaska"},
                {"abbr":"AZ", "name":"Arizona"}
            ]
        },
        project: {
            fields: ['abbr', 'name'],
            data : [
                {"abbr":"AL", "name":"Alabama"},
                {"abbr":"AK", "name":"Alaska"},
                {"abbr":"AZ", "name":"Arizona"}
            ]
        },
        taskCards: {
            storeId: 'taskCards',
            fields: ['color', 'title', 'duration', 'rating', 'storyPoints', 'initDate', 'endDate', 'width', 'height'],
            data: [
                {
                    color: '#3B939A',
                    title: 'Preview Card',
                    duration: '0',
                    rating: '3',
                    storyPoints: '0',
                    initDate: '00/00/0000',
                    endDate: '00/00/0000',
                    width: '500px',
                    height: '200px'
                }
            ]
        }
    }

    
});