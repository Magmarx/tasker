/**
 * Created by Desar_6 on 15/12/2014.
 * @param  {[type]} 'Ext.ux.design.store.DataSource' [description]
 * @return {[type]}                                   [description]
 */
Ext.define('Ext.ux.design.store.DataSource', {
    extend: 'Ext.ux.data.store.DataSource',
    autoLoad: false,
    groupField: 'group',
    /**
     * Myax: set value asign on clientside to globalparameter e.g.
     * @param {Object} arguments : An configuration like  {  value: "01ae4243-4af1-43a6-8128-0407dec44b93", globalParameterName: 'CONFIDENCELVL' }
     * @return {[type]}      [description]
     */
    changeValueByGlobalParam: function (args) {

        var me = this,
            Ex = Ext,
            ExArray = Ex.Array,
            context = me.context, // || Ex.getCurrentContext(me.instanceId),
            parameterStore = (context) ? context.parameterManagerStore : null,
            equivalentParameter = parameterStore.equivalentKey || [],
            findEquivalent = (equivalentParameter.length) ? equivalentParameter.filter(function (param, index) {
                return param.globalParameter === args.globalParameter;
            }) : [];

        if (findEquivalent.length) {
            // this is list of string with equivalents dataindex register to design e.g
            // ["UUIDCONFIDENCELEVEL", "CONFLVL"]
            var dataIndexList = [];
            ExArray.each(findEquivalent, function (equivalent, index) {
                ExArray.push(dataIndexList, equivalent.dataIndex);
            });

            if (dataIndexList.length) {
                // for n sources registered on DataSourceStore
                ExArray.each(me.data.items, function (record, index) {
                    // call function to asign value to records
                    record.get('source').setValueByGlobalParameter(args, dataIndexList);
                });
            }
        }
    }
});