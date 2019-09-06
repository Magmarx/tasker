/**
 * Created by hmorjan on 04-Mar-16.
 */
Ext.define('Ext.ux.jsonViewer.TreePanel', {
    extend: 'Ext.tree.Panel',
    xtype: 'jsonViewerTreePanel',
    title: 'JSON Viewer',
    layout: 'fit',
    jsonData: {},
    initComponent: function() {
        var me = this,
            treeData = me.jsonToTree(me.jsonData);
        Ext.log({
            msg: 'DEBUG',
            level: 'info',
            stack: true,
            indent: 0,
            dump: me.jsonData
        });
        var store = Ext.create('Ext.data.TreeStore', {
            fields: ['leaf', 'text'],
            root: {
                expanded: true,
                children: treeData
            }
        });
        /* me.getStore= function () {
            return store;
        }; */
        me.getStoreData = function() {
            return treeData;
        };
        Ext.apply(me, {
            rootVisible: false,
            store: store,
            title: me.title
        });
        me.callParent(arguments);
    },
    jsonToTree: function(json) {
        var treeArray = [];
        for (var i in json) {
            if (json.hasOwnProperty(i)) {
                switch (typeof json[i]) {
                    case null:
                        treeArray.push({
                            text: i + ':null',
                            leaf: true
                        });
                        break;
                    case 'string':
                        treeArray.push({
                            text: '"' + i + '":"' + json[i] + '"',
                            leaf: true
                        });
                        break;
                    case 'number':
                        treeArray.push({
                            text: '"' + i + '":' + json[i],
                            leaf: true
                        });
                        break;
                    case 'boolean':
                        treeArray.push({
                            text: '"' + i + '":' + (json[i] ? 'true' : 'false'),
                            leaf: true
                        });
                        break;
                    case 'object':
                        treeArray.push({
                            text: i,
                            children: this.jsonToTree(json[i])
                        });
                        break;
                    case 'function':
                        treeArray.push({
                            text: '"' + i + '":function',
                            leaf: true
                        });
                        break;
                }
            }
        }
        return treeArray;
    }
});