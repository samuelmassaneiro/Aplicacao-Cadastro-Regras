//@charset UTF-8
Ext.define('compliance.state.requests.CheckInMemoryRequest', {

    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function() {
        this.callParent(arguments);
        this.requestObject = {
            method: 'GET',
            url: '/maestro/resources/clienttree/objectcontext/objecttypes/' + this.getObjectContextSynchronizer().objectTypeId + '/objectheaders/state',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function(response) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            obj;
        oc.fireEvent('checkInMemory', oc);
        if (response.responseText.indexOf('refresh') <= -1) {
            try {
                if (response.responseText.length > 0) {
                    obj = JSON.parse(response.responseText);
                } else {
                    console.log('Não há objeto em memória');
                }
            } catch (e) {
                throw new Error("Response text não é um JSON");
            }
            if (obj && !Ext.isEmpty(obj.ObjectHeader)) {
                oc.executeServerRequest('loadObjectContextInMemory');
            } else {
                oc.executeServerRequest('newObjectContext');
            }
        } else {
            Ext.Msg.show({
                title: Weg.locale.login_required,
                message: Weg.locale.not_login_message,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO,
                fn: function(btn) {
                    window.location.assign('/login.html');
                }
            });

        }
    },

    execute: function() {
        var me = this;
        if (me.getObjectContextSynchronizer().fireEvent('beforeCheckInMemory') !== false) {
            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));
        }
    }

});
