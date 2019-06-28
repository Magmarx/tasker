/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('Tasker.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'mainTasker',

    title: 'Tasker',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'Tasker.view.main.MainController',
        'Tasker.view.main.MainModel'
    ],

    controller: 'main',
    viewModel: 'main',

    ui: 'navigation',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    
    items: [
        {
            xtype: 'newTaskPanel',
            flex: 1,
        }, {
            xtype: 'inProcessTaskPanel',
            flex: 1,
        }, {
            xtype: 'dashboard',
            flex: 4
        }, {
            xtype: 'floatingButtons'
        }]
});
