/**
 * Created with IntelliJ IDEA.
 * User: MYAX
 * Date: 2/16/16
 * Time: 9:53 AM
 * To change this template use File | Settings | File Templates.
 */
Ext.define('Ext.ux.data.store.CodeFiles', {
    extend: 'Ext.data.Store',
    instanceId: null,
    namespace: 'ARCHITECT',
    name: 'custom',
    model: 'Ext.ux.data.model.CodeFile',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    },
    register: function(callback) {
        try {
            var me = this,
                Ex = Ext,
                ExArray = Ex.Array,
                repository = [],
                code = [],
                labelList = [],
                codeString = '{}',
                styleString = '',
                max = me.data.items.length,
                mainFile,
                definition = '',
                tempDefinition = '',
                labelValue = '',
                labelName = '',
                regExp = null;
            context = me.context, // Ex.getCurrentContext(me.instanceId),
                labelStore = (context) ? context.LabelStore : null,
                namespace = [me.namespace, '.', me.name, '.'].join('');

            Ext.namespace(me.namespace);

            ExArray.each(me.data.items, function(file, index) {
                if (file.get('fileType') === 'js') {
                    code = [];
                    definition = String.format(file.get('definition'), namespace);
                    labelList = definition.match(/(\[\{\w+\}\])/g) || [];
                    if (labelList.length > 2) {
                        labelList = ExArray.unique(labelList);
                    }
                    if (labelStore) {
                        ExArray.each(labelList, function(label) {
                            labelName = label.replace(/(\[\{|}\])/g, '');
                            labelValue = labelStore.getValueByReferenceName(labelName);
                            if (labelValue) {
                                regExp = new RegExp('(\\[\\{' + labelName + '\\}\\])', 'g');
                                if (regExp) {
                                    definition = definition.replace(regExp, labelValue);
                                }
                            }
                        });
                    }
                    ExArray.push(code, [
                        'Ext.define("',
                        namespace,
                        file.get('name'),
                        '",',
                        definition,
                        ');'
                    ]);
                    codeString = code.join('');
                    ExArray.push(repository, codeString);
                    eval(codeString);
                    if (max == index + 1) {
                        mainFile = file.get('name');
                    }
                } else {
                    ExArray.push(record.get('definition'));
                }
            });
            // console.log(mainFile);
            if (mainFile) {
                if (typeof callback === 'function') {
                    callback(namespace + mainFile);
                }
                return namespace + mainFile;
            }
        } catch (er) {
            console.log(er);
        }
    }
});