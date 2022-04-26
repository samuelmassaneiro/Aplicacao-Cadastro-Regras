Ext.define('compliance.state.requests.ComboBox', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'POST',
            url: '/maestro/resources/compliance/combobox',
        }
    },

    successCallback: function(response) {
        var oc = this.getObjectContextSynchronizer();
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            oc.getFormManager().resetAllComponents();
            oc.clearRecords();
            oc.processObjectContext(obj);
        } else {
            //this.errorHandler(response);
        }
        oc.fireEvent('loadObjectContextInMemory', oc);
        //compliance.util.Config.getViewport().objectSync.executeServerRequest('savenobutton');
    },

    execute: function() {
        var me = this;
        if (me.getObjectContextSynchronizer().fireEvent('beforeLoadObjectContextInMemory') !== false) {
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        }
    }

});