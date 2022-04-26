Ext.define('compliance.view.filterresult.RuleSearchResult', {
    extend: 'Maestro.panel.Panel',

    alias: 'widget.filterresult.rulesearchresult',
    itemId: 'rulesearchpanel',

    controller: 'compliance.view.filterresult.controller',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',
        'compliance.view.filterresult.Controller'
    ],
      
    layout: 'vbox',
    //height: 50,
    items: [{
        xtype: 'compliance.view.filterresult.grid',
        flex: 1,
        style: 'background-color: rgb(245, 245, 245);' +
        'border-left: 1px solid rgb(194, 194, 194);' +
        'border-right: 1px solid rgb(194, 194, 194);'
    },{  
        xtype: 'compliance.view.filter.filters',
        itemid: 'compliancefilter',
        reference: 'filters',
        width: 1,
        height: 1,
        hidden: true,
    },{
        xtype: 'compliance.view.filter.criteria',
        itemid: 'compliancecriteria',
        reference: 'criteria',
        width: 1400,
        height: 600,
        flex: 1,
        hidden: true,        
    }]
})