/**
 * Created by Desar10 on 3/5/2015.
 */
Ext.define('Ext.ux.translate.view.filter.ClassCss', {
    filterApplyCss: function(dataKey, value, classCls) {
        this.applyCss(dataKey, value, classCls);
    },
    applyCss: function(dataKey, value, classCls, findExpand, clearFilter, callBack) {
        if (!dataKey || !value || !classCls)
        // return false;
        {
            !clearFilter || this.clearFilter();
        }
        // !findExpand || false
        var view = this.getView();
        this.getRootNode().cascadeBy(function(tree, view) {
            var treeNode = this,
                metaData = treeNode.getData();
            if (metaData[dataKey] == value) {
                treeNode.set('cls', classCls);
                if (!findExpand) {
                    var parentN = treeNode.parentNode;
                    while (parentN) {
                        // parentN.expand();
                        parentN.set('cls', classCls);
                        // treeNode.set('iconCls', Ext.manifest.globals.fontBasePrefix + 'add' + Ext.manifest.globals.fontBasePostfix);
                        parentN = parentN.parentNode;
                    }
                }
            }
            var uiNode = view.getNodeByRecord(this);
            if (uiNode) {
                Ext.get(uiNode).setDisplayed('table-row');
            }
        }, null, [this, view]);
    },
    clearFilter: function() {
        var view = this.getView();
        this.getRootNode().cascadeBy(function(tree, view) {
            var treeNode = this;
            treeNode.set('cls', '');
            var uiNode = view.getNodeByRecord(this);
            if (uiNode) {
                Ext.get(uiNode).setDisplayed('table-row');
            }
        }, null, [this, view]);
    }
});