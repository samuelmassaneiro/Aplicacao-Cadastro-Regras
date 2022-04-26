//@charset UTF-8
Ext.define('compliance.state.requests.LoadSheet', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'GET',
            url: '/maestro/resources/compliance/loadsheet/',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            obj;
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            oc.processObjectContext(obj);
        } else {
            me.errorHandler(response);
            oc.clearProcessingServerRequest();
        }
        oc.fireEvent('save');
    },

    execute: function(pathUrl) {
        var me = this
        var param = {'url': pathUrl};
        me.requestObject.params = param;
        Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
    }
});
