/**
 * Painel para os resultados do filtro.
 */
Ext.define('compliance.view.filter.Result', {
	extend: 'Ext.grid.Panel',
	title: Weg.locale.compliance_dependencies_grid,
	alias: 'widget.compliance.view.filter.result',
	itemId: 'dependenciesResultGrid',
	layout: 'fit',
	btXlsExportIsHidden: true,
	scrollable: true,
	flex: 1,
	requires: [
		'compliance.plugin.ExportGridToCsv',
	],
	plugins: [{
		ptype: 'compliance.exportGridToCsv',
		pluginId: 'exporterGrid'
	}],
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'top',
		height: 0,
		items: [{
			xtype: 'button',
			text:'Filter',
			iconCls: 'fa fa-search',
			itemId: 'filterButton',
			height: 0,
			hidden: true,
			listeners: {
				click: 'executeFilter'
			},		
		},{
			xtype: 'textfield',
			fieldLabel: Weg.locale.filter_limit,
			reference: 'filterLimit',
			hidden: true,
			height: 0,
			value: 25
		},{
			xtype: 'label',
			reference: 'filterCount',
			hidden: true,
			height: 0,
			text: ''
		}]
	}],
})