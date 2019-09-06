/**
 * User: MYAX
 * Date: 2/23/16
 * Time: 3:28 PM
 * To change this template use File | Settings | File Templates.
 * @param  {[type]} "Ext.ux.design.FloatingToolbar" [description]
 * @return {[type]}                                  [description]
 */
Ext.define('Ext.ux.design.FloatingToolbar', {
    extend: 'Ext.container.Container',
    xtype: 'customdesigntoolbar',
    requires: [
        'Ext.toolbar.Toolbar'
    ],
    border: false,
    config: null,
    instanceMode: 'view', // add | edit | remove | update
    layout: 'fit',
    toolbarPosition: 'c',
    constrain: true,
    height: 43,
    draggable: {
        delegate: 'a.dragHandler'
    },
    shadow: true,
    floating: true,
    // define empty functions to prototype
    cancelHandler: function() {},
    cancelCallback: function() {},
    closeCallback: function() {},
    defaultCallback: function() {},
    newHandler: function() {},
    newCallback: function() {},
    removeHandler: function() {},
    removeCallback: function() {},
    saveHandler: function() {},
    saveCallback: function() {},
    updateHandler: function() {},
    updateCallback: function() {},
    initComponent: function() {
        var me = this,
            Ex = Ext,
            toolbarButtons = [],
            menuItems = [],
            ExLocale = Ex.localization,
            ExArray = Ex.Array,
            saveText = ExLocale.jsonPanel.buttons[me.instanceMode + 'Text'] || 'OK',
            toolbarIconStyle = 'font-size: 35px; border-color: transparent !important;',
            containerPanel = Ext.create('Ext.window.Window', {
                height: '100%',
                width: '100%',
                layout: 'fit'
            }); // .show();

        if (containerPanel) {
            containerPanel._floatingToolbar = undefined;
            containerPanel._updateFloatBtnPos = function() {
                if (containerPanel._floatingToolbar) {
                    var bodySize = containerPanel.body.getSize(),
                        toolbarSize = containerPanel._floatingToolbar.getSize(), // get toolbar height
                        toolbarPosition = containerPanel._floatingToolbar.getPosition(); // get toolbar position on drop

                    if (containerPanel._floatingToolbar && containerPanel._floatingToolbar.el) {
                        var posX = 0,
                            posY = bodySize.height - toolbarSize.height; // position variable initialator does not matter what number it had
                        switch (me.toolbarPosition) {
                            case 'l':
                                posX = 1; // if the position of the toolbar is on the left the static coordinate is 1
                                break;
                            case 'c':
                                posX = (bodySize.width / 2) - (toolbarSize.width / 2); // if the position is in the middle it place right on the middle of the page
                                break;
                            case 'r':
                                posX = bodySize.width - toolbarSize.width - 10; // if the position is right the static coordinate is the same width of the hole page
                                break;
                        }
                        containerPanel._floatingToolbar.setPosition(posX, posY); // show the toolbar
                    }
                }
            };

            var saveButton = Ex.widget('button', {
                    tooltip: saveText,
                    iconCls: Ext.manifest.globals.fontBasePrefix + 'save' + Ext.manifest.globals.fontBasePostfix + ' default-header-font-color',
                    name: 'saveButton',
                    cls: 'green-flat',
                    width: 40,
                    height: 40,
                    formBind: true,
                    style: toolbarIconStyle,
                    iconStyle: toolbarIconStyle
                }),
                cancelButton = Ex.widget('button', {
                    tooltip: ExLocale.jsonPanel.buttons.cancelText,
                    iconCls: Ext.manifest.globals.fontBasePrefix + 'cancel' + Ext.manifest.globals.fontBasePostfix + ' default-header-font-color',
                    cls: 'red-flat',
                    name: 'cancelButton',
                    width: 40,
                    height: 40,
                    style: toolbarIconStyle,
                    iconStyle: toolbarIconStyle,
                    handler: me.cancelHandler
                }),
                cancelMenu = Ext.widget('menuitem', {
                    text: ExLocale.jsonPanel.buttons.cancelText,
                    iconCls: Ext.manifest.globals.fontBasePrefix + 'cancel' + Ext.manifest.globals.fontBasePostfix,
                    name: 'cancelButton',
                    handler: me.cancelHandler
                }),
                saveMenu = Ex.widget('menuitem', {
                    text: saveText,
                    iconCls: Ext.manifest.globals.fontBasePrefix + 'save' + Ext.manifest.globals.fontBasePostfix,
                    handler: me.updateHandler
                }),
                createAnotherCheckbox = Ext.widget('checkbox', {
                    boxLabel: ExLocale.jsonPanel.buttons.saveOtherText,
                    cls: 'default-dark-header-font-color',
                    width: 120,
                    value: false,
                    listeners: {
                        change: function(check, newValue, oldValue, eOpts) {
                            saveButton.createAnother = newValue;
                        }
                    }
                });

            switch (me.instanceMode) {
                case 'new':
                    ExArray.push(toolbarButtons, saveButton, '-', createAnotherCheckbox, '-', cancelButton);
                    ExArray.push(menuItems, [saveMenu, '-', cancelMenu]);
                    break;
                case 'update':
                case 'remove':
                    ExArray.push(toolbarButtons, saveButton, '-', cancelButton);
                    ExArray.push(menuItems, [saveMenu, '-', cancelMenu]);
                    break;
                case 'view':
                    ExArray.push(toolbarButtons, cancelButton);
                    ExArray.push(menuItems, [cancelMenu]);
                    break;
            }
            // asigne action
            saveMenu.handler = saveButton.handler = me[me.instanceMode + 'Handler'] || function() {};

            var floatingToolbar = Ex.widget('toolbar', {
                border: false,
                cls: 'default-dark-background-color',
                style: ' border: 0px solid transparent !important;',
                items: toolbarButtons,
                flex: 1
            });

            Ex.applyIf(me, {
                constrainTo: containerPanel.id,
                items: [floatingToolbar],
                getAnotherCheckbox: function() {
                    return createAnotherCheckbox;
                },
                getCancelButton: function() {
                    return cancelButton;
                },
                getSaveButton: function() {
                    return saveButton;
                }
            });

            me.callParent(arguments);

            if (me.showMenu) {
                if (menuItems.length) {
                    console.log(menuItems);
                    if (me.dynamicToolbar) {
                        me.dynamicToolbar.setDynamicOptions([{
                            cls: 'default-header-font-color',
                            style: 'background-color: transparent !important; border: 0px solid transparent;',
                            text: '<span class = "default-dark-header-font-color" > ' + ExLocale.jsonPanel.buttons.fileText + ' </span>',
                            menu: menuItems
                        }]);
                    }
                }
            }

            containerPanel._floatingToolbar = me;
            containerPanel.on('afterrender', function() {
                containerPanel.add(me);
                me.show();
                containerPanel.addListener('afterlayout', containerPanel._updateFloatBtnPos, containerPanel);
            });

            containerPanel.addListener('beforedestroy', function() {
                containerPanel._floatingToolbar.destroy();
            }, containerPanel);

            containerPanel.addListener('beforehide', function() {
                containerPanel._floatingToolbar.hide();
            }, containerPanel);

            containerPanel.show();
        }
    }
});