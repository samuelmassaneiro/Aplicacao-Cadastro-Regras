//@charset UTF-8
Ext.define('compliance.state.requests.DeleteSolr', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'DELETE',
            url: '/maestro/api/objectfilters/filter/solr/delete',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            obj;

            Ext.getCmp('solrAdmin').lookup('result').getStore().removeAll();
            Ext.Msg.alert("Sucesso", "Registros removidos com sucesso");

            oc.fireEvent('deleteSolr', oc);      


        
        
    },

    execute: function(ids) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            context;  

            oc.fireEvent('beforeDeleteSolr', oc);      

            me.requestObject.params = JSON.stringify({'headers' : ids});
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
       
    }

});
