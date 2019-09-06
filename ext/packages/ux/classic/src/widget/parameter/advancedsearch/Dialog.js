/**
 * Created by Desar_6 on 30/01/14.
 */
Ext.define('Ext.ux.widget.parameter.advancedsearch.Dialog', {
    extend: 'Ext.window.Window',
    mixins: ['Ext.ux.widget.parameter.Util', 'Ext.ux.criteria.Util'],
    requires: ['Ext.grid.Panel', /**/
        'Ext.panel.Panel'
    ],
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    width: 600,
    maximized: true,
    height: 400,
    autoScroll: true,
    plain: true,
    modal: true,
    closable: false,
    instanceId: null,
    /**
     * At the init of the object this dialog needs a vector like this to create automatically a form to setup the values of the parameters of the dialog.
     * {
     *       "fields" : [{
     *           "text":"CAMPO",
     *           "dataIndex":"CAMPO",
     *           "type":1
     *       },{
     *           "text":"FECHA",
     *           "dataIndex":"FECHA",
     *           "type":1
     *       },{
     *           "text":"UUID",
     *           "dataIndex":"UUID",
     *           "type":0
     *       },{
     *           "text":"UUID_MATRIZ_ENTIDAD",
     *           "dataIndex":"UUID_MATRIZ_ENTIDAD",
     *           "type":0
     *       }],
     *       "grid" : [{
     *           "text":"CAMPO",
     *           "dataIndex":"CAMPO",
     *           "type":1
     *       },{
     *           "text":"FECHA",
     *           "dataIndex":"FECHA",
     *           "type":1
     *       },{
     *           "text":"UUID",
     *           "dataIndex":"UUID",
     *           "type":0
     *       },{
     *           "text":"UUID_MATRIZ_ENTIDAD",
     *           "dataIndex":"UUID_MATRIZ_ENTIDAD",
     *           "type":0
     *       }]
     *   }
     */
    initComponent: function() {
        var me = this;

        var initParameterVector = me.initParameterVector || {};
        /**
         * this is the Array where the window items going to be added lately
         * @type {Array}
         */
        var items = [];
        /**
         * in the initial config array, the property "grid" has the search fields and the display fields
         * merged all in one single array, so we need to break it apart to send the search fields to the
         * criteria panel widget as it initial config array
         * @type {Array}
         */
        var searchItems = [];
        /**
         * also we need the display fields to be mapped to the display grid
         * @type {Array}
         */
        var grid = initParameterVector.params.allColumns ? initParameterVector.params.allColumns : (initParameterVector.params.columns || []),
            params = initParameterVector.params,
            gridColumns = [],
            Ex = Ext,
            ExArray = Ex.Array,
            ExLocale = Ex.localization,
            context = Ex.getCurrentContext(me.instanceId),
            proxyRecord = context.ConnectionStore.findRecord('name', initParameterVector.proxy.configParams.name),
            modelFields = [];
        if (typeof grid === 'string') {
            grid = Ex.JSON.decode(grid);
        }

        ExArray.each(grid, function(field) {
            if (field.advancedSearch) {
                ExArray.push(searchItems, field);
            }
            if (field.grid) {
                ExArray.push(gridColumns, field);
            }
            field.name = field.dataIndex;
            field.text = field.alias;
            field.flex = 1;
            ExArray.push(modelFields, field.dataIndex);
        });
        var criteriaPanel = Ex.create('Ext.ux.widget.grid.CriteriaPanel', {
            args: {
                'fieldComboData': searchItems,
                'complete': false,
                'gridColumnsConfig': {
                    'editValueColumn': {
                        'hidden': true
                    },
                    'deleteValueColumn': {
                        'hidden': true
                    }
                }
            }
        });
        me.completeSearch = function() {
            var serializedCriteria = criteriaPanel.getSerializedData();
            serializedCriteria = me.adjustCriteriaToMatchFieldType(serializedCriteria.data);
            var EJson = Ex.JSON;
            if (serializedCriteria.length) {
                var connectionType = 'SQL',
                    proxyToken = '';
                var afterConnectionOpenCallback = function() {
                    proxyToken = connection.token;

                    var extraParams = {
                        columns: EJson.encode(grid),
                        criteria: EJson.encode(serializedCriteria),
                        targetName: params.targetName,
                        targetType: params.targetType,
                        connectionType: connectionType,
                        requestType: 'sourceAction',
                        token: proxyToken,
                        action: 'read',
                        paging: true
                    };

                    searchResultStore.removeAll();
                    searchResultStore.currentPage = 1;
                    searchResultStore.proxy.extraParams = extraParams;
                    searchResultStore.load();
                };

                if (proxyRecord) {
                    connectionType = proxyRecord.get('type');
                }

                if (proxyRecord) {
                    var connection = proxyRecord.get('connection');
                    if (connection.token === '') {
                        connection.openConnection(proxyRecord, afterConnectionOpenCallback, true);
                    } else {
                        afterConnectionOpenCallback();
                    }
                }
            } else {
                Ex.Msg.alert(ExLocale.apiName, Ext.localization.parameterSetupDialog.msgText.noCriteria);
            }
            // <debug>
            console.log(serializedCriteria);
            // </debug>
        };
        var categoryFieldSet = Ex.widget('panel', {
            title: '<b>' + ExLocale.parameterSetupDialog.advancedSearchFieldsTitle + '</b>',
            items: criteriaPanel,
            layout: 'fit',
            frame: true,
            frameHeader: false,
            titleAlign: 'right',
            height: 250,
            collapsible: true,
            buttons: [{
                    text: ExLocale.parameterSetupDialog.buttonText.search,
                    handler: me.completeSearch
                }
                /*, {
                             text: Ext.localization.parameterSetupDialog.buttonText.clear,
                             handler: function(){
                             searchResultStore.removeAll();
                             searchResultStore.currentPage=1;
                             }
                      } */
            ]
        });

        ExArray.push(items, categoryFieldSet);
        var searchResultStore = Ext.create('Ext.data.Store', {
            fields: modelFields,
            autoLoad: false,
            remoteSort: true,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    read: 'POST'
                },
                timeout: 360000,
                url: Ex.manifest.handler.connectionManager,
                reader: {
                    type: 'json',
                    root: 'rows',
                    totalProperty: 'results'
                }
            }
        });
        var searchResultGrid = Ex.widget('gridpanel', {
            flex: 1,
            columns: gridColumns,
            store: searchResultStore,
            dockedItems: [{
                xtype: 'pagingtoolbar',
                store: searchResultStore,
                dock: 'bottom',
                displayInfo: true
            }]

        });
        ExArray.push(items, searchResultGrid);
        Ex.applyIf(me, {
            title: Ext.localization.parameterSetupDialog.title.parameters,
            items: items,
            buttons: [{
                text: Ext.localization.parameterSetupDialog.buttons._continue,
                handler: function() {
                    var selectRecord = searchResultGrid.selModel.selected.items;
                    if (selectRecord.length) {
                        me.close();
                        if (me.callback) me.callback(selectRecord[0].data);
                        return true;
                    } else {
                        Ext.Msg.alert(ExLocale.apiName, ExLocale.parameterSetupDialog.msgText.noRecordSelected);
                        return false;
                    }
                }
            }, {
                text: ExLocale.parameterSetupDialog.buttons.cancel,
                handler: function() {
                    me.close();
                    if (me.closeCallback) me.closeCallback();
                    return false;
                }
            }]
        });
        me.callParent(arguments);
    }

});