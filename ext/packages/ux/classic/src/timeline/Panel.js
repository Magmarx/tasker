Ext.define('Ext.ux.timeline.Panel', {
    extend: 'Ext.panel.Panel',
    xtype: 'timeLinePanel',
    requires: [
        'Ext.ux.timeline.DetailPropertyGrid',
        'Ext.ux.window.Preview',
        'Ext.ux.timeline.MenuList',
        'Ext.ux.jsonViewer.TreePanel',
        'Ext.ux.window.Preview'
    ],
    cls: 'metro v3',
    width: 400,
    height: 400,
    layout: 'border',
    nameField: 'name',
    userNameField: 'userName',
    descriptionField: 'description',
    recordDescriptionField: 'recordDescription',
    dateField: 'date',
    timeField: 'startTime',
    hourField: 'hour',
    typeField: 'fileType',
    userThumbnailField: 'userThumbnail',
    thumbnailField: 'thumbnail',
    stateField: 'status',
    fileTypeField: 'fileType',
    menuNameField: 'menuName',
    recordCommentField: 'comment',
    dataArray: [],
    displayMode: 'w',
    timelineType: '',
    keyField: 'id',
    disabledDates: [],
    selectedMenuTagPanelData: [],
    filteredData: false,
    generalWidthValue: 130,
    tileTpl: function () {
        var me = this;
        switch (me.timelineType) {
            case 'attachment':
            return new Ext.XTemplate(
                '<tpl for=".">' +
                '{%' +
                'var stateColor="jumsuccess";' +
                'console.log(values);' +
                '%}' +
                '<div class="list {%out.push(stateColor)%}" style ="margin: 0;width:200px;height: 60px;" title="User:{' + me.userNameField + '}\nFile: {' + me.descriptionField + '}">' +
                '<div style="' +
                'margin: 0px;' +
                'width: 48px;' +
                'height: 60px;' +
                'top:5px;' +
                'position:absolute;' +
                'right:4px;' +
                'text-align: center;' +
                'background-position: center;' +
                'background-repeat: no-repeat;' +
                'background-size: cover;' +
                'background-image: url({' + me.userThumbnailField + '})' +
                '" class="list-icon">' +
                '<div class="fileType-badge">' +
                '<span  class="' + Ext.manifest.globals.fontBasePrefix + '{' + me.typeField + '}"></span>' +
                '</div>' +
                '</div>' +
                '<div class="list-content" style ="padding: 0;text-align: left; position:absolute;top:0;">' +
                '<div>{' + me.dateField + '}</div>' +
                '<div class="list-title text-ellipsis" style="text-align: left;"><span style="font-style: italic;font-size: 12px;" title="File description">{' + me.descriptionField + '}</span></div>' +
                '<div class="text-ellipsis" style="text-align: left; font-style: italic;font-size: 12px;">{' + me.userNameField + '}</div>' +
                '<div class="fileType-badge {' + me.fileTypeField + ':this.getFileType()}"></div>' +
                '</div>' +

                '</div>' +
                '</tpl>', {
                    getFileType: function (uuid) {
                        var record = me.attachmentTypeStore.findRecord('uuid', uuid);
                        return Ext.manifest.globals.fontBasePrefix + Ext.getFileType(record.get('name')) + Ext.manifest.globals.fontBasePostfix;
                    }
                }
            );
            case 'general':
            return new Ext.XTemplate(
                '<tpl for=".">' +
                '{%console.log(values);%}' +
                '<div class="list jumsuccess card-body">' +
                '<div style="' +
                'background-image: url({' + me.thumbnailField + '})' +
                '" class="list-icon user-image">' +
                '{dtTransactions:this.hasTransactionData}' +
                '</div>' +
                '<div class="list-content card">' +
                '<div class="menu-data" title="Menu name">{' + me.menuNameField + '}</div>' +
                '<div class="text-ellipsis user-data"  title="Username">{' + me.userNameField + '}<span class="text-ellipsis date-data" title="Date">{date}</span></div>' +
                '</div>' +
                '</div>' +
                '</tpl>', {
                    hasTransactionData: function (data) {
                        if (data) {
                            var transactionData = Ext.JSON.decode(data);
                            if (transactionData.length > 0) {
                                return Ext.String.format('<span class="{0}viewdetail" title="{1}" ></span>', Ext.manifest.globals.fontBasePrefix, "Has transaction data");
                            }
                        }
                    }
                }
            );
        }
    },
    initComponent: function () {
        var me = this,
        Ex = Ext,
        ExLocale = Ex.localization;
        me.menuId = Ext.guid();
        //console.info('catalogs', me.catalogs);
        // me.getConfigurationData();
        var timeLineId = 'timeline-' + Ext.guid();
        var scaleId = 'scale-' + Ext.guid();
        var tpl = me.tileTpl();
        var scale;
        var timeLine;
        var data = me.dataArray;

        var customTime;
        var currentTime;
        var timelineStore = me.timelineStore;

        var changeCustomTime = function (customDate) {
            var range;
            timeLine.setCustomTime(customDate);
            scale.setCustomTime(customDate);
            switch (me.displayMode) {
                case 'd':
                range = me.getDayRange(customDate);
                break;
                case 'w':
                range = me.getWeekRange(customDate);
                break;
                case 'm':
                range = me.getMonthRange(customDate);
                break;
            }

            timeLine.setVisibleChartRange(range[0], range[1]);
            scale.setVisibleChartRange(range[0], range[1]);
        };

        var datePicker = Ext.widget('datepicker', {
            width: 280,
            format: 'm/d/Y',
            disabledCellCls: 'green-flat',
            disabledDates: me.disabledDates,
            handler: function (picker, date) {
                customTime = date;
                changeCustomTime(date);
            }
        });

        var detailPropertyGrid = Ext.widget('detailPropertyGrid', {
            region: 'south',
            groupHeaderTitle: 'Timeline item detail',
            columnWidth: 70
        });

        var selectedMenuTagPanelStore = Ext.create('Ext.data.Store', {
            fields: ['uuid', 'idMenu', 'text', 'date', 'act<ion', 'iconCls', 'tileBG', 'uuidDesign', 'xtype', 'uuidXtype', 'parentText', 'hSize', 'vSize', 'groupTitle'],
            data: me.selectedMenuTagPanelData
        });

        var selectedMenuTagPanel = Ext.widget('selectedTagMenuList', {
            store: selectedMenuTagPanelStore,
            region: 'center',
            compactView: true,
            style: {
                'margin-left': '-48px;'
            }
        });
        var json = {
            uuidToken: Ext.connectionToken
        };

        var userStore = Ext.create('Ext.data.Store', {
            fields: ['UserName', 'avatar', 'fullName', 'timeZone', 'uuid', 'description']
        }),

        filterStore = Ext.create('Ext.data.Store', {
            fields: ['uuid', 'description']
        }),

        roleStore = Ext.create('Ext.data.Store', {
            fields: ['uuid', 'name', 'description']
        }),

        timezoneStore = Ext.create('Ext.data.Store', {
            fields: ['uuid', 'name', 'description']
        }),

        actionStore = Ext.create('Ext.data.Store', {
            fields: ['uuid', 'description', 'name']
        });

        timezoneStore.loadRawData(me.catalogs.timezoneList);
        actionStore.loadRawData(me.catalogs.actionList);
        userStore.loadRawData(me.catalogs.userList);
        roleStore.loadRawData(me.catalogs.roleList);

        var filterCombo = Ext.widget('combobox', {
            store: filterStore,
            queryMode: 'local',
            displayField: 'description',
            valueField: 'uuid',
            emptyText: 'Select a',
            style: {
                'margin': '30px 0px 0px 10px'
            },
            hidden: true,
            setOptions: function (option) {
                filterCombo.reset();
                switch (option) {
                    case 0:
                    filterCombo.emptyText = 'Select an user';
                    roleCheckBox.suspendEvents();
                    roleCheckBox.setValue(false);
                    roleCheckBox.resumeEvents();
                    filterStore.loadRawData(me.catalogs.userList);
                    break;
                    case 1:
                    filterCombo.emptyText = 'Select a role';
                    userCheckBox.suspendEvents();
                    userCheckBox.setValue(false);
                    userCheckBox.resumeEvents();
                    filterStore.loadRawData(me.catalogs.roleList);
                    break;
                }
                filterCombo.applyEmptyText();
            }
        }),
        userCheckBox = Ext.widget('checkboxfield', {
            fieldLabel: 'User',
            labelWidth: 70,
            labelAlign: 'right',
            listeners: {
                change: function (checkBox, newValue, oldValue, eOpts) {
                    userCombo.setVisible(newValue);
                    roleCombo.setVisible(!newValue);
                    roleCheckBox.suspendEvents();
                    roleCheckBox.setValue(false);
                    roleCheckBox.resumeEvents();
                    roleCombo.reset();
                }
            }
        }),

        userCombo = Ext.widget('combobox', {
            store: userStore,
            queryMode: 'local',
            displayField: 'description',
            valueField: 'uuid',
            emptyText: 'Select an user',
            style: {
                'margin': '30px 0px 0px 10px'
            },
            hidden: true
        }),

        roleCheckBox = Ext.widget('checkboxfield', {
            fieldLabel: 'Role',
            labelWidth: 70,
            labelAlign: 'right',
            listeners: {
                change: function (checkBox, newValue, oldValue, eOpts) {
                    roleCombo.setVisible(newValue);
                    userCombo.setVisible(!newValue);
                    userCheckBox.suspendEvents();
                    userCheckBox.setValue(false);
                    userCheckBox.resumeEvents();
                    userCombo.reset();
                }
            }
        }),

        roleCombo = Ext.widget('combobox', {
            store: roleStore,
            queryMode: 'local',
            displayField: 'description',
            valueField: 'uuid',
            emptyText: 'Select a role',
            style: {
                'margin': '30px 0px 0px 10px'
            },
            hidden: true
        }),

        timezoneCheckBox = Ext.widget('checkboxfield', {
            fieldLabel: 'Timezone',
            labelWidth: 70,
            labelAlign: 'right',
            hidden: true,
            listeners: {
                change: function (checkBox, newValue, oldValue, eOpts) {
                    timezoneCombo.setVisible(newValue);
                }
            }
        }),

        timezoneCombo = Ext.widget('combobox', {
            store: timezoneStore,
            queryMode: 'local',
            displayField: 'description',
            valueField: 'uuid',
            emptyText: 'Select a timezone',
            style: {
                'margin': '0 0 0 10px'
            },
            hidden: true
        }),

        actionCheckBox = Ext.widget('checkboxfield', {
            fieldLabel: 'Action',
            labelWidth: 70,
            labelAlign: 'right',
            listeners: {
                change: function (checkBox, newValue, oldValue, eOpts) {
                    actionCombo.setVisible(newValue);
                }
            }
        }),

        actionCombo = Ext.widget('combobox', {
            store: actionStore,
            queryMode: 'local',
            displayField: 'description',
            valueField: 'uuid',
            emptyText: 'Select an action',
            hidden: true,
            style: {
                'margin': '0 0 0 10px'
            }
        }),

        commentCheckBox = Ext.widget('checkboxfield', {
            fieldLabel: 'Comment',
            labelWidth: 70,
            labelAlign: 'right',
            listeners: {
                change: function (checkBox, newValue, oldValue, eOpts) {
                    commentTextField.setVisible(newValue);
                }
            }
        }),

        commentTextField = Ext.widget('textfield', {
            emptyText: 'enter comment',
            hidden: true,
            style: {
                'margin': '0 0 0 10px'
            }
        });

        var additionalFiltersPanel = Ext.widget('panel', {
            layout: 'border',
            region: 'center',
            width: 300,
            cls: 'bg-lightBlue',
            bodyCls: 'fg-white',
            bodyStyle: {
                'background': 'transparent',
                'color': 'white'
            },
            items: [{
                xtype: 'panel',
                layout: 'fit',
                region: 'north',
                width: '100%',
                title: 'Filter by',
                items: [{
                    xtype: 'container',
                    layout: 'vbox',
                    items: [{
                        xtype: 'label',
                        text: 'Filter by'
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [{
                            xtype: 'container',
                            layout: 'vbox',
                            items: [
                                userCheckBox,
                                roleCheckBox
                            ]
                        }, userCombo,roleCombo
                    ]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        timezoneCheckBox,
                        timezoneCombo
                    ]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        actionCheckBox,
                        actionCombo
                    ]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        commentCheckBox,
                        commentTextField
                    ]
                }]
            }],
            bbar: ['->', {
                text: 'Search',
                cls: 'blue-flat',
                iconCls: Ext.manifest.globals.fontBasePrefix + 'search' + Ext.manifest.globals.fontBasePostfix,
                handler: function () {
                    var searchParams = {
                        user: '',
                        role: '',
                        timezone: '',
                        action: '',
                        comment: ''
                    };
                    var paramString = [];
                    var userRecord;
                    var queryString = '';

                    if (userCheckBox.getValue()) {
                        userRecord = userStore.findRecord('uuid', userCombo.getValue());
                        searchParams.user = userRecord.get('uuid');
                        paramString.push("item.tokenInfo.uuidUser==='" + userCombo.getValue() + "'");
                        queryString = queryString + ' user=' + userRecord.get('UserName');
                    }

                    if (roleCheckBox.getValue()) {
                        var roleRecord = roleStore.findRecord('uuid', roleCombo.getValue());
                        searchParams.role = roleRecord.get('name');
                        paramString.push("item.tokenInfo.uuidRole==='" + roleCombo.getValue() + "'");
                        queryString = queryString + ' role=' + roleRecord.get('name');
                    }

                    if (timezoneCheckBox.getValue()) {
                        var timezoneRecord = timezoneStore.findRecord('uuid', timezoneCombo.getValue());
                        queryString = queryString + ' timezone=' + timezoneRecord.get('description');
                        searchParams.timezone = timezoneRecord.get('name');
                    }

                    if (actionCheckBox.getValue()) {
                        var actionRecord = actionStore.findRecord('uuid', actionCombo.getValue());
                        searchParams.action = actionRecord.get('description');
                        paramString.push("item.uuidActionName==='" + actionRecord.get('name') + "'");
                        queryString = queryString + ' action=' + actionRecord.get('description');
                    }

                    if (commentCheckBox.getValue()) {
                        searchParams.comment = commentTextField.getValue();
                        queryString = queryString + ' comment=' + commentTextField.getValue();
                    }

                    var _paramString = '',
                    filteredArray = [];

                    Ext.Array.each(paramString, function (item) {
                        _paramString = _paramString === '' ? item : _paramString + ' && ' + item;
                    });

                    var filterData = function (item, index, array) {
                        eval(_paramString) ? filteredArray.push(item) : null;
                    };

                    Ext.Array.filter(data, filterData);
                    me.dataArray = filteredArray;
                    me.fireEvent('refreshTimelineData', filteredArray, queryString);
                }
            }],
            hidden: me.filteredData
        }, selectedMenuTagPanel, detailPropertyGrid]
    });

    selectedMenuTagPanel.on('removeTag', function (tagRecord) {
        var _tagRecord = selectedMenuTagPanelStore.findRecord('uuid', tagRecord.get('uuid'));
        selectedMenuTagPanelStore.remove(_tagRecord);
    });

    var dockedPanel = Ext.widget('panel', {
        dock: 'right',
        width: 300,
        layout: 'border',
        items: [{
            xtype: 'panel',
            region: 'north',
            items: [{
                xtype: 'panel',
                layout: 'fit',
                items: [
                    datePicker
                ],
                rbar: [{
                    cls: 'red-flat',
                    iconCls: Ext.manifest.globals.fontBasePrefix + 'close' + Ext.manifest.globals.fontBasePostfix,
                    handler: function () {
                        me.close();
                    },
                    hidden: !me.filteredData
                }]
            }],
            tbar: [{
                text: ExLocale.timeLine.button.dayMode,
                flex: 1,
                hidden: me.filteredData,
                handler: function () {
                    me.displayMode = 'd';
                    changeCustomTime(customTime);
                }
            }, {
                text: ExLocale.timeLine.button.weekMode,
                flex: 1,
                hidden: me.filteredData,
                handler: function () {
                    me.displayMode = 'w';
                    changeCustomTime(customTime);
                }

            }, {
                text: ExLocale.timeLine.button.monthMode,
                flex: 1,
                hidden: me.filteredData,
                handler: function () {
                    me.displayMode = 'm';
                    changeCustomTime(customTime);
                }
            }]
        }, me.timelineType === 'general' ? additionalFiltersPanel : detailPropertyGrid ]
    });

    Ext.apply(me, {
        dockedItems: [ dockedPanel ],
        items: [{
            region: 'north',
            bodyStyle: 'padding-right: 17px;',
            width: 400,
            height: 46,
            html: '<div class ="listview" id="' + scaleId + '" style="width: 100%; height: 100%;">IT WORKS!!!!!</div>'
        }, {
            region: 'center',
            width: 400,
            autoScroll: true,
            overflowY: 'scroll',
            height: 400,
            html: '<div class ="listview" id="' + timeLineId + '" style="width: 100%; height: 100%;">IT WORKS!!!!!</div>'
        }]
    });

    if (me.timelineType === 'attachment') {
        Ext.apply(me, {
            lbar: {
                style: 'background-color: transparent;',
                items: [{
                    iconCls: Ext.manifest.globals.fontBasePrefix + 'close' + Ext.manifest.globals.fontBasePostfix,
                    style: 'font-size: 17px;',
                    cls: 'jumblack-flat',
                    handler: function () {
                        me.fireEvent('closeAttachmentHistorical');
                    }
                }]
            }
        });
    }
    me.on('afterrender', function () {
        me.getEl().mask('Generating timeline view');
        var i, iMax = 1000;
        var num = 0;
        var date = new Date(2012, 0, 1);
        if (me.dataArray.length > 0) {
            switch (me.timelineType) {
                case 'attachment':
                Ext.Array.each(me.dataArray, function (dataItem) {
                    var tplData = dataItem.content;
                    var currentDate = new Date(dataItem.start);
                    var hours = currentDate.getHours();
                    var minutes = currentDate.getMinutes();
                    var startDate = currentDate.getDate().toString() + '/' + (currentDate.getMonth() + 1).toString() + '/' + currentDate.getFullYear().toString();
                    var startTime = (hours < 10 ? '0' : '') + hours.toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString();
                    tplData.startDate = startDate;
                    tplData.startTime = startTime;
                    tplData.date = currentDate.getDate().toString() +
                    '/' + (currentDate.getMonth() + 1).toString() + '/' +
                    currentDate.getFullYear().toString() +
                    ' - ' + (hours < 10 ? '0' : '') + hours.toString() +
                    ':' + (minutes < 10 ? '0' : '') + minutes.toString();

                    Ext.apply(dataItem, {
                        start: currentDate,
                        startDate: startDate,
                        startTime: startTime,
                        content: tpl.apply(tplData)
                    });
                });
                break;
                case 'general':
                Ext.Array.each(data, function (dataItem) {
                    var _record = Ext.JSON.decode(JSON.stringify(dataItem));
                    try {
                        var tokenInfo = dataItem.tokenInfo;
                        var tplData = Ext.JSON.decode(dataItem.data);
                        var fullDate = Ext.getFullFormatedDate(dataItem.dateEvent);
                        var currentDate = new Date(fullDate);
                        var hours = currentDate.getHours();
                        var minutes = currentDate.getMinutes();
                        var startDate = currentDate.getDate().toString() + '/' + (currentDate.getMonth() + 1).toString() + '/' + currentDate.getFullYear().toString();
                        var startTime = (hours < 10 ? '0' : '') + hours.toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString();
                        tplData.startDate = startDate;
                        tplData.startTime = startTime;
                        tplData.date = currentDate.getDate().toString() +
                        '/' + (currentDate.getMonth() + 1).toString() + '/' +
                        currentDate.getFullYear().toString() +
                        ' - ' + (hours < 10 ? '0' : '') + hours.toString() +
                        ':' + (minutes < 10 ? '0' : '') + minutes.toString();
                        tplData.thumbnail = tokenInfo.userThumbnail;
                        tplData.userName = tokenInfo.uuidUserName;
                        // tplData.recordDescription = dataItem.data.record.DESCRIPTION;
                        tplData.recordDescription = dataItem.recordDescription;
                        tplData.comment = dataItem.comment;
                        tplData.menuName = dataItem.menuName;
                        Ext.apply(dataItem, {
                            start: currentDate,
                            startDate: startDate,
                            startTime: startTime,
                            content: tpl.apply(tplData),
                            dataItem: _record,
                            _data: Ext.JSON.decode(dataItem.data)
                        });
                    } catch (e) {
                        console.error(e);
                    }
                });
                break;
            }
        }

        var options = {
            'width': '100%',
            'height': '200%',
            'style': 'box',
            'box.align': 'left',
            'start': new Date(2012, 0, 1),
            'end': new Date(2012, 11, 31),
            'cluster': true,
            'axisOnTop': true,
            'groupsChangeable': false,
            'groupsOnRight': false,
            'groupMinHeight': 100,
            'groupsWidth': '100px',
            'timeChangeable': false,
            'showCustomTime': true,
            'showMajorLabels': false,
            'showMinorLabels': false
        };

        var options2 = {
            'width': '100%',
            'height': 'auto',
            'style': 'dot',
            'start': new Date(2012, 0, 1),
            'end': new Date(2012, 11, 31),
            'cluster': true,
            'axisOnTop': true,
            'groupsChangeable': false,
            'groupsWidth': '100px',
            'align': 'left',
            'timeChangeable': false,
            'showCustomTime': true,
            'groupsOnRight': false,
            'groupMinHeight': 100
        };

        var setCardEvents = function () {
            console.log("set card event method");
            var timelineData = timeLine.getData();
            Ext.Array.each(timeLine.items, function (item) {
                var itemContent = item.content;
                var timelineRecord = Ext.Array.findBy(timelineData, function (arrayItem) {
                    return arrayItem.content === itemContent;
                });
                if (timelineRecord) {
                    try {
                        if (item.dom) {
                            item.dom.addEventListener('click', Ext.bind(function (contextItem, record) {
                                setDetailPanel(record);
                            }, this, [item, timelineRecord]));
                        }
                    } catch (e) {
                        console.log('error ', e);
                    }
                    try {
                        if (item.dom) {
                            item.dom.addEventListener('dblclick', Ext.bind(function (contextItem, record) {
                                switch (me.timelineType) {
                                    case 'attachment':
                                    me.getEl().mask('Opening file...');
                                    me.fireEvent('timelineFileOpen', record, me);
                                    break;
                                    case 'general':
                                    me.fireEvent('setDetailWindow', record);
                                    break;
                                }
                            }, this, [item, timelineRecord]));
                        }
                    } catch (e) {
                        console.log('error ', e);
                    }
                }
            });
        };
        var onTimeLineRangeChange = function () {
            var range = timeLine.getVisibleChartRange();
            scale.setVisibleChartRange(range.start, range.end);
            //setCardEvents();
        };
        var onScaleRangeChange = function () {
            var range = scale.getVisibleChartRange();
            timeLine.setVisibleChartRange(range.start, range.end);
        };

        timeLine = new links.Timeline(document.getElementById(timeLineId), options);
        scale = new links.Timeline(document.getElementById(scaleId), options2);
        links.events.addListener(timeLine, 'rangechange', onTimeLineRangeChange);
        links.events.addListener(scale, 'rangechange', onScaleRangeChange);
        Ext.defer(function () {
            timeLine.draw(data);
            scale.draw([{
                'start': new Date(2012, 0, 1),
                'content': 'item 1',
                'group': 'hour2'
            }]);
            var today = new Date();
            customTime = today;
            currentTime = today;
            timeLine.setCurrentTime(today);
            scale.setCurrentTime(today);
            changeCustomTime(today);
            setCardEvents();
        }, 500);
        me.getEl().unmask();
    });
    var setDetailPanel = function (record) {
        var propertyArray = [];
        switch (me.timelineType) {
            case 'attachment':
            var storeRecordQuery = timelineStore.queryBy(function (item) {
                return item.get('uuid') === record.uuid;
            });

            if (storeRecordQuery) {
                var storeRecord = storeRecordQuery.items[0];
                var content = storeRecord.get('content');
                Ext.Array.push(propertyArray, {
                    text: 'Comment',
                    value: content.comment,
                    editable: false,
                    group: 'data'
                });
                Ext.Array.push(propertyArray, {
                    text: 'Date',
                    value: storeRecord.get('start'),
                    editable: false,
                    group: 'data',
                    renderer: function (value) {
                        var seconds = value.getSeconds();
                        var minutes = value.getMinutes();
                        var hours = value.getHours();
                        var date = value.getDate();
                        var month = value.getMonth() + 1;
                        var year = value.getFullYear();
                        return date.toString() + '/' + month.toString() + '/' + year.toString() + ' - ' + (hours < 10 ? '0' : '') + hours.toString() + ':' + (minutes < 10 ? '0' : '') + minutes.toString() + ':' + (seconds < 10 ? '0' : '') + seconds.toString();
                    }
                });
                Ext.Array.push(propertyArray, {
                    text: 'From',
                    value: Ext.getFormatDate(content.from),
                    editable: false,
                    group: 'data'
                });
                Ext.Array.push(propertyArray, {
                    text: 'Thru',
                    value: Ext.getFormatDate(content.thru),
                    editable: false,
                    group: 'data'
                });
                Ext.Array.push(propertyArray, {
                    text: 'Name',
                    value: content.name,
                    editable: false,
                    group: 'data'

                });
                Ext.Array.push(propertyArray, {
                    text: 'Description',
                    value: content.description,
                    editable: false,
                    group: 'data'

                });
                Ext.Array.push(propertyArray, {
                    text: 'Action',
                    value: storeRecord.get('group'),
                    editable: false,
                    group: 'data'

                });
                Ext.Array.push(propertyArray, {
                    text: 'User',
                    value: content.userName,
                    editable: false,
                    group: 'data' //,
                });
                Ext.Array.push(propertyArray, {
                    text: 'Type',
                    value: storeRecord.get('content').fileType,
                    editable: false,
                    group: 'data',
                    renderer: function (value) {
                        var record = me.attachmentTypeStore.findRecord('uuid', value);
                        return '<span class="' + Ext.manifest.globals.fontBasePrefix + Ext.getFileType(record.get('name')) + Ext.manifest.globals.fontBasePostfix + '"></span>';
                    }
                });
            }
            break;
            case 'general':
            var tokenInfo = record.tokenInfo;
            Ext.Array.push(propertyArray, {
                text: 'User',
                value: tokenInfo.uuidUserName,
                editable: false,
                group: 'data'
            });
            Ext.Array.push(propertyArray, {
                text: 'Action',
                value: record.uuidActionName,
                editable: false,
                group: 'data'
            });
            Ext.Array.push(propertyArray, {
                text: 'Date',
                value: Ext.getFullFormatDate(record.dateEvent),
                editable: false,
                group: 'data'
            });
            break;
        }
        detailPropertyGrid.setSource(propertyArray);
    };
    me.callParent(arguments);
},
getDayRange: function (selectedDate) {
    var firstHour = new Date(selectedDate);
    var lastHour = new Date(selectedDate);
    firstHour.setHours(0, 0, 0, 0);
    lastHour.setHours(23, 59, 59, 0);
    return [firstHour, lastHour];
},
getWeekRange: function (selectedDate) {
    var lastMonday = new Date(selectedDate);
    var nextSunday = new Date(selectedDate);
    selectedDate.setHours(0, 0, 0, 0);
    lastMonday.setDate(selectedDate.getDate() - (selectedDate.getDay() - 1));
    lastMonday.setHours(0, 0, 0, 0);
    nextSunday.setDate(selectedDate.getDate() + (7 - selectedDate.getDay()));
    nextSunday.setHours(23, 59, 59, 0);
    return [lastMonday, nextSunday];
},
getMonthRange: function (selectedDate) {
    var lastDay;
    var firstDay = new Date(selectedDate);
    selectedDate.setHours(0, 0, 0, 0);
    firstDay.setDate(1);
    firstDay.setHours(0, 0, 0, 0);
    lastDay = new Date(firstDay);
    lastDay.setMonth(firstDay.getMonth() + 1);
    lastDay.setDate(0);
    lastDay.setHours(23, 59, 59, 0);
    return [firstDay, lastDay];
}
});
