//@charset UTF-8
Ext.define('compliance.state.requests.SearchSap', {
    extend: 'compliance.state.Requests',

    singleton: true,

    setObjectContextSynchronizer: function () {
        this.callParent(arguments);
        this.requestObject = {
            method: 'GET',
            url: '/maestro/plm/resources/search/sap',
            success: this.successCallback.bind(this),
            failure: this.errorHandler.bind(this)
        }
    },

    successCallback: function (response) {
        var me = this,
            oc = this.getObjectContextSynchronizer(),
            obj;
        if (this.isValidJson(response.responseText)) {
            var obj = Ext.decode(response.responseText);
            Ext.getCmp("sappanel").lookup("sapResult").getStore().loadData(obj);
            Ext.getCmp("sappanel").lookup('sapResult').setHidden(false);
            Ext.getCmp('sappanel').setHeight(600);
            Ext.getCmp('sappanel').setWidth(700);
            Ext.getCmp("sappanel").lookup('sapResult').setHeight(Ext.getCmp("sappanel").getHeight() - 200);

        } else {
            me.errorHandler(response);
            oc.clearProcessingServerRequest();
        }

        Ext.getCmp("sappanel").enable();

        oc.fireEvent('searchSap', oc);

    },

    execute: function (bomStatus, maraStatus, marcStatus, filterKey) {
        var me = this;

        if (me.getObjectContextSynchronizer().fireEvent('beforaSearchSap') !== false) {
            Ext.getCmp("sappanel").disable(true);

            var param = { 'bomStatus': bomStatus, 'maraStatus': maraStatus, 'marcStatus': marcStatus, 'filterKey': filterKey };
            me.requestObject.params = param;

            Ext.Ajax.request(Ext.apply(me.requestObject, me.defaultRequestOpts));

        }





    }

});
