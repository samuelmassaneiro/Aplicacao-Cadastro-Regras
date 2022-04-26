//@charset UTF-8
Ext.define('compliance.state.requests.BlockRule', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'POST',
            url: '/maestro/resources/compliance/blockrule',
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
        compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
        Ext.ComponentQuery.query('#maestrogrid')[0].getStore().removeAll();
        Ext.ComponentQuery.query('#rulesResultGrid')[0].getStore().removeAll();
        Ext.ComponentQuery.query('#dependenciesResultGrid')[0].getStore().removeAll();
		Ext.first('#displayHeader').setValue(null);
		Ext.first('#displayId').setValue(null);
		Ext.first('#displayDescription').setValue(null);
		Ext.first('#displayCertificate').setValue(null);
    },

    execute: function(status, note) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            context;

        var makeRequest = function() {
            var context = oc.getModifiedRecords();
            if (!context.ObjectHeader) {
                context.ObjectHeader = {
                    ObjectType: {
                        'Id': this.objectTypeId
                    },
                    ObjectVariant: [{
                        'ObjectValue': []
                    }]
                };
            }
            if (status) context.ObjectHeader.ObjectVariant[0].Status = status;
            if (note) context.ObjectHeader.ObjectVariant[0].Note = note;

            me.requestObject.params = Ext.JSON.encode(context);
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        };

        if (oc.fireEvent('beforeSave', oc) !== false) {
            Ext.Msg.show({
                title: Weg.locale.delete_,
                message: Weg.locale.compliance_delete_rule,
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        makeRequest();
                    } else {
                        oc.fireEvent('save', oc);
                    }
                }
            });
        }
    }

});
