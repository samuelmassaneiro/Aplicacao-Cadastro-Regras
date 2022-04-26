Ext.define('compliance.Viewport', {
    extend: 'Ext.container.Viewport',
    referenceHolder: true,
    layout: 'border',

    config: {
        objectSync: undefined,
    },

    requires: [
        'Maestro.form.*',
        'Maestro.panel.*',
        'Maestro.state.model.*',
        'Maestro.header.*',
        'Maestro.state.*',
        'Maestro.filter.*',
        'Maestro.tip.ProcessingBox',
        'compliance.util.Config',
    ],

    listeners: {
        resize: function(){
            Ext.first('#maestrogrid').fireEvent('afterrender');
            Ext.first('#dependenciesResultGrid').fireEvent('afterrender');
            Ext.first('#maestrogridtwo').fireEvent('afterrender');
            Ext.first('#rulesResultGrid').fireEvent('afterrender');
        }
    },

    initComponent() {
        this.preProcess();
        this.addChildrenComponent();

        this.callParent(); // initialize Ext component
        

        this.postProcess();

    },

    initializeObjectContextSynchronizer() {
        this.objectSync = Ext.create('Maestro.state.ObjectContextSynchronizerExtension',
            Ext.Object.fromQueryString(location.search)
        );
        //QA
        //this.objectSync.objectTypeId = 3655;
        //PROD
        this.objectSync.objectTypeId = 3655;
        compliance.util.Config.setServerRequests(this.objectSync);
        compliance.util.Config.setViewport(this);
        window.fm = this.objectSync.getFormManager(); //for in browser debugging
    },

    preProcess() {
        this.initializeObjectContextSynchronizer();

        compliance.util.Config.setViewportEventListeners(this.objectSync, this);
        //QA
        //compliance.util.Config.setObjectTypeId(3655);
        //compliance.util.Config.setCharacteristicDep(90214);
        //compliance.util.Config.setOperatorDep(90216)
        //compliance.util.Config.setFilterId(5508);
        //PROD
        compliance.util.Config.setObjectTypeId(3655);
        compliance.util.Config.setCharacteristicDep(90214);
        compliance.util.Config.setOperatorDep(90216);
        compliance.util.Config.setFilterId(5508);
        compliance.util.Config.setObjectTypeName("RULE_HEADER");
        

        let event = [{ EventType: "Import" }, { EventType: "Initialize" }]

        compliance.util.Config.setEventMain(event);

        //config.setMessagePanelEventListener(objectSync, Ext.getCmp('messagePanel'));

        this.objectSync.executeServerRequest('checkInMemory');

        compliance.util.Config.preventBackspace();
    },

    postProcess() {
        this.configureFormManager();
    
        setTimeout(() => this.updateLayout(), 1000);

        var role = '_GG_DFSWEG_APPS_MAESTRO_COMPLIANCE_WMO_RULE_ADM,_GG_DFSWEG_APPS_MAESTRO_ADM';
 
        Ext.Ajax.request({
            method:'GET',
            url:'/maestro/resources/utils/hasrole/' + role,
            headers:{
                'Accept':'text/plain'
            },
            
            timeout:10000,          
            
            success:function (response) {
                if (response.responseText.indexOf("true") != -1) {
                    Ext.first("#rulestab").setDisabled(false);
                } else {
                    Ext.first("#rulestab").setDisabled(true);
                }},

            failure:function () {
            }
        });
    },

    configureFormManager() {
        this.query('*[isContextControlled]').forEach(contextControlled => this.objectSync.getFormManager().addFormPanel(contextControlled));
    },

    addChildrenComponent() {
        this.items = [];
        this.items.push(this.getHeader());
        this.items.push(this.getTabPanel());
        this.items.push(this.getFooter());
    },

    getHeader() {
        let tabpanel ={                
            region: 'north',
            height: 35,
            xtype: 'container',
            layout: 'fit',
            cls: 'w-header',
            html: '<div class="w-configurator-title"><img src="' + Ext.getResourcePath('logo.weg.png', 'classic') + '" />' +
            '<span>COMPLIANCE RULES</span></div>',
            ignoreBlackBar: true,
        };


        return tabpanel;
    },


    getTabPanel() {
        let tabpanel = {           
                xtype : 'view.main.panel',
                region : 'center',     
                layout: 'fit', 
        };
        return tabpanel;
    },    

    getFooter() {
        return {
            xtype: 'maestro.panel.status',
            region: 'south',
            id: 'statusPanel'
        };
    },
});