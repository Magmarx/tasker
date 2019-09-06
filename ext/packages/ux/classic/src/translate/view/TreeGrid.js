/**
 * Created by Desar10 on 2/25/2015.
 */
Ext.define('Ext.ux.translate.view.TreeGrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'treeLazyLoading',
    rootVisible: false,
    animate: false,
    requires: ['Ext.ux.form.TreeSearchField', 'Ext.ux.translate.store.Menus'],
    mixins: {
        treeFilter: 'Ext.ux.tree.plugin.TreeFilter',
        treeFilter2: 'Ext.ux.translate.view.filter.ClassCss'
    },
    frame: true,
    storeLanguage: [],
    title: 'Menu Structure',
    reserveScrollbar: true,
    useArrows: true,
    uuidReference: null,
    headerMenu: false,
    uuidLanguage: null,
    uuidRoot: null,
    uuidModule: null,
    initComponent: function() {
        var me = this,
            Ex = Ext,
            ELocale = Ex.localization.publishDialog,
            filterTextField = Ext.widget('treesearchfield', {
                flex: 1,
                tree: me,
                paramName: 'text'
            });

        var treeStore = Ex.create('Ext.ux.translate.store.Menus'),
            prefix = Ex.fontBasePrefix;

        Ex.applyIf(me, {
            store: treeStore,
            columns: [
                {
                    dataIndex: 'text',
                    xtype: 'treecolumn',
                    flex: 1,
                    renderer: function(value, meta, record) {
                        {
                            if (!record.get('translated')) {
                                return '<span class="' + prefix + 'warning' + prefix + '"></span>' + value;
                            } else {
                                return value;
                            }
                        }
                    }
                }
            ],
            getStore: function() {
                return treeStore;
            }
        });

        me.callParent(arguments);
    }
});
