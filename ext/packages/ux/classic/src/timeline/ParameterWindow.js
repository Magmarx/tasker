/**
* Panel where all the configuration for watching the history of elements begins
* @author hmorjan on 28-Mar-16.
*/
Ext.define('Ext.ux.timeline.ParameterWindow', {
    extend: 'Ext.panel.Panel',
    requires: [
        'Ext.ux.window.Preview',
        'Ext.ux.timeline.MenuList',
        'Ext.ux.timeline.Panel'
    ],
    xtype: 'timelineParameterWindow',
    cls: 'metro v3',
    title: '',
    catalogs: {
        userList: [],
        timezoneList: [],
        actionList: [],
        roleList: []
    },
    keyField: 'uuid',
    historical: [],
    clsValue: 'blue-flat',
    menuId: '',
    generalFromMenu: false,
    byRecord: false,
    uuidMenu: "",
    recordsInformation: [],
    recordList: [],
    dateValues: {
        from: {},
        thru: {},
        fromFullFormat: null,
        thruFullFormat: null
    },
    pageLimit: 50,
    initComponent: function () {
        var me = this,
        ExLocale = Ext.localization,
        uuidBridge = Ext.manifest.gatewayBase.bridge;

        var optionSearchDataTypeStore;
        Ext.getBody().mask("Getting configurations");

        Ext.Ajax.request({
            url: Ext.getBaseUrl("historicalSystem.svc/historicals/optionSearchDateType/all", false, true),
            method: "POST",
            timeout: 360000,
            jsonData: Ext.JSON.encode({
                uuidToken: Ext.connectionToken
            }),
            callback: function (response) {
                Ext.getBody().unmask();
            },
            success: function (response) {
                var responseObject = Ext.JSON.decode(response.responseText);
                optionSearchDataTypeStore = Ext.create('Ext.data.Store', {
                    data: responseObject.OptionSearchDateType
                });
            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        }).then(function () {
            var json = {
                parameterStr: {
                    uuidToken: Ext.connectionToken
                },
                language: Ext.currentUserInfo.language
            };
            var menuListStore = Ext.create('Ext.data.Store', {
                //fields: ['uuid', 'idMenu', 'text', 'date', 'action', 'iconCls', 'tileBG', 'uuidDesign', 'xtype', 'uuidXtype', 'parentText', 'hSize', 'vSize', 'groupTitle', 'menuDisabled', 'tooltipText']
            });
            json = {
                uuidToken: Ext.connectionToken
            };
            var optionSearchValue = '';
            var selectedMenuStore = Ext.create('Ext.data.Store', {
                fields: ['uuid', 'idMenu', 'text', 'date', 'action', 'iconCls', 'tileBG', 'uuidDesign', 'xtype', 'uuidXtype', 'parentText', 'hSize', 'vSize', 'groupTitle']
            });
            me.generalFromMenu = me.generalFromMenu ? selectedMenuStore.add(me.menuRecord.data) : null;
            var optionSearchPreference = Ext.manifest.globals.historicalSetting.optionSearchPreference;
            var searchRangeCombo = Ext.widget('combobox', {
                fieldLabel: Ext.localization.timeLine.parameterWindow.form.label.position,
                store: optionSearchDataTypeStore,
                displayField: 'description',
                margin: '20, 0',
                valueField: 'name',
                allowBlank: false,
                listeners: {
                    select: function (view, records, eOpts) {
                        //okButton.setDisabled(!checkFields());
                        valueNumberField.reset();
                        var value = view.getValue();
                        switch (value) {
                            case 'dayOptionSearchDataType':
                            optionSearchValue = 'd';
                            form.setParameterItems(true, 366);
                            break;
                            case 'monthOptionSearchDataType':
                            optionSearchValue = 'w';
                            form.setParameterItems(true, 12);
                            break;
                            case 'yearOptionSearchDataType':
                            form.setParameterItems(true, 5);
                            optionSearchValue = 'm';
                            break;
                            case 'customOptionSearchDataType':
                            optionSearchValue = 'm';
                            form.setParameterItems(false);
                            break;
                        }
                        var selectionRecord = optionSearchDataTypeStore.findRecord('name', value),
                        selectionLabel = selectionRecord.get('Labels');
                        if (!Ext.Object.isEmpty(selectionLabel)) {
                            valueNumberField.setFieldLabel(selectionLabel.before);
                            valueLabel.setText(selectionLabel.after);
                        } else {
                            valueLabel.setText('');
                        }
                    }
                }
            });
            var fromDateField = Ext.widget('datefield', {
                fieldLabel: ExLocale.timeLine.parameterWindow.form.label.from,
                name: 'fromDate',
                allowBlank: false,
                maxValue: Ext.Date.add(new Date(), Ext.Date.DAY, -1),
                listeners: {
                    select: function (field, value, eOpts) {
                        var selectedDate = value;
                        me.dateValues.from = Ext.formatDate(value);
                        me.dateValues.fromFullFormat = value;
                        //okButton.setDisabled(!checkFields());
                    }
                }
            }),
            thruDateField = Ext.widget('datefield', {
                fieldLabel: ExLocale.timeLine.parameterWindow.form.label.thru,
                name: 'thruDate',
                allowBlank: false,
                maxValue: new Date(),
                listeners: {
                    select: function (field, value, eOpts) {
                        me.dateValues.thru = Ext.formatDate(value);
                        me.dateValues.thruFullFormat = value;
                        //okButton.setDisabled(!checkFields());
                    }
                }
            }),
            valueNumberField = Ext.widget('numberfield', {
                fieldLabel: ExLocale.timeLine.parameterWindow.form.label.valuePicker,
                name: 'valueNumberField',
                allowBlank: false,
                minValue: 1,
                maxValue: 5,
                listeners: {
                    change: function (picker, newValue, oldValue, eOpts) {
                        var today = new Date();
                        var newDate = '';
                        switch (searchRangeCombo.getValue()) {
                            case 'dayOptionSearchDataType':
                            newDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (parseInt(newValue)));
                            break;
                            case 'monthOptionSearchDataType':
                            newDate = new Date(today.getFullYear(), today.getMonth() - (parseInt(newValue)), today.getDate());
                            break;
                            case 'yearOptionSearchDataType':
                            newDate = new Date(today.getFullYear() - (parseInt(newValue)), today.getMonth(), today.getDate());
                            break;
                        }
                        me.dateValues = {
                            from: Ext.formatDate(newDate),
                            thru: Ext.formatDate(new Date()),
                            fromFullFormat: newDate,
                            thruFullFormat: new Date()
                        };
                        //okButton.setDisabled(!checkFields());
                    }
                }
            }),
            valueLabel = Ext.widget('label', {
                text: 'Days'
            }),
            customContainer = Ext.widget('container', {
                layout: 'anchor',
                defaults: {
                    anchor: "100%",
                    labelAlign: "right"
                },
                //padding: '10px',
                items: [
                    fromDateField,
                    thruDateField
                ],
                hidden: true
            }),
            pickerContainer = Ext.widget('container', {
                layout: 'anchor',
                defaults: {
                    anchor: "100%",
                    labelAlign: "right"
                },
                items: [
                    valueNumberField,
                    valueLabel
                ],
                hidden: true
            });
            var form = Ext.widget('form', {
                region: !me.generalFromMenu ? 'west' : 'center',
                title: "Time parameters",
                style: "border-bottom:1px solid #0277bd",
                //width: "100%",
                items: [{
                    xtype: 'container',
                    layout: 'anchor',
                    //align: 'stretch',
                    scrollable: true,
                    height: 550,
                    maxHeight: 550,
                    minHeight: 350,
                    defaults: {
                        anchor: '100%'
                    },
                    items: [
                        //!me.generalFromMenu ? selectedMenuContainer : null,
                        searchRangeCombo,
                        customContainer,
                        pickerContainer
                    ]
                }],
                setParameterItems: function (booleanValue, numberPickerValue) {
                    pickerContainer.setVisible(booleanValue);
                    customContainer.setVisible(!booleanValue);
                    booleanValue = booleanValue ? valueNumberField.setMaxValue(numberPickerValue) : null;
                },
                buttons: [
                    {
                        iconCls: Ext.manifest.globals.fontBasePrefix + 'check' + Ext.manifest.globals.fontBasePostfix,
                        text: ExLocale.timeLine.parameterWindow.button.ok,
                        ui: "green",
                        //formBind: true,
                        handler: function () {
                            var form = this.up("form"),
                            values = form.getValues(),
                            multiSelectorGrid = _selectedMenuPanel.down("multiselector"),
                            multiSelectorStore = multiSelectorGrid.getView().getStore().data.items;
                            Ext.MessageBox.show({
                                msg: Ext.localization.timeLine.parameterWindow.waitWindowMsg,
                                progressText: Ext.localization.timeLine.parameterWindow.waitWindowProgressText,
                                width: 300,
                                wait: true,
                                waitConfig: {
                                    interval: 1500,
                                    text: Ext.localization.timeLine.parameterWindow.waitMessage
                                }
                            });
                            //console.log("obtener valores", multiSelectorStore);
                            var menuSelected = multiSelectorStore;//selectedMenuStore.data.items;
                            var menuList = [];
                            Ext.Array.each(menuSelected, function (item) {
                                Ext.Array.push(menuList, item.get(me.keyField || 'UUID'));
                            });
                            Ext.apply(values, {
                                menuSelected: menuList
                            });
                            var dateArray = getDates(new Date(me.dateValues.fromFullFormat), new Date(me.dateValues.thruFullFormat));
                            var json = {
                                uuidToken: Ext.connectionToken,
                                uuidBridge: Ext.manifest.gatewayBase.bridge,
                                page: 1,
                                start: me.pageLimit,
                                limit: 50,
                                menuList: (me.byRecord) ? [me.uuidMenu] : values.menuSelected,
                                fromDate: me.dateValues.from,
                                thruDate: me.dateValues.thru,
                                byRecord: me.byRecord,
                                recordList: me.recordList
                            };
                            Ext.Ajax.request({
                                url: Ext.getBaseUrl('historicalSystem.svc/historicals/generalHistorical/all', false, true),
                                method: 'POST',
                                jsonData: Ext.JSON.encode(json),
                                callback: function () {
                                    Ext.MessageBox.hide();
                                    me.fireEvent('requestEnded');
                                },
                                success: function (response) {
                                    var result = Ext.JSON.decode(response.responseText);
                                    var catalogs = {
                                        userList: result.catalogs.userList,
                                        timezoneList: result.catalogs.timeZoneList,
                                        actionList: result.catalogs.actionList,
                                        roleList: result.catalogs.roleList
                                    };
                                    var actionStore = Ext.create("Ext.data.Store", {
                                        data: result.catalogs.actionList
                                    });
                                    me.catalogs = catalogs;
                                    var historicalArray = result.historical;
                                    Ext.Array.each(historicalArray, function (item) {
                                        Ext.apply(item, {
                                            group: item.uuidActionName
                                        });
                                    });
                                    window.hide();
                                    var multiSelectorGrid = _selectedMenuPanel.down("multiselector"),
                                    multiSelectorItems = multiSelectorGrid.getView().getStore().data.items;
                                    Ext.widget('timelineMultiViewPanel', {
                                        height: '95%',
                                        width: '100%',
                                        title: Ext.localization.timeLine.parameterWindow.timelineTabTitle,
                                        tabId: 'timeLineMultiViewPanel',
                                        tileBG: 'bg-green',
                                        tileIcon: 'mpm-fieldclassification',
                                        params: {
                                            displayMode: optionSearchValue,
                                            catalogs: catalogs,
                                            dataArray: historicalArray,
                                            disabledDates: dateArray,
                                            selectedMenuTagPanelData: multiSelectorItems,
                                            json: json,
                                            actionStore: actionStore,
                                            byRecord: me.byRecord
                                        }
                                    }).show();
                                }
                            });
                        }
                    },
                    {
                        iconCls: Ext.manifest.globals.fontBasePrefix + 'cancel' + Ext.manifest.globals.fontBasePostfix,
                        text: ExLocale.timeLine.parameterWindow.button.cancel,
                        ui: "soft-red",
                        handler: function () {
                            window.hide();
                            // Ext.mainContainer.showHomeViewTab();
                        }
                    }
                ]
            });
            var getDates = function (fromDate, thruDate) {
                var oneDay = 24 * 3600 * 1000;
                for (var d = [], ms = fromDate * 1, last = thruDate * 1; ms <= last; ms += oneDay) {
                    var currentDate = new Date(ms);
                    var day = currentDate.getDate();
                    var month = (currentDate.getMonth() + 1);
                    d.push((month < 10 ? '0' : '') + month.toString() + '/' + (day < 10 ? '0' : '') + day.toString() + '/' + currentDate.getFullYear().toString());
                }
                return d;
            };
            var checkFields = function () {
                var values = form.getValues();
                return ((selectedMenuStore.data.items.length > 0) && (values.valueNumberField !== '' || ((values.fromDate !== '') && (values.thruDate !== ''))));
            };
            var _selectedMenuPanel = Ext.widget('panel', {
                //title: ExLocale.timeLine.parameterWindow.selectedMenuPanel,
                region: 'center',
                style: "border-left:1px solid #0277bd;border-bottom:1px solid #0277bd",
                //bodyCls: 'blue-flat-static',
                scrollable: true,
                items: [
                    {
                        xtype: 'multiselector',
                        title: ExLocale.timeLine.parameterWindow.selectedMenuPanel,
                        //fieldName: 'uuid',
                        viewConfig: {
                            deferEmptyText: false,
                            emptyText: 'No menus selected'
                        },
                        columns: [
                            {
                                dataIndex: "text",
                                flex: 1,
                                renderer: function (value, metaData, record, rowIndex, colIndex, store, _view) {
                                    metaData.tdStyle = "background-color:" + record.get("tileBG") + " !important";
                                    return Ext.String.format('<div class="{0}" style="color:{3}; font-size:16px;"><span style="margin-left: 5px;">{2}-{1}</span></div>', Ext.manifest.globals.menuFontBasePrefix + record.get("iconCls"), value, record.get("parentText"), "white");
                                }
                            },
                            me.makeRemoveRowColumn()
                        ],
                        reference: "multiSelectorMenu",
                        //publishes: "value",
                        search: {
                            field: 'text',
                            store: menuListStore,
                            listeners: {
                                show: function (view, eOpts) {
                                    if (!me.searchPopup) {
                                        me.searchPopup = view;
                                    }
                                }
                            }
                        }
                    }
                ]
            });
            var window = Ext.widget('previewWindow', {
                width: '80%',
                height: 550,
                maxHeight: 550,
                minHeight: 350,
                title: me.title || ExLocale.timeLine.parameterWindow.title,
                //bodyCls: 'blue-flat-static',
                items: [{
                    xtype: 'container',
                    layout: 'border',
                    items: [
                        form, !me.generalFromMenu ? _selectedMenuPanel : null
                    ]
                }],
                closable: false,
                listeners: {
                    afterlayout: {
                        fn: function (win, layout, eOpts) {
                            win.mask(Ext.localization.settings.loader);
                        },
                        single: true
                    }
                }
            });
            var multiSelectorGrid = _selectedMenuPanel.down("multiselector"),
            multiSelectorStore = multiSelectorGrid.getView().getStore();
            me.store = multiSelectorStore;
            window.show();
            menuListStore.removeAll();
            if (!me.byRecord) {
                Ext.Ajax.request({
                    url: Ext.getBaseUrl('historicalSystem.svc/historicals/historicalMenu/all', false, true),
                    method: 'POST',
                    jsonData: JSON.stringify({
                        uuidToken: Ext.connectionToken,
                        uuidBridge: uuidBridge
                    }),
                    success: function (response) {
                        //selectedMenuContainer.loadMask.hide();
                        window.unmask();
                        var data = JSON.parse(response.responseText);
                        if (data.success) {
                            var menuStore = Ext.getStore('menuStore');
                            var menuData = [];
                            // TODO: Backend, deben de venir todos las propiedades del menu en el web service
                            Ext.Array.forEach(data.historicalMenu, function (menu, index) {
                                var menuDetail = menu.menuProperties;
                                // var menuDetail = menuStore.findRecord('uuid', menu.uuidMenu).data;
                                menuDetail.menuDisabled = !menu.hasData;
                                menuDetail.tooltipText = (!menu.hasData) ? 'No data' : '';
                                menuData.push(menuDetail);
                            });
                            menuListStore.loadData(menuData);
                        } else {
                            Ext.log({
                                msg: 'DEBUG',
                                level: 'error',
                                stack: true,
                                indent: 0,
                                dump: data.message
                            });
                        }
                    },
                    failure: function (response) {
                        selectedMenuContainer.loadMask.hide();
                        Ext.log({
                            msg: 'failure',
                            level: 'error',
                            dump: response
                        });
                    }
                });
            } else {
                menuListStore.loadData(me.recordsInformation);
                window.unmask();
            }

            me.callParent(arguments);
        });

    },

    makeRemoveRowColumn: function () {
        var me = this;
        return {
            width: 22,
            menuDisabled: true,
            tdCls: Ext.baseCSSPrefix + 'multiselector-remove',
            //tdStyle: "background-color:transparent",
            processEvent: me.processRowEvent.bind(me),
            renderer: me.renderRemoveRow,
            updater: Ext.emptyFn,
            scope: me
        };
    },
    processRowEvent: function (type, view, cell, recordIndex, cellIndex, e, record, row) {
        var body = Ext.getBody();
        if (e.type === 'click' || (e.type === 'keydown' && (e.keyCode === e.SPACE || e.keyCode === e.ENTER))) {
            // Deleting the focused row will momentarily focusLeave
            // That would dismiss the popup, so disable that.
            body.suspendFocusEvents();
            this.store.remove(record);
            body.resumeFocusEvents();
            if (this.searchPopup) {
                this.searchPopup.deselectRecords(record);
            }
        }
    },
    renderRemoveRow: function (value, metaData, record, rowIndex, colIndex, store, _view) {
        metaData.tdStyle = "background-color:" + record.get("tileBG") + ";";
        return '<span data-qtip="' + this.removeRowTip + '" role="button">' +
        this.removeRowText + '</span>';
    },
    removeRowText: '\u2716',
    removeRowTip: 'Remove this item'
});
