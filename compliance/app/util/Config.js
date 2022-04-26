Ext.define('compliance.util.Config', {
    singleton: true,
    window: undefined,
    
  
    config: {
        objectTypeId: undefined,
        objectTypeName: undefined,
        viewport: undefined,
        eventMain: undefined,  
        characteristicDep: undefined,
        operatorDep: undefined,
        filterId: undefined,
    },

    requires: [
        'compliance.state.Requests'
    ],

    setServerRequests: function(objectSync) {        
        objectSync.setServerRequest('newObjectContext', compliance.state.requests.NewObjectContextRequest); 
        objectSync.setServerRequest('applyChanges', compliance.state.requests.ApplyChanges); 
        objectSync.setServerRequest('applyRules', compliance.state.requests.ApplyRulesRequest); 
        objectSync.setServerRequest('loadObjectContextInMemory', compliance.state.requests.LoadObjectContextInMemoryRequest);
        objectSync.setServerRequest('save', compliance.state.requests.SaveRule);
        objectSync.setServerRequest('saveBase', compliance.state.requests.SaveBaseRule);
        objectSync.setServerRequest('savenobutton', compliance.state.requests.SaveWithoutButton);
        objectSync.setServerRequest('blockRule', compliance.state.requests.BlockRule);
        objectSync.setServerRequest('createMaestroRule', compliance.state.requests.CreateMaestroRule);
        objectSync.setServerRequest('createMaestroBaseRule', compliance.state.requests.CreateMaestroBaseRule);
        objectSync.setServerRequest('filterRules', compliance.state.requests.FilterRules);
        objectSync.setServerRequest('filterBaseRules', compliance.state.requests.FilterBaseRules);
        objectSync.setServerRequest('copyRules', compliance.state.requests.CopyRules);
        objectSync.setServerRequest('getCharacteristicValues', compliance.state.requests.GetCharacteristicValues);
        objectSync.setServerRequest('downloadSheet', compliance.state.requests.DownloadExcelSheet);
        objectSync.setServerRequest('loadExcelSheet', compliance.state.requests.LoadExcelSheet);
        objectSync.setServerRequest('testRequest', compliance.state.requests.TestRequest);
        objectSync.setServerRequest('checkInMemory', compliance.state.requests.CheckInMemoryRequest);
        objectSync.setServerRequest('copyRuleGroup', compliance.state.requests.CopyRuleGroup);
        objectSync.setServerRequest('comboBox', compliance.state.requests.ComboBox);
    },

    /**
     * Defines the mode of loading style of objectSync to viewPort.
     */
    setViewportEventListeners(objectSync, viewPort) {

        Ext.on('resize', () => {
            if (Maestro.ProcessingBox.isVisible()) {
                Maestro.ProcessingBox.showBy(viewPort, 'tr', [-140, 84]);
            }
        });

        let processBefore = () => {	
            viewPort.mask();
            Maestro.ProcessingBox.showBy(viewPort, 'tr', [-140, 84]);		 
        };

        let processAfter = () => {
            Maestro.ProcessingBox.hide();
            viewPort.unmask();
            Ext.first('#ruleid').setDisabled(true);
        };

        objectSync.on({
            'newObjectContext': processAfter,
            'applyChanges': processAfter,       
            'beforeCallApplyChanges':processBefore, 
            'beforeSave': processBefore,
            'save': processAfter,
        });        

    },
    
/**
     * Define why events message panel will work
     */
    setMessagePanelEventListener: function(objectSync, messagePanel) {

        objectSync.on({
            'newObjectContext': messagePanel.updateMessages.bind(messagePanel, objectSync),
            'loadObjectContextInMemory': messagePanel.updateMessages.bind(messagePanel,objectSync),
            'loadObjectContext': messagePanel.updateMessages.bind(messagePanel, objectSync),            
            'applyChanges': messagePanel.updateMessages.bind(messagePanel, objectSync),
            'applyRules': messagePanel.updateMessages.bind(messagePanel, objectSync),
            'import': messagePanel.updateMessages.bind(messagePanel, objectSync),
            'save': messagePanel.updateMessages.bind(messagePanel, objectSync),
            'calculate': messagePanel.updateMessages.bind(messagePanel, objectSync),
            'refresh': messagePanel.updateMessages.bind(messagePanel, objectSync),
            'delete': messagePanel.updateMessages.bind(messagePanel, objectSync),
            'externalData': messagePanel.updateMessages.bind(messagePanel, objectSync)
        });
        messagePanel.setObjectContextSynchronizer(objectSync);
},
    
    /**
     * Disable return to later page when press backspace
     */
    preventBackspace: function() {
        Ext.dom.Element.get(window).on('keydown', function(e, t) {
            if (e.getKey() === e.BACKSPACE && (!/^input|textarea$/i.test(t.tagName) || t.disabled || t.readOnly)) {
                e.stopEvent();
            }
        });
    }

});
