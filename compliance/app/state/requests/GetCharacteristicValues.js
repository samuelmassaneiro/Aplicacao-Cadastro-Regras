//@charset UTF-8
Ext.define('compliance.state.requests.GetCharacteristicValues', {

    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'GET',
            url: '/maestro/resources/compliance/validvalues/',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var oc = this.getObjectContextSynchronizer();
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            let column = Ext.first(globalThis.value);
            let store = column.field.getStore();
            store.removeAll();
            store.add(obj);
        } else {
            this.errorHandler(response);
        }
        //oc.fireEvent('loadObjectContextInMemory', oc);        
    },

    errorHandler: function(response) {
        Ext.Msg.alert('Erro ao carregar valores', 'É necessário selecionar uma característica.', Ext.emptyFn);
    },

    execute: function(charId) {
        var me = this;
        var param = {'characteristicId': charId};
        me.requestObject.params = param;
        if (me.getObjectContextSynchronizer().fireEvent('beforeLoadObjectContextInMemory') !== false) {
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        }
    }

});
