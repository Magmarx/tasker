/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'Tasker.Application',

    name: 'Tasker',

    requires: [
        // This will automatically load all classes in the Tasker namespace
        // so that application classes do not need to require each other.
        'Tasker.*'
    ],

    // The name of the initial view to create.
    mainView: 'Tasker.view.main.Main'
});
