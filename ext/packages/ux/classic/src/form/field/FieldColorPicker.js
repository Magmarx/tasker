/**
 * TODO: remover lo mas pronto posible
 */
Ext.define('Ext.ux.form.field.FieldColorPicker', {
    // extend: 'Ext.container.Container',
    // requires: ['Ext.menu.ColorPicker', /**/
    //     'Ext.button.Split', /**/
    //     'Ext.ux.draw.Text' /**/
    // ],
    // value: '000000',
    // labelWidth: 100,
    // fieldLabel: 'ColorPicker',
    // showLabel:true,
    // layout: 'hbox',
    // xtype:'fieldcolorpicker',
    // showArrow: true,
    // initComponent: function(){
    //     var me=this,
    //         Ex = Ext;
    //         me.colorPicker=Ex.widget('colormenu', {
    //         value: me.value,
    //         getValue: function () {
    //             return me.colorPicker.items.items[0].value;
    //         },
    //         setValue: function (color) {
    //             me.colorPicker.items.items[0].select(color);
    //         }
    //     });
    //      me.colorButton = Ex.widget('splitbutton',{
    //         showArrow: me.showArrow,
    //         menu: me.colorPicker,
    //         setColor: function (color) {
    //             me.colorButton.setText('<div style="background-color: #'+color+'; width: 16px; height:16px"></div>');
    //         },
    //         listeners: {
    //             click: function (btn, state, eOpts) {
    //                 btn.showMenu();
    //             }
    //         }
    //     });
    //     me.colorButton.setColor(me.value);
    //     me.colorPicker.on('select', function(obj, color){
    //             me.colorButton.setColor(color);
    //     });
    //     var items = [me.colorButton];
    //     if (me.showLabel) {
    //         var fieldLabel = me.fieldLabel.trim();
    //         if (fieldLabel.indexOf(":") === fieldLabel.length - 1)
    //             fieldLabel = fieldLabel.slice(0, fieldLabel.length - 1);
    //
    //         var fieldLabelObject = Ext.create('Ext.ux.draw.Text', {
    //             padding: '4 0 0 0',
    //             text: fieldLabel + ':',
    //             flex: 1
    //         });
    //         me.fieldLabelObject = fieldLabelObject;
    //
    //         me.getFieldLabel = function () {
    //             return me.fieldLabel;
    //         };
    //         me.setFieldLabel = function (value) {
    //             value = value.trim();
    //             if (value.indexOf(":") === value.length - 1)
    //                 value = value.slice(0, value.length - 1);
    //             me.fieldLabel = value;
    //             fieldLabelObject.setText(value);
    //         };
    //         items = Ext.Array.merge([fieldLabelObject], items);
    //     }
    //     Ext.applyIf(me,{
    //         width: parseInt(me.labelWidth) +26
    //     });
    //     Ext.apply(me,{
    //         items: items
    //     });
    //     me.callParent(arguments);
    // },
    // getLabelWidth : function(){
    // return this.labelWidth;
    // },
    // setLabelWidth : function(){
    //     var me = this;
    // me.labelWidth= parseInt(me.labelWidth);
    // me.setWidth(parseInt(me.labelWidth) +26);
    // },
    // getValue: function(){
    // return this.colorPicker.getValue();
    // },
    // setValue : function(value){
    // this.colorPicker.setValue(value);
    // }
});