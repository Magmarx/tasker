/**
 * @Author Miguel Porras
 * @Date 02/07/2019
 * @xtype addTaskWindow
 */
Ext.define('Tasker.view.addNewTask.windowController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.windowController',

    setData: function () {
        let _this = this,
            view = _this.getView(),
            data = view.getRecordData(),
            actionMode = view.getActionMode(),
            firstForm = view.lookupReference('firstForm'),
            secondForm = view.lookupReference('secondForm'),
            thirdForm = view.lookupReference('thirdForm'),
            fourthForm = view.lookupReference('fourthForm');

        if (actionMode != 'create') {
            // First form add data
            firstForm.down('[name=name]').setValue(data.title);
            firstForm.down('[name=description]').setValue(data.description);

            // Second form add data
            secondForm.down('[name=rating]').setValue(data.rating, true);
            secondForm.down('[name=initDate]').setValue(data.initDate);
            secondForm.down('[name=endDate]').setValue(data.endDate);

            // Third form add data
            thirdForm.down('[name=duration]').setValue(data.duration);
            thirdForm.down('[name=category]').setValue(data.category);
            thirdForm.down('[name=priority]').setValue(data.priority);

            // Fourth form add data
            fourthForm.down('[name=project]').setValue(data.project);
            fourthForm.down('[name=storyPoints]').setValue(data.storyPoints);
            fourthForm.down('[name=color]').setValue(data.color);
            fourthForm.down('[name=new]').setValue(data.isNew);
        }

    },

    updateValues: function () {
        let _this = this,
            view = _this.getView(),
            model = _this.getViewModel(),
            firstForm = view.lookupReference('firstForm').getValues(),
            secondForm = view.lookupReference('secondForm').getValues(),
            thirdForm = view.lookupReference('thirdForm').getValues(),
            fourthForm = view.lookupReference('fourthForm').getValues();

        let originalTask = {
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
        }, previewTaskData = {
            idTask: 'prevTask',
            color: fourthForm.color,
            title: firstForm.name,
            duration: thirdForm.duration,
            rating: secondForm.rating,
            storyPoints: fourthForm.storyPoints,
            initDate: secondForm.initDate,
            endDate: secondForm.endDate,
            width: '500px',
            height: '200px',
            background: '',
            cardClass: 'infoCards',
            dateLineHeight: '80px',
            dateFontSize: '23px'
        }, taskJson = _this.mergeJsons(originalTask, previewTaskData);


        model.getStore('taskCards').loadData([taskJson]);
    },

    mergeJsons: function (originalJson, mergeJson) {
        let jsonNames = Object.getOwnPropertyNames(originalJson),
            returnJson = {};

        jsonNames.forEach(function (prop) {
            if (Ext.isEmpty(mergeJson[prop])) {
                returnJson[prop] = originalJson[prop];
            } else {
                returnJson[prop] = mergeJson[prop];
            }

        });

        return returnJson;
    },

    isValid: function () {
        let _this = this,
            view = _this.getView(),
            firstForm = view.lookupReference('firstForm'),
            secondForm = view.lookupReference('secondForm'),
            thirdForm = view.lookupReference('thirdForm'),
            fourthForm = view.lookupReference('fourthForm');

        if (firstForm.isValid() && secondForm.isValid() && thirdForm.isValid() && fourthForm.isValid()) {
            return true;
        } else {
            return false;
        }
    },

    showToast: function (s) {
        Ext.toast({
            html: s,
            closable: false,
            align: 't',
            slideDUration: 400,
            maxWidth: 400
        });
    },

    onAccept: function (btn, e) {

        let _this = this,
            view = _this.getView(),
            model = _this.getViewModel(),
            parentView = view.getParentView(),
            actionMode = view.getActionMode(),
            newTaskPanel = parentView.down('newTaskPanel'),
            newTaskPanelModel = newTaskPanel.getViewModel(),
            inProcessTaskPanel = parentView.down('inProcessTaskPanel'),
            inProcessTaskPanelModel = inProcessTaskPanel.getViewModel(),
            firstForm = view.lookupReference('firstForm').getValues(),
            secondForm = view.lookupReference('secondForm').getValues(),
            thirdForm = view.lookupReference('thirdForm').getValues(),
            fourthForm = view.lookupReference('fourthForm').getValues(),
            isNewValue = view.lookupReference('fourthForm').down('checkbox').getValue(),
            newTask = {
                title: firstForm.name,
                description: firstForm.description,
                rating: secondForm.rating,
                initDate: secondForm.initDate,
                endDate: secondForm.endDate,
                duration: thirdForm.duration,
                category: thirdForm.category,
                priority: thirdForm.priority,
                project: fourthForm.project,
                storyPoints: fourthForm.storyPoints,
                color: fourthForm.color,
                width: '95%',
                height: '150px',
                background: '#FFFFFF',
                cardClass: 'infoCards-small',
                dateLineHeight: '50px',
                dateFontSize: '15px',
                upPadding: '5px 0px',
                enableClick: true,
                isNew: isNewValue
            };

        // To add (week, resolvedDay)


        if (_this.isValid()) {

            switch (actionMode) {
                case 'create':
                    if (newTask.isNew) {
                        newTaskPanelModel.getStore('taskCards').add(newTask);
                    } else {
                        inProcessTaskPanelModel.getStore('taskCards').add(newTask);
                    }
                //     Ext.Ajax.request({
                //         url: Ext.getBaseUrl(),
                //         method: 'POST',
                //         contentType: "application/json",
                //         jsonData: JSON.stringify({
                //             "query": `mutation {
                //     createTask(
                //         task: {
                //     name: "${newTask.title}"
                //     description: "${newTask.description}"
                //     rating: ${newTask.rating}
                //     initialDate: "${newTask.initDate}"
                //     endDate: "${newTask.endDate}"
                //     week: 4
                //     duration: ${newTask.duration}
                //     category: "${newTask.category}"
                //     priority: ${newTask.priority}
                //     proyect: "${newTask.project}"
                //     storyPoints: ${newTask.storyPoints}
                //     color: "${newTask.color}"
                //     newIs: ${newTask.isNew}
                //     wasDeleted: false
                //     resolvedDay: ""
                // }
                // ) {
                //     status
                // }
                // }
                //     `
                //         }),
                //         success: function (response) {
                //             debugger;
                //             // context.getEl().unmask();
                //             // var data = JSON.parse(response.responseText);
                //             // if (data.children[0].canDelete) {
                //             //     context.fireEvent(event, customParams);
                //             // } else {
                //             //     Ext.Notify.msg(Ext.localization.integrityPanel.error.referentialIntegrity, {
                //             //         layout: 'bottomright',
                //             //         delay: 5000,
                //             //         type: 'error'
                //             //     });
                //             // }
                //         },
                //         failure: function (response) {
                //             debugger;
                //             // var data = JSON.parse(response.responseText);
                //             // Ext.Notify.msg(data.message, {
                //             //     layout: 'bottomright',
                //             //     delay: 5000,
                //             //     type: 'error'
                //             // });
                //         }
                //     });

                    break;

                case 'edit':
                    let store,
                        data,
                        newData;
                    if (newTask.isNew) {
                        store = newTaskPanelModel.getStore('taskCards');
                    } else {
                        store = inProcessTaskPanelModel.getStore('taskCards');
                    }
                    data = store.getById(view.getRecordData().id).data
                    newData = _this.mergeJsons(data, newTask)
                    store.getById(view.getRecordData().id).set(newData);
                    break;

            }

            view.close();
        } else {
            _this.showToast('Please Fill all the fields');
        }


    },

    onCancel: function (btn, e) {
        let _this = this,
            view = _this.getView();

        view.close();
    }

});