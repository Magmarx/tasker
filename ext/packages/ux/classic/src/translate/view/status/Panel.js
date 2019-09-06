Ext.define('Ext.ux.translate.view.status.Panel', {
    extend: 'Ext.grid.Panel',
    xtype: 'translationstatus',
    requires: ['Ext.ux.translate.store.Percentages'],
    selType: 'cellmodel',
    languageStore: null,
    modeTrop: false,
    initComponent: function() {
        var me = this,
            Ex = Ext,
            ElocaleTrl = Ex.localization.translationDialog,
            percentageStore = Ext.create('Ext.ux.translate.store.Percentages', {
                languageStore: me.languageStore
            });
        Ex.applyIf(me, {
            title: ElocaleTrl.grid.panel.status,
            store: percentageStore,
            columns: [
                {
                    text: ElocaleTrl.grid.column.flag,
                    dataIndex: 'initials',
                    flex: 1,
                    renderer: function(value, meta, record) {
                        {
                            if (value === 'ES') {
                                return '<img src="resources/images/spain.svg", width="36", height="36">';
                            }

                            return '<img src="resources/images/usa.svg", width="36", height="36">';
                        }
                    }
                },
                {
                    text: ElocaleTrl.grid.column.laguage,
                    dataIndex: 'description',
                    flex: 1
                },
                {
                    dataIndex: 'progress',
                    text: ElocaleTrl.grid.column.status,
                    flex: 1,
                    renderer: function(value, meta, record) {
                        console.log(value);
                        var p = Ext.create('Ext.ProgressBar', {
                            width: 100,
                            renderTo: Ext.getBody(),
                            value: value / record.get('label'),
                            text: value + '/' + record.get('label')
                        });
                        var ob = p.getEl().dom.outerHTML;
                        p.destroy();
                        return ob;
                    }
                },
                {
                    xtype: 'actioncolumn',
                    name: 'edit',
                    width: 30,
                    sortable: false,
                    hideable: false,
                    items: [
                        {
                            iconCls: me.modeTrop ? 'x-fa fa-pencil' : 'x-fa fa-eye',
                            tooltip: me.modeTrop ? Ext.localization.generic.edit : Ext.localization.generic.view,
                            scope: me,
                            handler: function(grid, rowIndex, row, col, evnt, rec) {
                                me.fireEvent('editpackagelabel', rec, me.gridTranslationPanel, me.treePanelMenu, me.languageComboField);
                            }
                        }
                    ]
                }
            ],
            setParams: function(uuidDesign, uuidMenu, load) {
                percentageStore.setParams(uuidDesign, uuidMenu, load);
            }
        });

        me.callParent(arguments);
    }
});
