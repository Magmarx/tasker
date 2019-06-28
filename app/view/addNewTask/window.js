/**
 * @Author Miguel Porras
 * @Date 28/06/2019
 * @xtype addTaskWindow
 */
Ext.define('Tasker.view.addNewTask.window', {
    extend: 'Ext.window.Window',
    xtype: 'addTaskWindow',

    title: 'Create Task',
    height: 750,
    width: 1450,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    viewModel: 'windowModel',

    modal: true,
    defaults: {
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        padding: 15
    },
    
    items: [{
        xtype: 'panel',
        defaults: {
            padding: '0 15 0 15',
            allowBlank: false,
            flex: 1,
            labelAlign: 'top'
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Name',
            name: 'name'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Description',
            name: 'description',
            flex: 2
        }]
    }, {
        xtype: 'panel',
        defaults: {
            padding: '0 15 0 15',
            allowBlank: false,
            flex: 1,
            labelAlign: 'top'
        },
        items: [{
            xtype: 'slider',
            fieldLabel: 'Rating (measured by stars)',
            name: 'rating',
            value: 3,
            increment: 1,
            minValue: 0,
            maxValue: 5
        },{
            xtype: 'datefield',
            fieldLabel: 'Initial Date',
            name: 'initDate'
        }, {
            xtype: 'datefield',
            fieldLabel: 'End Date',
            name: 'endDate'
        }]
    }, {
        xtype: 'panel',
        defaults: {
            padding: '0 15 0 15',
            allowBlank: false,
            flex: 1,
            labelAlign: 'top'
        },
        items: [{
            xtype: 'numberfield',
            name: 'duration',
            fieldLabel: 'Duration (by hours)',
            minValue: '0',
            maxValue: '120'
        }, {
            xtype: 'tagfield',
            bind: {
                store: '{categoryStore}',
            },
            fieldLabel: 'Category',
            name: 'category',
            displayField: 'show',
            valueField: 'id',
            queryMode: 'local',
            filterPickList: true
        }, {
            xtype: 'combo',
            fieldLabel: 'Priority',
            name: 'priority',
            bind : {
                store: '{priority}'
            },
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr'
        }]
    }, {
        xtype: 'panel',
        defaults: {
            padding: '0 15 0 15',
            allowBlank: false,
            labelAlign: 'top'
        },
        items: [{
            xtype: 'combo',
            fieldLabel: 'Project',
            name: 'project',
            bind : {
                store: '{project}'
            },
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            flex: 1
        }, {
            xtype: 'numberfield',
            name: 'storyPoints',
            fieldLabel: 'Story Points',
            minValue: '0',
            maxValue: '100',
            flex: 1
        }, {
            xtype: 'button',
            name: 'color',
            reference: 'color',
            text: 'Color',
            height: 30,
            width: 150
        }, {
            xtype: 'checkboxfield',
            boxLabel  : 'New',
            name      : 'new',
            inputValue: '1',
        }]
    }, {
        xtype: 'panel',
        title: 'Preview',
        layout: {
            type: 'vbox',
            align: 'center'
        },
        items: [
            {
                xtype: 'taskCard',
                bind: {
                    store: '{taskCards}'
                },
                margin: 10
            }
        ]
    }]
});