Ext.define('Ext.ux.translate.store.Menus', {
    extend: 'Ext.data.TreeStore',
    model: 'Ext.ux.translate.model.Menu',
    autoLoad: true,
    uuidLanguage: null,
    uuidModule: null,
    // root: {
    //     id: 'root',
    //     expanded: false
    // },
    proxy: {
        type: 'ajax',
        url: Ext.manifest.handler.translateDesign,
        extraParams: {
            requestType: 'gmt',
            uuidLanguage: this.uuidLanguage,
            uuidModule: this.uuidModule
        },
        reader: {
            type: 'json'
        }
    },
    listeners: {
        load: function(that, response, operation) {
            var a = 1;
            console.log(response);
        },
        exception: function(that, response, operation) {
            console.log(response);
        }
    },
    getUuidLanguage: function() {
        return this.uuidLanguage;
    },
    setUuidParams: function(uuidModule, uuidLanguage, load) {
        var me = this;
        if (uuidModule && uuidLanguage && typeof uuidModule === 'string' && typeof uuidLanguage === 'string' && me.uuidLanguage !== uuidLanguage) {
            me.uuidModule = uuidModule;
            me.uuidLanguage = uuidLanguage;
            me.proxy.extraParams.uuidModule = uuidModule;
            me.proxy.extraParams.uuidLanguage = uuidLanguage;
            if (load) {
                me.load();
            }
        }
    },
    getUuidModule: function() {
        return this.uuidModule;
    }
});