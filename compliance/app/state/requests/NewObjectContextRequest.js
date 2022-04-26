//@charset UTF-8
Ext.define('compliance.state.requests.NewObjectContextRequest', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'POST',
            url: '/maestro/resources/clienttree/objectcontext/objecttypes/' + this.getObjectContextSynchronizer().objectTypeId + '/objectheader',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var oc = this.getObjectContextSynchronizer();
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            oc.getFormManager().resetAllComponents();
            oc.clearRecords();
            oc.processObjectContext(obj);   
            
            if (Ext.typeOf(this.callback) === 'function') {
                callback.call(this);
            }
        } else {
            this.errorHandler(response);
        }
        oc.fireEvent('newObjectContext', oc);
        Ext.first('#maestrogrid').getStore().removeAll();
        Ext.first('#maestrogridtwo').getStore().removeAll();
    },


    execute: function(callback) {
        var me = this;
        if (me.getObjectContextSynchronizer().fireEvent('beforeNewObjectContext') !== false) {
            this.callback = callback;
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        }
    }

});