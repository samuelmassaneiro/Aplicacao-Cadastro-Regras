//@charset UTF-8
Ext.define('compliance.state.requests.DownloadExcelSheet', {

    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'GET',
            url: '/maestro/resources/compliance/gettemplate/',
            success: this.successCallback.bind(this),
            //failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var oc = this.getObjectContextSynchronizer();
        console.log(response)
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            console.log(obj);
        } else {
            //this.errorHandler(response);
        }
        //oc.fireEvent('loadObjectContextInMemory', oc);        
    },

    execute: function(groupId) {
        var me = this;
        var param = {'templateGroupId': groupId};
        console.log(param);
        me.requestObject.params = param;
        if (me.getObjectContextSynchronizer().fireEvent('beforeLoadObjectContextInMemory') !== false) {
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        }
    }

});