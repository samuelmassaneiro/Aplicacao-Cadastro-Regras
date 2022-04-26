//@charset UTF-8
Ext.define('compliance.state.requests.ApplyChanges', {

    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'PUT',
            timeout: 600000,
            url: '/maestro/resources/clienttree/objectcontext/applyrules',
            
            failure: this.errorHandler.bind(this)
        };
    },
  

    execute: function(event, callback) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            context;
        if (me.getObjectContextSynchronizer().fireEvent('beforeCallApplyChanges') !== false && !oc.isRemoteCalling) {
            context = oc.getModifiedRecords();
            context.Event = Ext.isArray(event) ? event : [event];
            this.requestObject.success = (response) => {
                var objectSync = this.getObjectContextSynchronizer();
                if (this.isValidJson(response.responseText)) {
                    objectSync.processObjectContext(Ext.decode(response.responseText));
                } else {
                    objectSync.errorHandler(response);
                    objectSync.clearProcessingServerRequest();
                }
                if (callback) callback(Ext.decode(response.responseText), "all");
                objectSync.fireEvent('applyChanges');
            };
            me.requestObject.params = Ext.JSON.encode(context);
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        }
    }

});
