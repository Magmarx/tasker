/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 */
Ext.define('Tasker.view.floatingButtons.PanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.floatingButtonController',

    createAddTaskWindow: function () {
        let _this = this,
            view = _this.getView(),
            mainTasker = view.up('mainTasker');
        let window = Ext.create('Tasker.view.addNewTask.window', {
            parentView: mainTasker
        });
        window.show();
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});
