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
    controller: 'windowController',

    modal: true,
    defaults: {
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        padding: 15
    },

    config: {
        parentView: null,
        actionMode: 'create',
        recordData: null
    },
    
    items: [{
        xtype: 'form',
        reference: 'firstForm',
        defaults: {
            padding: '0 15 0 15',
            allowBlank: false,
            flex: 1,
            labelAlign: 'top',
            enforceMaxLength: true
        },
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Name',
            maxLength: 20,
            name: 'name',
            listeners: {
                change: 'updateValues'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: 'Description',
            maxLength: 250,
            name: 'description',
            flex: 2
        }]
    }, {
        xtype: 'form',
        reference: 'secondForm',
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
            maxValue: 5,
            listeners: {
                change: 'updateValues'
            }
        },{
            xtype: 'datefield',
            fieldLabel: 'Initial Date',
            name: 'initDate',
            reference: 'initDate',
            publishes: 'value',
            bind: {
                maxValue: '{endDate.value}'
            },
            listeners: {
                change: 'updateValues'
            }
        }, {
            xtype: 'datefield',
            fieldLabel: 'End Date',
            name: 'endDate',
            reference: 'endDate',
            publishes: 'value',
            bind: {
                minValue: '{initDate.value}'
            },
            listeners: {
                change: 'updateValues'
            }
        }]
    }, {
        xtype: 'form',
        reference: 'thirdForm',
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
            maxValue: '120',
            listeners: {
                change: 'updateValues'
            }
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
            valueField: 'severity'
        }]
    }, {
        xtype: 'form',
        reference: 'fourthForm',
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
            valueField: 'id',
            valueField: 'id',
            flex: 1
        }, {
            xtype: 'numberfield',
            name: 'storyPoints',
            fieldLabel: 'Story Points',
            minValue: '0',
            maxValue: '100',
            flex: 1,
            listeners: {
                change: 'updateValues'
            }
        }, {
            xtype: 'textfield',
            fieldLabel: 'Color',
            name: 'color',
            listeners: {
                change: 'updateValues'
            }
        }, {
            xtype: 'checkboxfield',
            boxLabel  : 'New',
            name      : 'new',
            inputValue: '1',
            value: 1
        }]
    }, {
        xtype: 'panel',
        title: 'Preview',
        reference: 'previewPanel',
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
    }],
    buttons: [
        {
            text: 'Accept',
            name: 'accept',
            scale: 'medium',
            handler: 'onAccept'
        },
        {
            text: 'Cancel',
            name: 'cancel',
            scale: 'medium',
            handler: 'onCancel'
        }
    ],

    listeners: {
        boxready: 'setData'
    }
});