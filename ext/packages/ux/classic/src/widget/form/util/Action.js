/**
 * @author Miguel Yax <mig_dj@hotmail.com>
 * date 10/25/2017
 * action parser
 * @class Ext.ux.widget.form.util.Action
 * dynamic action solve by universal editor field
 */
Ext.define('Ext.ux.widget.form.util.Action', {
    actionHandler: Ext.emptyFn,
    breakString:
        //<debug>
        '\n' ||
        //</debug> 
        '',
    initActions: function (field) {
        var me = this,
            tokenValue = 'value';

        if (Ext.isString(me.configData.actionData)) {
            me.configData.actionData = Ext.JSON.decode(me.configData.actionData);
        }

        var actionList = me.configData.actionData;
        var varList = ["var form = this.up('customform');"];
        var fieldList = [];

        if (actionList.length) {
            var instructions = [];

            for (var i = 0; i < actionList.length; i++) {
                var actionConfig = actionList[i];
                var list = [];

                for (var j = 0; j < actionConfig.criteria.length; j++) {
                    var item = actionConfig.criteria[j];
                    if (item) {
                        list.push(
                            me.getConnector(item.connector, j),
                            me.getPharentesis(item.criteriaData, '('),
                            Ext.isEmpty(item.field) ? tokenValue : item.field,
                            me.getOperator(item.operator),
                            item.value,
                            me.getPharentesis(item.criteriaData, ')')
                        );
                    }
                }

                if (list.length) {
                    if (!fieldList.includes(actionConfig.targetId)) {
                        varList.push(
                            'var ' +
                            actionConfig.targetId +
                            "Cmp = form.down('[actionId=" +
                            actionConfig.targetId +
                            "]');"
                        );
                        fieldList.push(actionConfig.targetId);
                    }
                    var target =
                        actionConfig.targetId +
                        'Cmp.' +
                        (actionConfig.editor ? 'editor.' : '') +
                        actionConfig.relatedMethod;
                    instructions.push(
                        'if(' + list.join('') + '){',
                        target + '(' + actionConfig.successValue + '); ',
                        '}'
                    );
                    if (!Ext.isEmpty(actionConfig.elseValue)) {
                        instructions.push('else{', target + '(' + actionConfig.elseValue + ');', '}');
                    }
                } else {
                    instructions.push('/* bad criteria definition */');
                }
            }
            if (instructions.length) {
                me.actionHandler = me.makeFunction(
                    tokenValue,
                    varList.join(me.breakString) + me.breakString + instructions.join(me.breakString)
                );


                me.editor.on('change', function (field, newValue, oldValue) {
                    me.actionHandler(newValue);
                });
            }
        }
    },
    /**
     * makeFunction constuir una funcion en base a argumentos
     * @private
     */
    makeFunction: function (args, body) {
        var me = this;
        var funcBody = 'try {' +
            me.breakString +
            body +
            me.breakString +
            '} catch (err) {  ' +
            me.breakString +
            'console.error("MPA - Dynamic Action", err)' +
            me.breakString +
            '}';

        var newFunction = new Function(
            args,
            funcBody
        );

        //<debug>

        console.log('function', newFunction.toString());
        //</debug>
        return newFunction;
    },

    /**
     * initListeners inicializa una lista de acciones hacia un objeto 
     * especificamente un custom panel
     * @param {Object} obj  `{}` objeto de destino para aplicar 
     * @param {Array} list  `[]` lista de escuchas a aplicar
     * @private
     */
    initListeners: function (obj, lista) {
        var conf = {};
        if (Ext.isArray(lista)) {
            for (var i = 0; i < lista.length; i++) {
                var item = lista[i];
                conf[item.name] = this.makeFunction(item.args, item.body);
            }
            Ext.apply(obj, { listeners: conf });
        }
    },

    /**
   * @method getOperator return operator
   * @returns {String} operator `default` description
   * @private
   */
    getOperator: function (v) {
        if (v === '=') {
            return '===';
        }
        return v;
    },
    /**
    * @method getFieldType value
    * @param {Number} code  `0` code editor field
    * @return {String} type `''` description
    * @private
    */
    getFieldType: function (code) {
        var type = 'string';

        switch (code) {
            case 0:
            case 2:
                type = 'textfield';
                break;
            case 1:
            case 6:
            case 7:
                type = 'numberfield';
                break;
            case 15:
                type = 'checkboxfield';
                break;
            case 3:
            case 5:
                type = 'datefield';
                break;
        }
        return type;
    },
    /**
     * @param {String} value  `` 
     * @param {String} token  ``       
     */
    getPharentesis: function (value, token) {
        return value ? token : '';
    },
    /**
     * @param {String} value  `` 
     * @param {String} index  ``       
     */
    getConnector: function (value, index) {
        var connector = '';
        if (index) {
            switch (value) {
                case 'AND':
                    connector = '&&';
                    break;
                case 'OR':
                    connector = '||';
                    break;
            }
        }
        return connector;
    }
});
