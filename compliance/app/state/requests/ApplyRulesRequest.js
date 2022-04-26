//@charset UTF-8
Ext.define('compliance.state.requests.ApplyRulesRequest', {

    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'PUT',
            url: '/maestro/resources/clienttree/objectcontext/applyrules',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var oc = this.getObjectContextSynchronizer();
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            oc.processObjectContext(obj);
        } else {
            oc.errorHandler(response);
            oc.clearProcessingServerRequest();
        }
        oc.fireEvent('applyRules');
    },

    execute: function(event) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            context;
        if (me.getObjectContextSynchronizer().fireEvent('beforeApplyRules') !== false) {
            context = oc.getModifiedRecords();
            if (!context.ObjectHeader) {
                context.ObjectHeader = {
                    ObjectType: {
                        'Id': oc.objectTypeId
                    }
                };
            }
            context.Event = [{
                'EventType': event
            }];
            me.requestObject.params = Ext.JSON.encode(context);
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        }
    }

});
