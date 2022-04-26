Ext.define('compliance.view.main.Panel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.view.main.panel',
    controller: 'main',
    itemId: 'mainpanelPanel',

    listeners: {
        tabchange: 'disableRules'
    },

    items: [{
        xtype: 'maestro.form.panel',
        title:  Weg.locale.compliance_tab_rule,
        itemId: 'rulestab',
        referenceHolder: true,

        items: [{
            xtype: 'mainpanel',
            scrollable: true,
        },{
            html: '<hr class="separator">'
        }],
    },{
        xtype: 'maestro.form.panel',
        title:  Weg.locale.compliance_tab_filter,
        referenceHolder: true,
    
        items: [{
            xtype: 'compliance.view.filter.panel'
        }]
    },{
        xtype: 'maestro.form.panel',
        title: Weg.locale.compliance_tab_result,
        referenceHolder: true,
        items: [{
            xtype: 'compliance.view.filterresult.panelteste'
        }],

    }]

});