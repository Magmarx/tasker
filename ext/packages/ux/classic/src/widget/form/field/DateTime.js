/**
 * @author MYAX  03/12/2018.
 * @class Ext.ux.widget.form.field.DateTime
 * @extends Ext.form.field.ComboBox
 * @mixins Ext.ux.widget.form.field.Base
 * @xtype universalComboBox
 */
Ext.define('Ext.ux.widget.form.field.DateTime', {
    extend: 'Ext.form.FieldContainer',
    mixins: ['Ext.ux.widget.form.field.Base'],
    requires: ['Ext.form.field.Time', 'Ext.form.field.Date'],
    config: {
        value: null,
        newValue: null,
        oldValue: null,
        allowBlank: false
    },
    xtype: 'universalDateTimeField',
    // combineErrors: true,
    msgTarget: 'under',
    layout: 'hbox',
    defaults: {
        flex: 1,
        hideLabel: true
    },
    reset: function() {},
    initComponent: function() {
        var me = this;

        me.initDefaults();
        me.initStyle(me);

        var dateField = Ext.widget('datefield', {
                xtype: 'datefield',
                flex: 2,
                allowBlank: me.allowBlank,
                listeners: {
                    change: function() {
                        me.fireCustomChange();
                    }
                }
            }),
            // datetimeField = Ext.widget('datetimefield'),
            timeField = Ext.widget('timefield', {
                xtype: 'timefield',
                format: 'H:i',
                flex: 1,
                increment: 1,
                value: '00:00:0000',
                typeAhead: true,
                allowBlank: me.allowBlank,
                listeners: {
                    change: function() {
                        me.fireCustomChange();
                    }
                }
            });

        Ext.apply(me, {
            items: [dateField, timeField],
            reset: function() {
                dateField.reset();
                timeField.reset();
            },

            fireCustomChange: function() {
                if (dateField.isValid() && timeField.isValid()) {
                    var dateValue = dateField.getValue(),
                        timeValue = timeField.getValue();

                    var hour = timeValue.getHours(),
                        minutes = timeValue.getMinutes(),
                        year = dateValue.getFullYear(),
                        month = dateValue.getMonth() + 1,
                        day = dateValue.getDate(),
                        oldValue = me.getNewValue(),
                        newValue = Ext.String.format(
                            '{0}-{1}-{2} {3}:{4}:0000',
                            me.pad(year, 4),
                            me.pad(month, 2),
                            me.pad(day, 2),
                            me.pad(hour, 2),
                            me.pad(minutes, 2)
                        );
                    me.setNewValue(newValue);
                    me.setOldValue(oldValue);
                    me.fireEvent('change', me, newValue, oldValue);
                }
            },
            updateAllowBlank: function(newAllowBlank) {
                dateField.setAllowBlank(newAllowBlank);
                timeField.setAllowBlank(newAllowBlank);
            },
            updateValue: function(newValue, oldValue) {
                if (Ext.isEmpty(newValue)) {
                    me.reset();
                } else {
                    var date;
                    if (newValue instanceof Date) {
                        date = newValue;
                    } else {
                        date = new Date(newValue);
                    }
                    dateField.setValue(date);
                    timeField.setValue(date);
                }
            }
        });

        me.callParent(arguments);
    },

    /**
     * @method pad aplica una cantidad de 0 a la izquierda
     * @returns {String} str `''` resultado de aplicacion de mascara de 0
     * @private
     */
    pad: function(str, max) {
        str = (str || '').toString();
        return str.length < max ? this.pad('0' + str, max) : str;
    },
    /**
     * getList obtiene la lista de numeros con formato 00;
     * @private
     */
    getList: function(num) {
        var list = [];
        for (let i = 0; i < num; i++) {
            list.push({ value: this.pad(i, 2), text: this.pad(i, 2) });
        }
        return list;
    }
});
