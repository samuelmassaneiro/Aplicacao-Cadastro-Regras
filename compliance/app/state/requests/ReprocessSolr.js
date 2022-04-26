//@charset UTF-8
Ext.define('compliance.state.requests.ReprocessSolr', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'PUT',
            url: '/maestro/resources/queue/objectheader/process/update',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            obj;

            Ext.getCmp('solrAdmin').lookup('result').getStore().removeAll();
            Ext.Msg.alert("Sucesso", "Registros adicionados a fila!");

            oc.fireEvent('deleteSolr', oc);      


        
        
    },

    execute: function(processId, ids) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            context;  

            oc.fireEvent('beforeDeleteSolr', oc);      

            me.requestObject.params = JSON.stringify({'process': processId, 'headers' : ids});
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
       
    }

});
