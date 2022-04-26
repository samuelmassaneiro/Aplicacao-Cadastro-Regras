 Ext.define('compliance.view.filter.Main', {
    extend: 'Maestro.panel.Panel',

    alias: 'widget.filterpanel',

    controller: 'compliance.view.filter.controller',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'compliance.view.filter.Controller'
    ],
        
    items: [{
        items: [{
            layout: 'column',
            xtype:'maestro.form.fieldcontainer',
            id: 'firstContainer',
            flex: 1,
            items: [{
                layout: 'vbox',
                xtype:'maestro.form.fieldcontainer',
                items: [{
                    layout: 'hbox',
                    xtype: 'maestro.form.fieldcontainer',
                    items: [{
                        xtype: 'maestro.button.button',
                        text: Weg.locale.compliance_filter_button,
                        cls: 'buttonMargin',
                        handler: 'getFilterValues'
                    },{
                        xtype: 'maestro.button.button',
                        text: Weg.locale.compliance_filterbase_button,
                        cls: 'buttonMargin',
                        handler: 'getBaseFilterValues'
                    }],
                },{
                    layout: 'hbox',
                    xtype: 'maestro.form.fieldcontainer',
                    items: [{
                        xtype: 'maestro.button.button',
                        text: Weg.locale.compliance_clearfilter_button,
                        cls: 'buttonMargin',
                        handler: 'clearFilter'
                    },{
                        xtype: 'maestro.button.button',
                        text: Weg.locale.compliance_new_rule_button,
                        cls: 'buttonMargin',
                        handler: 'newRule'
                    }],
                },{
                    name: 'COMPLIANCE_RULE_ID',
                    xtype: 'maestro.form.textfield',
                    node: 'RULE_HEADER',
                    cls: 'comboCertificate',
                    itemId: 'filterRuleId',
                    listeners: {
                        select: 'ruleIdCriteria'
                    }, 
                    labelWidth: 85,
                    flex: 1
                },{
                    name: 'COMPLIANCE_CERTIFICADO',
                    xtype: 'maestro.form.combobox',
                    node: 'RULE_HEADER->action',
                    cls: 'comboCertificate',
                    itemId: 'filterCertificate',
                    listeners: {
                        //select: 'certificateCriteria'
                    }, 
                    allowNullValue: true,
                    labelWidth: 85,
                    editable: true,
                    typeAhead: true,
                    typeAheadDelay: 10,
                    flex: 1
                }
/*                 ,{
                    name: 'COMPLIANCE_INFO_ADICIONAL',
                    xtype: 'maestro.form.combobox',
                    node: 'RULE_HEADER->dependency',
                    cls: 'comboAddInfo',
                    itemId: 'filterAdditionalInfo',
                    listeners: {
                        //select: 'additionalInfoCriteria'
                    }, 
                    labelWidth: 85,
                } */
                ,{
                    xtype: 'maestro.form.textarea',
                    name: 'COMPLIANCE_RULE_DESCRIPTION',
                    node: 'RULE_HEADER',
                    itemId: 'filterDescription',
                    labelWidth: 85,
                    width: 260,
                    listeners: {
                        //select: 'descriptionCriteria'
                    },  
                    cls: 'description' 
                }]
            },{

            }]
        }]
        },{
            
        }],
});