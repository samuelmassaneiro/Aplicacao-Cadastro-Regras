/**
 * Possui o grid de cadastro da entidade ObjectFilter.
 * Esta tela utiliza a API REST da Ext JS, assim todas as modificações
 * de adição, modificação e remoção feitas na telas somente são salvas 
 * quando o botão salvar é clicado.
 */
Ext.define('compliance.view.filter.Filters', {
	extend: 'Maestro.filter.Filters',

	requires: [
		'Maestro.plugin.RecordEditing',
		'Maestro.filter.model.*',
		'Maestro.filter.form.*'
	],

	title: 'Filters',
	alias: 'widget.compliance.view.filter.filters',
	layout: 'fit',
	height: '100%',

	tbar: [
		{
			xtype: 'button',
			text: 'Save',
			iconCls: 'fa fa-save',
			handler: 'saveFilters'
		},
		{
			xtype: 'button',
			text: 'Copy',
			handler: 'copyFilters',
			hidden: true,
		},
		'->',
		{
			xtype: 'button',
			text: 'Add',
			iconCls: 'fa fa-plus',
			handler: 'addFilter'
		},
		{
			xtype: 'button',
			text: 'Delete',
			iconCls: 'fa fa-trash',
			handler: 'delFilter'
		}
	],

	bbar: [
		{
			xtype: 'checkboxfield',
			boxLabel: 'Public',
			boxLabelAlign: 'before',
			itemId: 'filterFilters',
			checked: true,
			reference: 'publicFilter',
			listeners: {
				change: 'loadFilters'
			}
		},
		'|',
		{
			xtype: 'checkboxfield',
			boxLabel: 'Private',
			boxLabelAlign: 'before',
			checked: false,
			reference: 'privateFilter',
			listeners: {
				change: 'loadFilters'
			}
		},
		'|',
        {
            xtype: 'textfield',
            emptyText: Weg.locale['search_filter_by_description'],
            flex: 1,
            checkChangeBuffer: 500,
            reference: 'queryFilter',
            listeners: {
                change: 'loadFilters'
            }
        }
	],

	plugins: {
		ptype: 'recordediting',
		clicksToEdit: 2
	},

	initComponent: function () {
		if (this.up('[xtype=maestro.filter.panel]') !== undefined && this.up('[xtype=maestro.filter.panel]').showCopyButton  === true) {
			this.tbar.find(function(_this) {return _this.handler === 'copyFilters'}).hidden = false;
		}
		Ext.apply(this, {
			store: Ext.create('Maestro.filter.model.ObjectFilterStore')
		});
		this.callParent(arguments);
	},

	columns: [
		{
			header: '#',
			dataIndex: 'id',
			flex: .2,
			hidden: true
		},
		{
			header: 'Description',
			dataIndex: 'description',
			editor: 'textfield',
			flex: .6
		},
		{
			header: 'Visibility',
			dataIndex: 'visibility',
			editor: 'maestro.filter.form.visibilitycombo',
			flex: .2
		}
	],

	listeners: {
		select: 'loadCriterias'
	}

});