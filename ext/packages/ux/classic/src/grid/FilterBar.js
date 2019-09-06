/**
 * @version 6.0.x
 * @author Leonardo D'Onofrio
 * @updated by Peter Skultety - compatibility with Ext5
 * @updated by @esanchez - compatibility with Ext6
 */
Ext.define('Ext.ux.grid.FilterBar', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.filterbar',
    uses: [
        'Ext.window.MessageBox',
        'Ext.ux.form.field.ClearButton',
        'Ext.ux.form.field.OperatorButton',
        'Ext.container.Container',
        'Ext.util.DelayedTask',
        'Ext.layout.container.HBox',
        'Ext.data.ArrayStore',
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.field.Number',
        'Ext.form.field.Date',
        'Ext.form.field.ComboBox'
    ],
    mixins: {
        observable: 'Ext.util.Observable'
    },
    /**
     * buffer time to apply filtering when typing/selecting
     * @type { Number }
     */
    updateBuffer: 800,
    /**
     * CSS class to apply to the filtered column header
     * @type { String }
     */
    columnFilteredCls: Ext.baseCSSPrefix + 'column-filtered',
    /**
     * renders the filters hidden by default, use in combination with showShowHideButton
     * @type { Boolean }
     */
    renderHidden: true,
    /**
     * add show/hide button in actioncolumn header if found, if not a new small column is created
     * @type { Boolean }
     */
    showShowHideButton: true,
    /**
     * button tooltip show
     * @type { String }
     */
    showHideButtonTooltipDo: 'Show filter bar',
    /**
     * button tooltip hide
     * @type { String }
     */
    showHideButtonTooltipUndo: 'Hide filter bar',
    /**
     * button iconCls
     * @type { String }
     */
    showHideButtonIconCls: 'filter',
    /**
     * use Ext.ux.form.field.ClearButton to allow user to clear each filter, the same as showShowHideButton
     * @type {Boolean}
     */
    showClearButton: true,
    /**
     * add clearAll button in actioncolumn header if found, if not a new small column is created
     * @type {Boolean}
     */
    showClearAllButton: true,
    /**
     * css class with the icon of the clear all button
     * @type {String}
     */
    clearAllButtonIconCls: 'clear-filters',
    /**
     * button tooltip
     * @type {String}
     */
    clearAllButtonTooltip: 'Clear all filters',
    /**
     * if no store is configured for a combo filter then stores are created automatically, if remoteFilter is true then use this property to return arrayStores from the server
     * @type {String}
     */
    autoStoresRemoteProperty: 'autoStores',
    /**
     * value send to the server to expecify null filter
     * @type {String}
     */
    autoStoresNullValue: '###NULL###',
    /**
     * NULL Display Text
     * @type {String}
     */
    autoStoresNullText: '[empty]',
    /**
     * if set to true combo autoStores are updated each time that a filter is applied
     * @type {Boolean}
     */
    autoUpdateAutoStores: false,
    /**
     * enable operator selection for number and date filters
     * @type {Boolean}
     */
    enableOperators: false,

    // operator button texts
    textEq: 'Is equal to',
    textNe: 'Is not equal to',
    textGte: 'Great than or equal',
    textLte: 'Less than or equal',
    textGt: 'Great than',
    textLt: 'Less than',

    boolTpl: {
        xtype: 'combo',
        queryMode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        editable: false,
        store: [[2, 'NO'], [1, 'YES']],
        operator: 'eq'
    },
    booleanTpl: {
        xtype: 'combo',
        queryMode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        editable: false,
        displayField: 'icon',
        valueField: 'value',
        store: Ext.create('Ext.data.ArrayStore', {
            data: [[1, 'YES'], [0, 'NO']],
            fields: ['value', 'icon']
        }),
        operator: 'eq',
        tpl: Ext.create(
            'Ext.XTemplate',
            "<tpl for='.'  >" +
                "<div class='x-boundlist-item combo' >" +
                '<tpl if="icon === \'YES\'">' +
                '<i class="x-fa fa-check-circle fa-color-success" aria-hidden="true"></i>' +
                '</tpl>' +
                '<tpl if="icon === \'NO\'">' +
                '<i class="x-fa fa-times-circle-o fa-color-danger" aria-hidden="true"></i>' +
                '</tpl>' +
                '</div>' +
                '</tpl>'
        )
    },
    dateTpl: {
        xtype: 'datefield',
        editable: true,
        submitFormat: 'Y-m-d',
        operator: 'eq'
    },
    floatTpl: {
        xtype: 'numberfield',
        allowDecimals: true,
        minValue: 0,
        hideTrigger: true,
        keyNavEnabled: false,
        mouseWheelEnabled: false,
        operator: 'eq'
    },
    intTpl: {
        xtype: 'numberfield',
        allowDecimals: false,
        minValue: 0,
        operator: 'eq'
    },
    stringTpl: {
        xtype: 'textfield',
        operator: 'like'
        // TODO: validar esto http://tfsapp:8080/tfs/PlusTI/Certificacion/Desarrollo%20MP5/_workItems?id=4674&triage=true&fullScreen=false&_a=edit
        // triggers: {
        //     search: {
        //         weight: 1,
        //         cls: Ext.baseCSSPrefix + 'form-search-trigger'
        //     }
        // }
    },
    comboTpl: {
        xtype: 'combo',
        queryMode: 'local',
        forceSelection: true,
        editable: false,
        triggerAction: 'all',
        operator: 'eq'
    },
    listTpl: {
        xtype: 'combo',
        queryMode: 'local',
        forceSelection: true,
        editable: false,
        triggerAction: 'all',
        multiSelect: true,
        operator: 'in'
    },

    constructor: function() {
        var me = this;
        me.mixins.observable.constructor.call(me);
        me.callParent(arguments);
    },

    /**
     * @private
     */
    init: function(grid) {
        var me = this;

        grid.on({
            columnresize: me.resizeContainer,
            columnhide: me.resizeContainer,
            columnshow: me.resizeContainer,
            beforedestroy: me.unsetup,
            reconfigure: me.resetup,
            scope: me
        });

        Ext.apply(grid, {
            filterBar: me,
            getFilterBar: function() {
                return this.filterBar;
            }
        });

        me.setup(grid);
    },

    // private
    setup: function(grid) {
        var me = this;

        me.grid = grid;
        me.visible = !me.renderHidden;
        me.autoStores = Ext.create('Ext.util.MixedCollection');
        me.autoStoresLoaded = false;
        me.columns = Ext.create('Ext.util.MixedCollection');
        me.containers = Ext.create('Ext.util.MixedCollection');
        me.fields = Ext.create('Ext.util.MixedCollection');
        me.actionColumn = me.grid.down('actioncolumn') || me.grid.down('actioncolumnpro');
        me.extraColumn = null;
        me.clearAllEl = null;
        me.showHideEl = null;
        me.task = Ext.create('Ext.util.DelayedTask');
        me.filterArray = [];

        // MIGARTION start
        // In Ext5 we cant override proxy method encodeProxy. And we dont need it!
        // me.overrideProxy();
        // MIGRATIN end

        me.parseFiltersConfig(); // sets me.columns and me.autoStores
        me.parseInitialFilters(); // sets me.filterArray with the store previous filters if any (adds operator and type if missing)
        me.renderExtraColumn(); // sets me.extraColumn if applicable

        // renders the filter's bar
        if (grid.rendered) {
            me.renderFilterBar(grid);
        } else {
            grid.on('afterrender', me.renderFilterBar, me, {
                single: true
            });
        }
    },

    // private
    unsetup: function(grid) {
        var me = this;
        try {
            if (me.autoStores.getCount()) {
                me.grid.store.un('load', me.fillAutoStores, me);
            }

            me.autoStores.each(function(item) {
                Ext.destroy(item);
            });
            me.autoStores.clear();
            me.autoStores = null;
            me.columns.each(function(column) {
                if (column.rendered) {
                    if (column.getEl().hasCls(me.columnFilteredCls)) {
                        column.getEl().removeCls(me.columnFilteredCls);
                    }
                }
            }, me);
            me.columns.clear();
            me.columns = null;
            me.fields.each(function(item) {
                Ext.destroy(item);
            });
            me.fields.clear();
            me.fields = null;
            me.containers.each(function(item) {
                Ext.destroy(item);
            });
            me.containers.clear();
            me.containers = null;
            if (me.clearAllEl) {
                Ext.destroy(me.clearAllEl);
                me.clearAllEl = null;
            }
            if (me.showHideEl) {
                Ext.destroy(me.showHideEl);
                me.showHideEl = null;
            }
            if (me.extraColumn) {
                me.grid.headerCt.items.remove(me.extraColumn);
                Ext.destroy(me.extraColumn);
                me.extraColumn = null;
            }
            me.task = null;
            me.filterArray = null;
        } catch (e) {
            Ext.log({ msg: e.message, level: 'error', dump: e });
        }
    },

    /**
     * @private
     */
    resetup: function(grid) {
        var me = this;

        me.unsetup(grid);
        me.setup(grid);
    },
    /**
     * @private
     */
    parseFiltersConfig: function() {
        var me = this;
        // var columns = this.grid.headerCt.getGridColumns(true);
        // changed by Richard Laffers - the above is incompatible with Ext 4.2.1
        var columns = this.grid.headerCt.getGridColumns();
        me.columns.clear();
        me.autoStores.clear();
        Ext.each(
            columns,
            function(column) {
                if (column.filter) {
                    if (column.filter === true || column.filter === 'auto') {
                        // automatic types configuration (store based)
                        // MIGRATION start
                        // var type = me.grid.store.model.prototype.fields.get(column.dataIndex).type.type;
                        // model.fields.get(..) is incompatible with Ext5.
                        // field.type.type is incompatible with Ext5. We use field.getType().
                        var type;
                        Ext.each(me.grid.store.model.prototype.fields, function(field) {
                            if (field.name === column.dataIndex) {
                                type = field.getType();
                                return false;
                            }
                        });
                        // MIGARTION end
                        if (type == 'auto') {
                            type = 'string';
                        }
                        column.filter = type;
                    }
                    if (Ext.isString(column.filter)) {
                        column.filter = {
                            type: column.filter // only set type to then use templates
                        };
                    }
                    if (column.filter.type) {
                        column.filter = Ext.applyIf(column.filter, me[column.filter.type + 'Tpl']); // also use templates but with user configuration
                    }

                    if (column.filter.xtype == 'combo' && !column.filter.store) {
                        column.autoStore = true;
                        column.filter.store = Ext.create('Ext.data.ArrayStore', {
                            fields: [
                                {
                                    name: 'text'
                                },
                                {
                                    name: 'id'
                                }
                            ]
                        });
                        me.autoStores.add(column.dataIndex, column.filter.store);
                        column.filter = Ext.apply(column.filter, {
                            displayField: 'text',
                            valueField: 'id'
                        });
                    }

                    if (!column.filter.type) {
                        switch (column.filter.xtype) {
                            case 'combo':
                                column.filter.type = column.filter.multiSelect ? 'list' : 'combo';
                                break;
                            case 'datefield':
                                column.filter.type = 'date';
                                break;
                            case 'numberfield':
                                column.filter.type = column.filter.allowDecimals ? 'float' : 'int';
                                break;
                            default:
                                column.filter.type = 'string';
                        }
                    }

                    if (!column.filter.operator) {
                        column.filter.operator = me[column.filter.type + 'Tpl'].operator;
                    }

                    me.columns.add(column.dataIndex, column);
                }
            },
            me
        );

        if (me.autoStores.getCount()) {
            if (me.grid.store.getCount() > 0) {
                me.fillAutoStores(me.grid.store);
            }
            if (me.grid.store.remoteFilter) {
                var autoStores = [];
                me.autoStores.eachKey(function(key, item) {
                    autoStores.push(key);
                });

                me.grid.store.proxy.extraParams = me.grid.store.proxy.extraParams || {};
                me.grid.store.proxy.extraParams[me.autoStoresRemoteProperty] = autoStores;
            }
            me.grid.store.on('load', me.fillAutoStores, me);
        }
    },

    // private
    fillAutoStores: function(store) {
        var me = this;
        var fieldValue;
        var data;
        var records;

        if (!me.autoUpdateAutoStores && me.autoStoresLoaded) {
            return;
        }

        me.autoStores.eachKey(function(key, item) {
            var field = me.fields.get(key);
            if (field) {
                field.suspendEvents();
                fieldValue = field.getValue();
            }
            if (!store.remoteFilter) {
                // values from local store
                data = store.collect(key, true, false).sort();
                records = [];
                Ext.each(data, function(txt) {
                    if (Ext.isEmpty(txt)) {
                        Ext.Array.insert(records, 0, [
                            {
                                text: me.autoStoresNullText,
                                id: me.autoStoresNullValue
                            }
                        ]);
                    } else {
                        records.push({
                            text: txt,
                            id: txt
                        });
                    }
                });
                item.loadData(records);
            } else {
                // values from server
                if (store.proxy.reader.rawData[me.autoStoresRemoteProperty]) {
                    data = store.proxy.reader.rawData[me.autoStoresRemoteProperty];
                    if (data[key]) {
                        records = [];
                        Ext.each(data[key].sort(), function(txt) {
                            if (Ext.isEmpty(txt)) {
                                Ext.Array.insert(records, 0, [
                                    {
                                        text: me.autoStoresNullText,
                                        id: me.autoStoresNullValue
                                    }
                                ]);
                            } else {
                                records.push({
                                    text: txt,
                                    id: txt
                                });
                            }
                        });
                        item.loadData(records);
                    }
                }
            }
            if (field) {
                field.setValue(fieldValue);
                field.resumeEvents();
            }
        }, me);
        me.autoStoresLoaded = true;
        if (me.grid.store.remoteFilter && !me.autoUpdateAutoStores) {
            delete me.grid.store.proxy.extraParams[me.autoStoresRemoteProperty];
        }
    },

    // private
    parseInitialFilters: function() {
        var me = this;

        me.filterArray = [];
        if (me.grid.store.filters) {
            me.grid.store.filters.each(function(filter) {
                // try to parse initial filters, for now filterFn is unsuported
                if (filter.property && !Ext.isEmpty(filter.value) && me.columns.get(filter.property)) {
                    if (!filter.type) {
                        filter.type = me.columns.get(filter.property).filter.type;
                    }

                    if (!filter.operator) {
                        filter.operator = me.columns.get(filter.property).filter.operator;
                    }

                    me.filterArray.push(filter);
                }
            }, me);
        }
    },

    // private
    renderExtraColumn: function() {
        var me = this;

        if (me.columns.getCount() && !me.actionColumn && (me.showClearAllButton || me.showShowHideButton)) {
            var extraColumnCssClass = Ext.baseCSSPrefix + 'filter-bar-extra-column-hack';
            if (!document.getElementById(extraColumnCssClass)) {
                var style = document.createElement('style');
                var css =
                    'tr.' +
                    Ext.baseCSSPrefix +
                    'grid-row td.' +
                    extraColumnCssClass +
                    ' { background-color: #ffffff !important; border-color: #ffffff !important; }';
                style.setAttribute('type', 'text/css');
                style.setAttribute('id', extraColumnCssClass);
                document.body.appendChild(style);
                if (style.styleSheet) {
                    // IE
                    style.styleSheet.cssText = css;
                } else {
                    // others
                    var cssNode = document.createTextNode(css);
                    style.appendChild(cssNode);
                }
            }
            me.extraColumn = Ext.create('Ext.grid.column.Column', {
                draggable: false,
                hideable: false,
                menuDisabled: true,
                sortable: false,
                resizable: false,
                fixed: true,
                width: 28,
                minWidth: 28,
                maxWidth: 28,
                header: '&nbsp;',
                tdCls: extraColumnCssClass
            });
            me.grid.headerCt.add(me.extraColumn);
        }
    },

    // private
    renderFilterBar: function(grid) {
        var me = this;

        me.containers.clear();
        me.fields.clear();
        me.columns.eachKey(function(key, column) {
            var listConfig = column.filter.listConfig || {};
            listConfig = Ext.apply(listConfig, {
                style: 'border-top-width: 1px'
            });
            var plugins = [];
            if (me.showClearButton) {
                plugins.push({
                    ptype: 'clearbutton'
                });
            }
            if (me.enableOperators && (column.filter.type == 'date' || column.filter.type == 'int' || column.filter.type == 'float')) {
                plugins.push({
                    ptype: 'operatorbutton',
                    listeners: {
                        operatorchanged: function(txt) {
                            if (Ext.isEmpty(txt.getValue())) return;
                            me.applyInstantFilters(txt);
                        }
                    },
                    // texts for the operator button items
                    texteq: me.textEq,
                    textne: me.textNe,
                    textgte: me.textGte,
                    textlte: me.textLte,
                    textgt: me.textGt,
                    textlt: me.textLt
                });
            }
            var field = Ext.widget(
                column.filter.xtype,
                Ext.apply(column.filter, {
                    dataIndex: key,
                    flex: 1,
                    margin: 0,
                    fieldStyle: 'border-left-width: 0px; border-bottom-width: 0px;',
                    listConfig: listConfig,
                    preventMark: true,
                    msgTarget: 'none',
                    checkChangeBuffer: 50,
                    enableKeyEvents: true,
                    listeners: {
                        change: me.applyDelayedFilters,
                        select: me.applyInstantFilters,
                        keypress: function(txt, e) {
                            if (e.getCharCode() == 13) {
                                e.stopEvent();
                                me.applyInstantFilters(txt);
                            }
                            return false;
                        },
                        scope: me
                    },
                    plugins: plugins
                })
            );
            me.fields.add(column.dataIndex, field);
            var container = Ext.create('Ext.container.Container', {
                dataIndex: key,
                layout: 'hbox',
                bodyStyle: 'background-color: "transparent";',
                width: column.getWidth(),
                items: [field],
                listeners: {
                    scope: me,
                    element: 'el',
                    mousedown: function(e) {
                        e.stopPropagation();
                    },
                    click: function(e) {
                        e.stopPropagation();
                    },
                    dblclick: function(e) {
                        e.stopPropagation();
                    },
                    keydown: function(e) {
                        e.stopPropagation();
                    },
                    keypress: function(e) {
                        e.stopPropagation();
                    },
                    keyup: function(e) {
                        e.stopPropagation();
                    }
                }
            });
            me.containers.add(column.dataIndex, container);
            container.render(Ext.get(column.id));
        }, me);

        var excludedCols = [];

        if (me.actionColumn) excludedCols.push(me.actionColumn.id);
        if (me.extraColumn) excludedCols.push(me.extraColumn.id);
        // Ext.each(me.grid.headerCt.getGridColumns(true), function(column) {
        // changed by Richard Laffers - the above is incompatible with Ext 4.2.1
        Ext.each(me.grid.headerCt.getGridColumns(), function(column) {
            if (!Ext.Array.contains(excludedCols, column.id)) {
                column.setPadding = Ext.Function.createInterceptor(column.setPadding, function(h) {
                    if (column.hasCls(Ext.baseCSSPrefix + 'column-header-checkbox')) {
                        // checkbox column
                        this.titleEl.setStyle({
                            paddingTop: '4px'
                        });
                    }
                    return false;
                });
            }
        });

        me.setVisible(me.visible);

        me.renderButtons();

        me.showInitialFilters();
    },

    // private
    renderButtons: function() {
        var me = this;
        var column;
        var buttonEl;
        // TODO: revisar
        // if (me.showShowHideButton && me.columns.getCount()) {
        //     column = me.actionColumn || me.extraColumn;
        //     buttonEl = column.el.first().first();
        //     me.showHideEl = Ext.get(Ext.core.DomHelper.append(buttonEl, {
        //         tag: 'div',
        //         style: 'font-size: initial;position: absolute; width: 24px; height: 24px; top: 3px; cursor: pointer; left: ' + parseInt((column.el.getWidth() - 16) / 2) + 'px',
        //         cls: 'fa fa-eye fa-color-info', // me.clearAllButtonIconCls,
        //         'data-qtip': (me.renderHidden ? me.showHideButtonTooltipDo : me.showHideButtonTooltipUndo)
        //     }));
        //     me.showHideEl.on('click', function() {
        //         me.setVisible(!me.isVisible());
        //         me.showHideEl.set({
        //             'data-qtip': (!me.isVisible() ? me.showHideButtonTooltipDo : me.showHideButtonTooltipUndo)
        //         });
        //     });
        // }

        // if (me.showClearAllButton && me.columns.getCount()) {
        //     column = me.actionColumn || me.extraColumn;
        //     buttonEl = column.el.first().first();
        //     me.clearAllEl = Ext.get(Ext.core.DomHelper.append(buttonEl, {
        //         tag: 'div',
        //         style: 'position: absolute; width: 24px; height: 24px; top: 30px; cursor: pointer; left: ' + parseInt((column.el.getWidth() - 16) / 2) + 'px',
        //         cls: 'fa fa-times fa-color-danger', // me.clearAllButtonIconCls,
        //         'data-qtip': me.clearAllButtonTooltip
        //     }));

        //     me.clearAllEl.hide();
        //     me.clearAllEl.on('click', function() {
        //         me.clearFilters();
        //     });
        // }
    },

    // private
    showInitialFilters: function() {
        var me = this;

        Ext.each(me.filterArray, function(filter) {
            var column = me.columns.get(filter.property);
            var field = me.fields.get(filter.property);
            if (!column.getEl().hasCls(me.columnFilteredCls)) {
                column.getEl().addCls(me.columnFilteredCls);
            }
            field.suspendEvents();
            field.setValue(filter.value);
            field.resumeEvents();
        });

        if (me.filterArray.length && me.showClearAllButton) {
            me.clearAllEl.show({
                duration: 1000
            });
        }
    },

    // private
    resizeContainer: function(headerCt, col) {
        var me = this;
        var dataIndex = col.dataIndex;

        if (!dataIndex) return;
        var item = me.containers.get(dataIndex);
        if (item && item.rendered) {
            var itemWidth = item.getWidth();
            var colWidth = me.columns.get(dataIndex).getWidth();
            if (itemWidth != colWidth) {
                item.setWidth(me.columns.get(dataIndex).getWidth());
                // MIGARTION start
                // doLayout() is deprecated in Ext5
                // item.doLayout();
                item.updateLayout();
                // MIGARTION end
            }
        }
    },

    // private
    applyFilters: function(field) {
        if (!field.isValid()) return;
        var me = this,
            grid = me.grid,
            column = me.columns.get(field.dataIndex),
            newVal = grid.store.remoteFilter ? field.getSubmitValue() : field.getValue();

        if (Ext.isArray(newVal) && newVal.length === 0) {
            newVal = '';
        }
        var myIndex = -1;
        Ext.each(me.filterArray, function(item2, index, allItems) {
            // MIGRATION start
            // if(item2.property === column.dataIndex) {
            if (item2.getProperty() === column.dataIndex) {
                // MIGRATION end
                myIndex = index;
            }
        });
        if (myIndex != -1) {
            me.filterArray.splice(myIndex, 1);
        }
        if (!Ext.isEmpty(newVal)) {
            if (!grid.store.remoteFilter) {
                var operator = field.operator || column.filter.operator,
                    filterFn;
                switch (operator) {
                    case 'eq':
                        filterFn = function(item) {
                            if (column.filter.type == 'date') {
                                return (
                                    (Ext.isEmpty(item.get(column.dataIndex))
                                        ? ''
                                        : Ext.Date.clearTime(item.get(column.dataIndex), true).getTime()) ==
                                    Ext.Date.clearTime(newVal, true).getTime()
                                );
                            } else {
                                return (
                                    (Ext.isEmpty(item.get(column.dataIndex)) ? me.autoStoresNullValue : item.get(column.dataIndex)) ==
                                    (Ext.isEmpty(newVal) ? me.autoStoresNullValue : newVal)
                                );
                            }
                        };
                        break;
                    case 'gte':
                        filterFn = function(item) {
                            if (column.filter.type == 'date') {
                                return Ext.isEmpty(item.get(column.dataIndex)) ? false : Ext.Date.clearTime(item.get(column.dataIndex), true).getTime() >= Ext.Date.clearTime(newVal, true).getTime();
                            } else {
                                return (
                                    (Ext.isEmpty(item.get(column.dataIndex)) ? me.autoStoresNullValue : item.get(column.dataIndex)) >=
                                    (Ext.isEmpty(newVal) ? me.autoStoresNullValue : newVal)
                                );
                            }
                        };
                        break;
                    case 'lte':
                        filterFn = function(item) {
                            if (column.filter.type == 'date') {
                                return Ext.isEmpty(item.get(column.dataIndex)) ? false : Ext.Date.clearTime(item.get(column.dataIndex), true).getTime() <= Ext.Date.clearTime(newVal, true).getTime();
                            } else {
                                return (
                                    (Ext.isEmpty(item.get(column.dataIndex)) ? me.autoStoresNullValue : item.get(column.dataIndex)) <=
                                    (Ext.isEmpty(newVal) ? me.autoStoresNullValue : newVal)
                                );
                            }
                        };
                        break;
                    case 'ne':
                        filterFn = function(item) {
                            if (column.filter.type == 'date') {
                                return (
                                    (Ext.isEmpty(item.get(column.dataIndex))
                                        ? ''
                                        : Ext.Date.clearTime(item.get(column.dataIndex), true).getTime()) !=
                                    Ext.Date.clearTime(newVal, true).getTime()
                                );
                            } else {
                                return (
                                    (Ext.isEmpty(item.get(column.dataIndex)) ? me.autoStoresNullValue : item.get(column.dataIndex)) !=
                                    (Ext.isEmpty(newVal) ? me.autoStoresNullValue : newVal)
                                );
                            }
                        };
                        break;
                    case 'like':
                        filterFn = function(item) {
                            var re = new RegExp(newVal, 'i');
                            return re.test(item.get(column.dataIndex));
                        };
                        break;
                    case 'in':
                        filterFn = function(item) {
                            var re = new RegExp('^' + newVal.join('|') + '$', 'i');
                            return re.test(Ext.isEmpty(item.get(column.dataIndex)) ? me.autoStoresNullValue : item.get(column.dataIndex));
                        };
                        break;
                }
                me.filterArray.push(
                    Ext.create('Ext.util.Filter', {
                        property: column.dataIndex,
                        filterFn: filterFn,
                        me: me
                    })
                );
            } else {
                me.filterArray.push(
                    Ext.create('Ext.util.Filter', {
                        property: column.dataIndex,
                        value: newVal,
                        type: column.filter.type,
                        operator: field.operator || column.filter.operator
                    })
                );
            }
            if (!column.getEl().hasCls(me.columnFilteredCls)) {
                column.getEl().addCls(me.columnFilteredCls);
            }
        } else {
            if (column.getEl().hasCls(me.columnFilteredCls)) {
                column.getEl().removeCls(me.columnFilteredCls);
            }
        }
        grid.store.currentPage = 1;
        if (me.filterArray.length > 0) {
            if (!grid.store.remoteFilter) {
                grid.store.clearFilter();
            }
            if (grid.store.filters) {
                grid.store.filters.clear();
            }
            // MIGRATION start
            // grid.store.filter(me.filterArray);
            grid.store.addFilter(me.filterArray);
            // MIGRATION end

            if (me.clearAllEl) {
                me.clearAllEl.show({
                    duration: 1000
                });
            }
        } else {
            grid.store.clearFilter();
            if (me.clearAllEl) {
                me.clearAllEl.hide({
                    duration: 1000
                });
            }
        }
        if (!grid.store.remoteFilter && me.autoUpdateAutoStores) {
            me.fillAutoStores();
        }
        me.fireEvent('filterupdated', me.filterArray);
    },

    // private
    applyDelayedFilters: function(field) {
        if (!field.isValid()) return;
        var me = this;

        me.task.delay(me.updateBuffer, me.applyFilters, me, [field]);
    },

    // private
    applyInstantFilters: function(field) {
        if (!field.isValid()) return;
        var me = this;

        me.task.delay(0, me.applyFilters, me, [field]);
    },

    // private
    getFirstField: function() {
        var me = this,
            field;

        // changed by Richard Laffers - the above is incompatible with Ext 4.2.1
        // Ext.each(me.grid.headerCt.getGridColumns(true), function(col) {
        Ext.each(me.grid.headerCt.getGridColumns(), function(col) {
            if (col.filter) {
                field = me.fields.get(col.dataIndex);
                return false;
            }
        });

        return field;
    },

    // private
    focusFirstField: function() {
        var me = this;

        var field = me.getFirstField();

        if (field) {
            field.focus(false, 1000);
        }
    },

    clearFilters: function() {
        var me = this;

        if (me.filterArray.length === 0) {
            return;
        }
        me.filterArray = [];
        me.fields.eachKey(function(key, field) {
            field.suspendEvents();
            field.reset();
            field.resumeEvents();
            var column = me.columns.get(key);
            if (column.getEl().hasCls(Ext.baseCSSPrefix + 'column-filtered')) {
                column.getEl().removeCls(Ext.baseCSSPrefix + 'column-filtered');
            }
        }, me);
        me.grid.store.clearFilter();
        if (me.clearAllEl) {
            me.clearAllEl.hide({
                duration: 1000
            });
        }

        me.fireEvent('filterupdated', me.filterArray);
    },

    isVisible: function() {
        var me = this;

        return me.visible;
    },

    setVisible: function(visible) {
        var me = this;

        me.containers.each(function(item) {
            item.setVisible(visible);
        });

        if (visible) {
            me.focusFirstField();
        }
        // MIGRATION start
        // doLayout() is deprecated in Ext5
        // me.grid.headerCt.doLayout();
        me.grid.headerCt.updateLayout();
        // MIGRATION end
        me.visible = visible;
    }
});
