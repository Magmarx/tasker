/**
* Created by hmorjan on 07-Apr-16.
*/
Ext.define('Ext.ux.timeline.MultiViewPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'timelineMultiViewPanel',
    requires: [
        'Ext.ux.timeline.Grid',
        'Ext.ux.timeline.Panel',
        'Ext.ux.grid.FilterBar'
    ],
    layout: 'fit',
    pageLimit: 50,
    region: 'center',
    historicalData: [],
    filterUsers: [],
    /**
    * Cardmanager reference for no refresh grid main
    * @type {Boolean}
    */
    noRefreshParent: true,
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            groupField: 'uuidRecord',
            fields: [
                'comment',
                'data',
                'dateEvent',
                'recordDescription',
                'recordName',
                'tokenInfo',
                'uuidAction',
                'uuidActionName',
                'uuidRecord',
                'menuDescription',
                'menuName',
            ],
            pageSize: me.pageLimit,
            autoLoad: true,
            // remoteFilter: true,
            // remoteSort: true,
            proxy: {
                type: 'ajax',
                enablePaging: true,
                url: Ext.getBaseUrl('historicalSystem.svc/historicals/generalHistorical/all', false, true),
                extraParams: me.params.json,
                actionMethods: {
                    create: "POST",
                    read: "POST",
                    update: "POST",
                    destroy: "POST"
                },
                paramsAsJson: true,
                reader: {
                    type: 'json',
                    rootProperty: 'historical',
                    totalProperty: 'total'
                }
            },
            listeners: {
                load: function (Store, records, successful, eOpts) {
                    Ext.Array.each(Store.data.items, function (item) {
                        Ext.apply(item.data, {
                            group: item.get("uuidActionName")
                        });
                        me.historicalData.push(item.data);
                    });
                }
            }
        });
        var columns = [{
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.action,
            dataIndex: 'uuidActionName',
            filter: true,
            type: 'string',
            renderer: function (value, metaData, record, rowIndex, colIndex, store, _view) {
                var actionRecord = me.params.actionStore.findRecord("name", value);
                return actionRecord.get("text");
            }
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.menuDescription,
            dataIndex: 'menuDescription',
            filter: true
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.username,
            dataIndex: 'fullName'
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.role,
            dataIndex: 'tokenInfo',
            renderer: function (value) {
                return value.uuidRoleName;
            }
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.module,
            dataIndex: 'tokenInfo',
            renderer: function (value) {
                return value.uuidModuleName;
            }
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.date,
            dataIndex: 'dateString'
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.recordName,
            dataIndex: 'recordName',
            filter: true
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.recordDescription,
            dataIndex: 'recordDescription',
            filter: true
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.comment,
            dataIndex: 'comment',
            filter: true,
            type: 'string'
        }, {
            text: Ext.localization.timeLine.multiViewPanel.timelineGrid.columnText.data,
            dataIndex: 'data',
            hidden: true
        }];
        M5.app.getController('DynamicFilters').onHydrateDynamicFilters(columns);
        var timelineGrid = Ext.widget('grid', {
            store: store,
            columns: {
                defaults: {
                    filter: false,
                    flex: 1
                },
                items: columns
            },
            bbar: {
                xtype: 'pagingtoolbar',
                pageSize: me.pageLimit,
                store: store,
                displayInfo: true,
                plugins: new Ext.ux.ProgressBarPager()
            },
        });

        timelineGrid.on('itemdblclick', function (_grid, record, item, index, e, eOpts) {
            var _record = record.getData();
            var dataItem = Ext.JSON.decode(JSON.stringify(record.getData()));
            Ext.apply(_record, {
                dataItem: dataItem
            });
            me.setDetailWindow(_record);
        });

        var timelinePanel = {};

        var timelineViewHandler = function (firstView) {
            timelinePanel = Ext.widget('timeLinePanelV2', {
                catalogs: me.params.catalogs,
                dataArray: me.historicalData,
                initialTime: me.params.initialTime,
                lastTime: me.params.lastTime,
                jsonDataTimeline: me.historicalData,
                disabledDates: me.params.disabledDates,
                selectedMenuTagPanelData: me.params.selectedMenuTagPanelData,
                timelineType: 'general',
                parentViewGrid: me,
                displayMode: me.params.displayMode,
                hidden: true
            });
            bodyContainer.add(timelinePanel);
            bodyContainer.getLayout().setActiveItem(timelinePanel);
            changeGridViewButton.setVisible(true);
            changeTimelineViewButton.setVisible(false);
        };

        var gridViewHandler = function () {
            bodyContainer.getLayout().setActiveItem(timelineGrid);
            changeTimelineViewButton.setVisible(true);
            changeGridViewButton.setVisible(false);
            bodyContainer.remove(timelinePanel);
            timelinePanel.destroy();
        };
        var changeTimelineViewButton = Ext.widget('button', {
            iconCls: Ext.manifest.globals.fontBasePrefix + 'comparestylesettings' + Ext.manifest.globals.fontBasePostfix,
            tooltip: Ext.localization.timeLine.multiViewPanel.timeline.timelineViewTooltip,
            handler: timelineViewHandler
        }),
        changeGridViewButton = Ext.widget('button', {
            iconCls: Ext.manifest.globals.fontBasePrefix + 'standardview' + Ext.manifest.globals.fontBasePostfix,
            tooltip: Ext.localization.timeLine.multiViewPanel.timeline.gridViewTooltip,
            handler: gridViewHandler,
            hidden: true
        });
        var bodyContainer = Ext.widget('container', {
            layout: 'card',
            items: [
                timelineGrid
            ]
        });
        Ext.apply(me, {
            tbar: [
                '->',
                changeTimelineViewButton,
                changeGridViewButton
            ],
            items: [
                bodyContainer
            ]
        });
        me.callParent(arguments);
    },
    /**
     * @param  {Object}  _record    [description]
     * @param  {Boolean} isTimeline [description]
     * @event
     */
    setDetailWindow: function (_record, isTimeline) {
        var record = !Ext.isEmpty(isTimeline) ? _record : _record.dataItem;
        var recordData = null;
        var thumbnailValue = null;
        try {
            recordData = Ext.JSON.decode(record.data);
            thumbnailValue = record.tokenInfo.userThumbnail;

        } catch (e) {
            Ext.log({
                msg: 'DEBUG',
                level: 'info',
                stack: true,
                indent: 0,
                dump: e
            });
        }

        var me = this;
        var uuidDesign = me.uuidDesign;
        if (Ext.isEmpty(uuidDesign)) {
            uuidDesign = Ext.Array.map(me.menuSelected,  function (itemMenu) {
                if (itemMenu.get('uuid') === record.uuidMenu) {
                    return itemMenu.get('uuidDesign');
                }
            });
            uuidDesign = uuidDesign[0];
        }

        me.mask(Ext.localization.generic.loading);

        Ext.M5Request('POST', Ext.getBaseUrl('historicalSystem.svc/historicals/record/date', false, true), {
            "uuidToken": Ext.connectionToken,
            "uuidBridge": Ext.manifest.gatewayBase.bridge,
            "uuidRecord": record.uuidRecord,
            "uuidMenu": record.uuidMenu,
            "combo": false,
            "date": record.dateEvent
        }).then(function (responseData) {
            Ext.M5Request('POST', Ext.getBaseUrl('optionMenu.svc/menu/desing/labels', true), {
                "uuidToken": Ext.connectionToken,
                "uuidDesign": uuidDesign,
            }).then(function (labels) {
                me.unmask();
                Ext.GlobalEvents.fireEvent(
                    'addnewchildcard',
                    'jsondiffviewerHistoricalPanelChildCard',
                    Ext.localization.timeLine.parameterWindow.timelineTabTitle,
                    Ext.widget('jsondiffviewerHistorical',{
                        labelStore: new Ext.data.Store({
                            fields: ['referenceName', 'text', 'uuid'],
                            data: labels.labelList
                        }),
                        translationStore: me.params.actionStore,
                        recordData: recordData,
                        thumbnailValue: thumbnailValue,
                        left: responseData,
                        right: record
                    })
                );
            });
        });
    }
});
