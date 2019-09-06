/**
 * Created by DELL on 03/10/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.view.builder.SourceGrid', {
    extend: 'Ext.grid.Panel',
    sourceStore: null,
    instanceId: null,
    alias: 'widget.relationshipsourcegrid',
    autoScroll: true,
    layout: 'fit',
    requires: [
        'Ext.tip.QuickTipManager',
        'Ext.ux.DataTip'
    ],
    // getSourceData: function () {
    //    var me = this,
    //        Ex = Ext,
    //        context = Ex.getCurrentContext(me.instanceId)
    //        sourceStore = me.sourceStore || context.SourceStore,
    //        sourceData = [];
    //    if (sourceStore)
    //        Ex.Array.each(sourceStore.data.items, function (source)
    //        {
    //        //if (source.data.params.targetType === 'TV')
    //        // console.log('getSourceData');
    //        if (source.data.params.targetType === 'T')
    //            Ex.Array.push(sourceData, {
    //                sourceName:source.data.name,
    //                description:source.data.description,
    //                targetName: source.data.params.targetName,
    //                id: source.data.id
    //            });
    //        });
    //    return sourceData;
    // },

    initComponent: function() {
        var me = this,
            store,
            Ex = Ext;
        Ex.tip.QuickTipManager.init();

        me.on('itemcontextmenu', function(view, record, item, index, e, eOpts) {
            e.stopEvent();
        });
        me.on('containercontextmenu', function(view, e, eOpts) {
            e.stopEvent();
        });

        Ex.applyIf(me, {
            viewConfig: {
                plugins: [{
                    ddGroup: 'SourceRelationshipDDGroup',
                    ptype: 'gridviewdragdrop',
                    enableDrop: false
                }, {
                    ptype: 'datatip',
                    tpl: '{description}'
                }]
            },
            columns: [{
                text: 'Source Name',
                dataIndex: 'sourceName',
                flex: 1,
                width: 200
            }]
        });
        // Ex.define('RelationshipSourcesModel',{
        //    extend:'Ext.data.Model',
        //    fields: [
        //        'id',
        //        'sourceName',
        //        'description',
        //        'targetName',

        //    ]
        // });
        // store = Ex.create('Ext.data.Store',{
        //    model:'RelationshipSourcesModel',
        //    storeId:'relationshipSourceStore',
        //    proxy:{
        //        type:'memory',
        //        reader:'json'
        //    },
        //    autoLoad:false
        // });
        //    store = Ex.create('Ext.ux.relationshipBuilder.store.DataSources');
        // me.store=store;
        // me.store.loadData(me.getSourceData());
        me.callParent(arguments);
    }
});