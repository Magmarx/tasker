/**
 * To change this template use File | Settings | File Templates.
 * @author User: MYAX Date: 03/28/16 Time: 02:45 PM
 * @class Ext.ux.relationshipBuilder.go.store.Links
 * @extends Ext.data.Store
 */
Ext.define('Ext.ux.relationshipBuilder.go.store.Links', {
    extend: 'Ext.data.Store',
    model: 'Ext.ux.relationshipBuilder.go.model.LinkData',
    instanceId: null,
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    /*
     * @property {object} sourceMap  `{}` source hierarchical map
     */
    map: {
        name: '',
        childs: []
    },
    /**
     * Obtiene cada uno de sus items y devuelve un raw data
     * @method getSerializedData
     * @return {Array}          [description]
     */
    /**
     * @method getSourceMap description
     * @return {Object} sourceMap `{ name: '', childs: []}` description
     * @private
     */
    getMap: function() {
        var sourceMap = this.sourceMap || {
            name: '',
            childs: []
        };

        return sourceMap;
    },
    getSerializedData: function() {
        var resultData = [];
        Ext.Array.each(this.data.items, function(item) {
            resultData.push(item.getData());
        });

        return resultData;
    },
    /**
     * @method getSourcePropertyList
     * @param  {String}              pkProperty [description]
     * @param  {String}              fkProperty [description]
     * @return {Array}                         [description]
     */
    getSourcePropertyList: function(pkProperty, fkProperty) {
        var rawjoins = this.getSerializedData(),
            sourceNameList = [];

        Ext.Array.each(rawjoins, function(join) {
            if (!Ext.Array.contains(sourceNameList, join[pkProperty])) {
                Ext.Array.push(sourceNameList, join[pkProperty]);
            }
            if (!Ext.Array.contains(sourceNameList, join[fkProperty])) {
                Ext.Array.push(sourceNameList, join[fkProperty]);
            }
        });

        return sourceNameList;
    },
    /**
     * @method getSourceNameList
     * @return {Object}          [description]
     */
    getSourceNameList: function() {
        return this.getSourcePropertyList('fromName', 'toName');
    },
    /**
     * Myax:  solve loadStack mode
     * s1, s2, s3, s4, s5 = sources;
     *  s1 = isMainSource  ==> first source to  design context and this is root load fist and initialize cascade.
     *   load sources is delegate to DataSourceStore on context.
     *
     *                       childs and lookup
     *       [s1]<-------------- [s2]<------------[s5]
     *          \
     *           \ lookup
     *            \
     *             \
     *     lookup  _\/
     *  [s4]<-------[s3]
     *
     *   relationship source definition
     *
     *   join = [ {
     *        from: s1,
     *        to: s2
     *     },{
     *        from: s3,
     *        to: s1
     *       }, {
     *        from: s4,
     *        to: s3
     *   }]
     *
     *  loadStak  ==>  {
     *     cascade:    [s1, s2, s5], //  cascasde
     *     lazyLoading: [s3, s4] //    lookup
     *    }
     * @method getLoadStack
     * @return {Object}     [description]
     */
    getLoadStack: function() {
        var me = this,
            context = me.context,
            // array with all data sources name to design
            sourceNameList = me.getSourceNameList();

        var dataSourceStack = [];
        var getKeyRecursive = function(sourceStack, parentName) {
            var map = {
                name: parentName,
                childs: []
            };
            var childSourceRecords = me.query('fromName', parentName, 0, 0, 1);
            Ext.Array.each(childSourceRecords.items, function(child, index) {
                // prevent deadlook or circular reference.
                if (!Ext.Array.contains(sourceStack, child.get('toName'))) {
                    Ext.Array.push(sourceStack, child.get('toName'));
                    map.childs.push(getKeyRecursive(sourceStack, child.get('toName')));
                }
            });
            return map;
        };

        if (context) {
            var mainRecord = context.sourceStore.findRecord('isMainSource', true, 0, 0, 0, 1);
            if (mainRecord) {
                Ext.Array.push(dataSourceStack, mainRecord.get('name'));
                // call function recursive to solve priority sources charges and dependencies.
                me.map = getKeyRecursive(dataSourceStack, mainRecord.get('name'));
            }
        }

        return {
            cascade: (dataSourceStack.length > 1) ? dataSourceStack.reverse() : dataSourceStack,
            lazyLoading: Ext.Array.difference(sourceNameList, dataSourceStack),
            map: me.map
        };
    },
    setSerializedData: function(links) {
        if (typeof links === 'object') {
            if (links instanceof Array) {
                if (links.length) {
                    /**
                     * Loads an array of data straight into the Store.
                     * Using this method is great if the data is in the correct format already (e.g. it doesn't need to be processed by a reader).
                     * If your data requires processing to decode the data structure, use a Ext.data.proxy.Memory or loadRawData.
                     */
                    this.loadData(links);
                }
            }
        }
    }
});