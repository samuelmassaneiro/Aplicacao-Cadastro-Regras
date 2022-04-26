//@charset UTF-8
Ext.define('compliance.state.requests.LoadObjectContext', {

    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
    },

    successCallback: function(response) {
        var oc = this.getObjectContextSynchronizer();
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            oc.getFormManager().resetAllComponents();
            oc.clearRecords();            
            oc.processObjectContext(obj);            
            Ext.getCmp("fieldSetHeader").setDisabled(false);
            Ext.getCmp("cardsPanel").controller.createPanelCards(obj, "all", true);
        } else {
            this.errorHandler(response);
            oc.clearProcessingServerRequest();
        }
        oc.fireEvent('loadObjectContext');
        oc.fireEvent('synchronized');


    },

    execute: function(material) {
        var me = this,
            oc = this.getObjectContextSynchronizer();
        if (me.getObjectContextSynchronizer().fireEvent('beforeLoadObjectContext') !== false && material) {
            var requestObject = {
                method: 'PUT',
                url: '/maestro/plm/resources/search/load/objecttype/3292/node/material/' + material.trim(),                
                success: this.successCallback.bind(this),
                failure: this.errorHandler.bind(this)
            };
            Ext.Ajax.request(Ext.apply(requestObject, me.defaultRequestOpts));
        } else {
            oc.fireEvent('loadObjectContext');
        }
    }

});
