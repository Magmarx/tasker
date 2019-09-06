/**
 * Created by DELL on 03/10/2014.
 */
Ext.define('Ext.ux.relationshipBuilder.view.builder.SQLSelect', {
    xtype: 'sqlselectsource',
    instanceId: null,
    config: {
        tables: null,
        fields: null,
        joins: null
    },
    constructor: function(args) {
        var me = this,
            Ex = Ext,
            ExArray = Ex.Array;

        if (args) {
            Ex.apply(me, args);
        }
        // var connectionStore = Ext.create('Ext.data.Store', {
        //    fields: ['uuid', 'to', 'miniLine2', 'miniLine1', 'line', 'from', 'bgLine', 'aBBPos'],
        //    proxy: {
        //        type: 'memory',
        //        reader: {
        //            type: 'json'
        //        }
        //    }
        // });
        // me.connectionStore = connectionStore;
        //* * private
        var getSourceData = function() {
            sourceData = [];
            if (me.sourceStore) {
                ExArray.each(me.sourceStore.data.items, function(source) {
                    // if (source.data.params.targetType === 'TV')
                    // console.log('getSourceData');
                    if (source.data.params.targetType === 'T') {
                        ExArray.push(sourceData, {
                            sourceName: source.data.name,
                            description: source.data.description,
                            uuidMenu: source.data.description,
                            targetName: source.data.params.targetName,
                            id: source.data.id
                        });
                    }
                });
            }
            return sourceData;
        };

        if (!me.tables) {
            me.tables = Ex.create('Ext.ux.relationshipBuilder.store.SourceRelationshipTable', {
                //   storeId: 'SourceRelationshipTableStore',
                groupers: ['tree']
            });
        }

        if (me.config.tables) {
            me.tables.loadData(me.config.tables);
        }
        // handle all updates on sql tables
        // me.tables.on('update', me.handleSQLTableUpdate, me);
        // me.tables.on('add', me.handleSQLTableAdd, me);
        me.tables.on('remove', me.handleSQLTableRemove, me);

        me.fields = Ex.create('Ext.ux.relationshipBuilder.store.SQLFields', {
            // storeId: 'sourceRelationshipFieldStore'
        });

        me.sources = Ex.create('Ext.ux.relationshipBuilder.store.DataSources');
        me.loadSurces = function() {
            me.sources.loadData(getSourceData());
        };

        if (me.config.sources) {
            me.sources.loadData(me.config.sources);
        } else {
            me.sources.loadData(getSourceData());
        }

        me.joins = Ex.create('Ext.ux.relationshipBuilder.store.SourceRelationshipJoin', {
            // storeId: 'JoinStore'
        });

        if (me.config.joins) {
            me.joins.loadData(me.config.joins);
        }

        me.callParent(arguments);
    },
    /* handleSQLTableUpdate: function(tableStore, table, operation){
        var me = this;
        if (operation == 'commit') {
            me.updateFieldTableData(table);
            me.updateJoinTableData(table);
        }
    }, */
    handleSQLTableRemove: function(tableStore, table) {
        var me = this,
            aJoins;
        // get table joins and remove them
        aJoins = me.getJoinsByTableId(table.get('id'));
        // loop over the joins array
        for (var i = 0, l = aJoins.length; i < l; i++) {
            // remove join from store
            me.removeJoinById(aJoins[i].get('id'));
        }
    },
    /* updateFieldTableData: function(table){
        var me = this,tableId, expression, tableAlias, sourceName;
        tableId = table.get('id');
        tableAlias = table.get('tableAlias');
        sourceName = table.get('sourceName');
        // loop over all fields of the fields store
        me.fields.each(function(field){
            // check if current field belongs to sql table
            if (field.get('tableId') == tableId) {
                if (tableAlias != '') {
                    // we have a table alias
                    expression = tableAlias + '.' + field.get('field');
                }
                else {
                    // no table alias
                    expression = sourceName + '.' + field.get('field');
                }
                field.beginEdit();
                // update the field table alias
                field.set('tableAlias', tableAlias);
                // update the field expression
                field.set('expression', expression);
                field.commit(true);
                field.endEdit();
            }
        });
    }, */
    /* updateJoinTableData: function(table){
        var me=this, joins, tableId;
        tableId = table.get('id');
        joins = me.getJoinsByTableId(tableId);
        for (var i = 0, rightTable, leftTable, joinCondition = '',l = joins.length; i < l; i++) {
            leftTable = me.getTableById(joins[i].get('leftTableId'));
            rightTable = me.getTableById(joins[i].get('rightTableId'));

            if (leftTable.get('tableAlias') != '') {
                joinCondition = joinCondition + leftTable.get('tableAlias') + '.' + joins[i].get('leftTableField') + '=';
            }
            else {
                joinCondition = joinCondition + leftTable.get('sourceName') + '.' + joins[i].get('leftTableField') + '=';
            }

            if (rightTable.get('tableAlias') != '') {
                joinCondition = joinCondition + rightTable.get('tableAlias') + '.' + joins[i].get('rightTableField');
            }
            else {
                joinCondition = joinCondition + rightTable.get('sourceName') + '.' + joins[i].get('rightTableField');
            }
            joins[i].beginEdit();
            joins[i].set('joinCondition', joinCondition);
            joins[i].commit(true);
            joins[i].endEdit();
        }
    }, */
    /* sortTablesByJoins: function(tables, oUsedTables){
        var aTables = [], me=this;
        oUsedTables = oUsedTables || {};
        // loop over tables
        for (var i = 0, aJoin, l = tables.length; i < l; i++) {
            // check if current table is a new one
            if (!oUsedTables.hasOwnProperty(tables[i].get('id'))) {
                // it is a new one
                aTables.push(tables[i]);
                // mark table as used
                oUsedTables[tables[i].get('id')] = true;
                // get any joins for the current table
                aJoin = me.getJoinsByTableId(tables[i].get('id'));
                // loop over the join tables
                for (var j = 0, joinTable, len = aJoin.length; j < len; j++) {
                    // check if it is a new join
                    if (!oUsedTables.hasOwnProperty(aJoin[j].get('id'))) {
                        // mark join as used
                        oUsedTables[aJoin[j].get('id')] = true;
                        if (tables[i].get('id') != aJoin[j].get('leftTableId')) {
                            joinTable = me.getTableById(aJoin[j].get('leftTableId'));
                            me.changeLeftRightOnJoin(aJoin[j]);
                        }
                        else {
                            joinTable = me.getTableById(aJoin[j].get('rightTableId'));
                        }
                        var oTemp = me.sortTablesByJoins([joinTable], oUsedTables);
                        oUsedTables = oTemp.oUsedTables;
                        aTables = aTables.concat(oTemp.aTables);
                    }
                }
            }
        }
        return {
            aTables: aTables,
            oUsedTables: oUsedTables
        };
    },
    changeLeftRightOnJoin: function(join){
        var me=this, leftTable, leftTableField, rightTable, rightTableField, joinCondition = '';
        // prepare new data
        leftTable = me.getTableById(join.get('rightTableId'));
        leftTableField = join.get('rightTableField');
        rightTable = me.getTableById(join.get('leftTableId'));
        rightTableField = join.get('leftTableField');
        // construct new joinCondition
        joinCondition = joinCondition + leftTable.get('sourceName') + '.' + join.get('rightTableField') + '=';
        joinCondition = joinCondition + rightTable.get('sourceName') + '.' + join.get('leftTableField');
        // start transaction
        join.beginEdit();
        // change left and right join table data
        join.set('leftTableId', leftTable.get('id'));
        join.set('leftTableField', leftTableField);
        join.set('rightTableId', rightTable.get('id'));
        join.set('rightTableField', rightTableField);
        join.set('joinCondition', joinCondition);
        // silent commit without firing store events
        // this prevents endless loop
        join.commit(true);
        join.endEdit();
        // end transaction
    },
    toString: function(){
        var me=this, sqlOutput = 'SELECT ', aJoins = [], aOutputFields = [], aTables = [], aCriteriaFields = [], aGroupFields = [], aOrderFields = [], selectFieldsSQL = '', fromSQL = '', aFromSQL = [], criteriaSQL = '', orderBySQL = '', groupBySQL = '', fieldSeparator = ', ', joinSQL = '', bFirst = true, l, h,len;
        me.fields.each(function(field){
            // should the field be a part of the output
            if (field.get('output')) {
                aOutputFields.push(field);
            }
            // any criteria
            if (field.get('criteria') != '') {
                aCriteriaFields.push(field);
            }
            // check for grouping
            if (field.get('grouping')) {
                aGroupFields.push(field);
            }
            // check for sorting
            if (field.get('sortType') != '') {
                aOrderFields.push(field);
            }
        });
        // tables
        // sorting of tables
        me.tables.each(function(table){
            aTables.push(table);
        });
        aTables = me.sortTablesByJoins(aTables).aTables;
        me.joins.each(function(join){
            aJoins.push(join);
        });
        //create fromSQL
        l = aTables.length;
        for (var k = 0, aJoin = [], oJoinTables = {}, joinCondition = '', joinType, leftTable, rightTable; k < l; k++) {
            if (k == aTables.length - 1) {
                fieldSeparator = '';
            }
            else {
                fieldSeparator = ', ';
            }
            // is the current table the first one
            if (bFirst) {
                // yes it is the first
                // table id merken
                oJoinTables[aTables[k].get('id')] = true;
                bFirst = false;
                // check if current table is not the last one in the loop
                if ((k + 1) < aTables.length) {
                    // get joins where joins leftTableID is a property of oJoinTables and joins rightTableID equal to aTables[i+1].get('id')
                    for (h = 0, len = aJoins.length; h < len; h++) {
                        if (oJoinTables.hasOwnProperty(aJoins[h].get('leftTableId')) && aJoins[h].get('rightTableId') == aTables[k + 1].get('id')) {
                            aJoin.push(aJoins[h]);
                        }
                        if (oJoinTables.hasOwnProperty(aJoins[h].get('rightTableId')) && aJoins[h].get('leftTableId') == aTables[k + 1].get('id')) {
                            me.changeLeftRightOnJoin(aJoins[h]);
                            aJoin.push(aJoins[h]);
                        }
                    }
                    // check if we have a join
                    if (aJoin.length > 0) {
                        // yes we have a join between aTables[k] and aTables[k+1] with at least one join condition
                        leftTable = aTables[k];
                        rightTable = aTables[k + 1];
                        // table id merken
                        oJoinTables[rightTable.get('id')] = true;
                        fieldSeparator = '';
                        for (j = 0, ln = aJoin.length; j < ln; j++) {
                            if (j == aJoin.length - 1) {
                                fieldSeparator = '';
                            }
                            else {
                                fieldSeparator = '\nAND ';
                            }
                            joinType = aJoin[j].get('joinType');
                            joinCondition = joinCondition + aJoin[j].get('joinCondition') + fieldSeparator;
                        }
                        // reset the join array
                        aJoin = [];
                        if (joinSQL != '') {
                            joinSQL = joinSQL + ',\n';
                        }
                        if (leftTable.get('tableAlias') != '') {
                            // we have an leftTable alias
                            joinSQL = joinSQL + leftTable.get('sourceName') + ' ' + leftTable.get('tableAlias') + ' ' + joinType + ' JOIN ';
                        }
                        else {
                            //no alias
                            joinSQL = joinSQL + leftTable.get('sourceName') + ' ' + joinType + ' JOIN ';
                        }
                        if (rightTable.get('tableAlias') != '') {
                            // we have an rightTable alias
                            joinSQL = joinSQL + rightTable.get('sourceName') + ' ' + rightTable.get('tableAlias') + ' ON ' + joinCondition;
                        }
                        else {
                            //no alias
                            joinSQL = joinSQL + rightTable.get('sourceName') + ' ON ' + joinCondition;
                        }
                        // clear joinCondition
                        joinCondition = '';

                    }
                    else {
                        // no join between aTables[i+1] and the one before
                        bFirst = true;
                        oJoinTables = {};
                        // check for tableAlias
                        if (aTables[k].get('tableAlias') != '') {
                            fromSQL = aTables[k].get('sourceName') + ' ' + aTables[k].get('tableAlias');
                        }
                        else {
                            fromSQL = aTables[k].get('sourceName');
                        }
                        aFromSQL.push(fromSQL);
                    }
                }
                else {
                    // its the last and only one in the loop
                    // check for tableAlias
                    if (aTables[k].get('tableAlias') != '') {
                        fromSQL = aTables[k].get('sourceName') + ' ' + aTables[k].get('tableAlias');
                    }
                    else {
                        fromSQL = aTables[k].get('sourceName');
                    }
                    aFromSQL.push(fromSQL);
                }
            }
            else {
                // no, it is not the first table
                bFirst = true;
                // check if current table is not the last one in the loop
                if ((k + 1) < aTables.length) {
                    // get joins where joins leftTableID is a property of oJoinTables and joins rightTableID equal to aTables[i+1].get('id')
                    for (h = 0, len = aJoins.length; h < len; h++) {
                        if (oJoinTables.hasOwnProperty(aJoins[h].get('leftTableId')) && aJoins[h].get('rightTableId') == aTables[k + 1].get('id')) {
                            aJoin.push(aJoins[h]);
                        }
                        if (oJoinTables.hasOwnProperty(aJoins[h].get('rightTableId')) && aJoins[h].get('leftTableId') == aTables[k + 1].get('id')) {
                            this.changeLeftRightOnJoin(aJoins[h]);
                            aJoin.push(aJoins[h]);
                        }
                    }
                    // check if we have a join
                    if (aJoin.length > 0) {
                        // yes we have a join between aTables[k] and aTables[k+1] with at least one join condition
                        rightTable = aTables[k + 1];
                        // table id merken
                        oJoinTables[rightTable.get('id')] = true;
                        fieldSeparator = '';
                        for (var j = 0, ln = aJoin.length; j < ln; j++) {
                            if (j == aJoin.length - 1) {
                                fieldSeparator = '';
                            }
                            else {
                                fieldSeparator = '\nAND ';
                            }
                            joinType = aJoin[j].get('joinType');
                            joinCondition = joinCondition + aJoin[j].get('joinCondition') + fieldSeparator;
                        }
                        // reset the join array
                        aJoin = [];
                        bFirst = false;
                        if (rightTable.get('tableAlias') != '') {
                            // we have an rightTable alias
                            joinSQL = joinSQL + '\n' + joinType + ' JOIN ' + rightTable.get('sourceName') + ' ' + rightTable.get('tableAlias') + ' ON ' + joinCondition;
                        }
                        else {
                            //no alias
                            joinSQL = joinSQL + '\n' + joinType + ' JOIN ' + rightTable.get('sourceName') + ' ON ' + joinCondition;
                        }
                        // clear joinCondition
                        joinCondition = '';
                    }
                    else {
                        bFirst = true;
                        oJoinTables = {};
                    }
                }
                else {
                    // its the last and only one
                    // check for tableAlias
                    oJoinTables = {};
                }
            }
        }
        fromSQL = aFromSQL.join(', ');
        if (joinSQL != '' && fromSQL != '') {
            joinSQL = joinSQL + ', ';
        }
        fromSQL = '\nFROM ' + joinSQL + fromSQL;
        // output fields
        l = aOutputFields.length;
        var i;
        for (i = 0; i < l; i++) {
            // check if it is the last array member
            if (i == aOutputFields.length - 1) {
                fieldSeparator = '';
            }
            else {
                fieldSeparator = ', ';
            }
            // yes, output
            // check alias
            if (aOutputFields[i].get('alias') != '') {
                // yes, we have an field alias
                selectFieldsSQL = selectFieldsSQL + aOutputFields[i].get('expression') + ' AS ' + aOutputFields[i].get('alias') + fieldSeparator;
            }
            else {
                // no field alias
                selectFieldsSQL = selectFieldsSQL + aOutputFields[i].get('expression') + fieldSeparator;
            }
        }
        // criteria
        l = aCriteriaFields.length;
        for (i = 0; i < l; i++) {
            if (i == 0) {
                criteriaSQL = criteriaSQL + '\nWHERE ';
            }
            else {
                criteriaSQL = criteriaSQL + 'AND ';
            }
            if (i == aCriteriaFields.length - 1) {
                fieldSeparator = '';
            }
            else {
                fieldSeparator = '\n';
            }
            criteriaSQL = criteriaSQL + aCriteriaFields[i].get('expression') + ' ' + aCriteriaFields[i].get('criteria') + fieldSeparator;
        }
        // group by
        l = aGroupFields.length;
        for (i = 0; i < l; i++) {
            // check if it is the last array member
            if (i == aGroupFields.length - 1) {
                fieldSeparator = '';
            }
            else {
                fieldSeparator = ', ';
            }
            if (i == 0) {
                groupBySQL = '\nGROUP BY ';
            }
            groupBySQL = groupBySQL + aGroupFields[i].get('expression') + fieldSeparator;
        }
        // order by
        l = aOrderFields.length;
        for (i = 0; i < l; i++) {
            // check if it is the last array member
            if (i == aOrderFields.length - 1) {
                fieldSeparator = '';
            }
            else {
                fieldSeparator = ', ';
            }
        }
        return sqlOutput + selectFieldsSQL + fromSQL + criteriaSQL + groupBySQL + orderBySQL;
    }, */
    getJoinsByTableId: function(tableId) {
        var me = this,
            aReturn = [];
        me.joins.each(function(join) {
            console.log('getJoinsByTableId');
            if (join.get('leftTableId') == tableId || join.get('rightTableId') == tableId) {
                aReturn.push(join);
            }
        });
        return aReturn;
    },
    removeSourceByName: function(tableId) {
        var me = this,
            table;
        table = me.tables.getById(tableId);
        if (table) {
            me.tables.remove(table);
        }
    },
    getTableById: function(tableID) {
        var me = this;
        return me.tables.getById(tableID);
    },
    removeFieldById: function(id) {
        var me = this,
            field;
        field = me.fieds.getById(id);
        if (field) {
            me.fields.remove(field);
        }
    },
    removeFieldsByTableId: function(name) {
        var me = this,
            aRecords = [];
        me.fields.each(function(model) {
            if (model.get('sourceName') == name) {
                aRecords.push(model);
            }
        });
        if (aRecords) {
            me.fields.remove(aRecords);
        }
    },
    addTable: function(table) {
        var me = this;
        return me.tables.add(table);
    },
    /* addFieldRecord: function(record, bOutput){
        var me=this, tableAlias, model, expression;
        // get the tableAlias
        tableAlias = me.getTableById(record.get('tableId')).get('tableAlias');
        // build the expression
        // check if the tableAlias is not an empty string
        if (tableAlias != '') {
            // alias is not an empty string
            expression = tableAlias + '.' + record.get('field');
        }
        else {
            // alias is an empty string
            expression = record.get('sourceName') + '.' + record.get('field');
        }
        // get a new field instance
        model = me.getNewField();
        // set the expression
        model.set('expression', expression);
        // set output to false per default
        model.set('output', bOutput);
        // set an id, so it is possible to remove rows if the associated table is removed
        model.set('id', record.get('id'));
        // set the field
        model.set('field', record.get('field'));
        // copy tableId to the new model instance
        model.set('tableId', record.get('tableId'));
        // copy cmp id of origin sqltable to the new model instance
        model.set('extCmpId', record.get('extCmpId'));
        me.addField(model);
    }, */
    /* addField: function(field){
        var me=this;
        me.fields.add(field);
        me.fields.sync();
    }, */
    /* getNewField: function(){
        return Ext.create('RelationshipBuilder.model.SQLFields');
    }, */
    removeJoinById: function(joinID) {
        var me = this,
            join;
        join = me.joins.getById(joinID);
        // remove object in
        if (join) {
            me.joins.remove(join);
        }
    },
    addJoin: function(join) {
        var me = this;
        me.joins.add(join);
    },
    arrayRemove: function(array, filterProperty, filterValue) {
        var Ex = Ext,
            aReturn;
        aReturn = Ex.Array.filter(array, function(item) {
            var bRemove = true;
            if (item[filterProperty] == filterValue) {
                bRemove = false;
            }
            return bRemove;
        });
        return aReturn;
    }
});