//@charset UTF-8
Ext.define('compliance.state.requests.ExternalData', {

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
            for(i = 0; i < obj.ObjectHeader.ObjectVariant[0].ObjectValue.length; i++){
                if(obj.ObjectHeader.ObjectVariant[0].ObjectValue[i].Characteristic.Name === 'SIPWMO_DEFINE_PROCESSO_GERACAO') {
                    if(obj.ObjectHeader.ObjectVariant[0].ObjectValue[i].PropertyValue[0].Value === '00002'){
                        Ext.getCmp('configurationPanel').setDisabled(false);
                        break;
                    }else{
                        Ext.getCmp('configurationPanel').setDisabled(true);
                    }
                }                   
                
            }
            oc.clearRecords();
            oc.processObjectContext(obj);
        } else {
            this.errorHandler(response);
            oc.clearProcessingServerRequest();
        }
        oc.fireEvent('externalData');
    },

    execute: function() {
        var me = this,
            oc = this.getObjectContextSynchronizer();
        if (me.getObjectContextSynchronizer().fireEvent('beforeExternalData') !== false) {
            let requestObject = {
                    method: 'PUT',
                    url: `/maestro/sip/resources/objectcontexttree/objecttypes/${oc.objectTypeId}/newgenerateplates/`,
                    success: this.successCallback.bind(this),
                    failure: this.errorHandler.bind(this)
                },
                context = oc.getModifiedRecords();
                
            requestObject.params = Ext.JSON.encode(context);
            Ext.Ajax.request(Ext.apply(requestObject, me.defaultRequestOpts));
        } else {
            oc.fireEvent('externalData');
        }
    }

});
