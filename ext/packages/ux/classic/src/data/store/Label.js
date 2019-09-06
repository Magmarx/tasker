/**
 * @author DELL on 30/01/2015.
 * @type Ext.ux.data.store.Label
 * @type Ext.data.Store
 */
Ext.define('Ext.ux.data.store.Label', {
    extend: 'Ext.data.Store',
    storeId: 'LabelStore',
    model: 'Ext.ux.data.model.Label',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    /***
     * Method used to set the data to the label store in the following structure
     * [
     *      {
     *          referenceName   : "label-1203",
     *          name            : "uuid",
     *          reusedName      : true,
     *          value           : "User Id"
     *      },
     *      {
     *          referenceName   : "label-6562",
     *          name            : "name",
     *          reusedName      : false,
     *          value           : "User Name"
     *      }
     * ]
     * @param data
     */
    setSerializedData: function(data) {
        var me = this;

        if (typeof data === 'string') {
            data = Ext.decode(data);
        }

        me.removeAll();
        me.loadData(data);
    },
    /**
     * @method getLabelRecordByReferenceName
     * @param  {[type]}                      referenceName [description]
     * @return {[type]}                                    [description]
     */
    getLabelRecordByReferenceName: function(referenceName) {
        return this.findRecord('referenceName', referenceName, 0, 0, 0, 1);
    },
    /**
     * @method getValueByReferenceName
     * @param  {[type]}                referenceName [description]
     * @return {[type]}                              [description]
     */
    getValueByReferenceName: function(referenceName) {
        var me = this;
        if (referenceName !== '') {
            var record = me.getLabelRecordByReferenceName(referenceName);

            if (record) {
                var value = record.get('value');
                if (value && value !== '') {
                    return value;
                } else {
                    var translate = !Ext.isEmpty(record.get('name')) ? record.get('name') : record.get('text');
                    return '[' + translate + ']';
                }
            }

            return '{' + referenceName + '}';
        }

        return null;
    }
});