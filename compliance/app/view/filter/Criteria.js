/**
 * Painel para modificação dos criterios do filtro.
 */
 Ext.define('compliance.view.filter.Criteria', {
	extend: 'Ext.grid.Panel',
	itemId: 'criteriaPanel',
	requires: [
		'Maestro.filter.form.*',
		'Maestro.plugin.RecordEditing'
	],

	title: 'Criteria',
	alias: 'widget.compliance.view.filter.criteria',
	layout: 'fit',
	height: '100%',

	plugins: {
		ptype: 'recordediting',
		clicksToEdit: 2
	},

	selModel: {
		mode: 'MULTI',
		type: 'spreadsheet'
	},

	tbar: [
		{
			xtype: 'button',
			text: Weg.locale.add,
			iconCls: 'fa fa-plus',
			handler: 'addCriteria'
		},
		{
			xtype: 'button',
			text: Weg.locale.delete_,
			iconCls: 'fa fa-trash',
			handler: 'delCriteria'
		}
	],

	columns: [
		{
			header: '#',
			dataIndex: 'id',
			flex: 1,
			hidden: true
		},
		{
			header: 'objectTypeName',
			dataIndex: 'objectTypeName',
			flex: 2,
			editor: 'maestro.filter.form.objecttypecombo'
		},
		{
			header: 'Node',
			dataIndex: 'node',
			editor: 'textfield',
			flex: 4
		},
		{
			header: 'Characteristic',
			dataIndex: 'characteristicName',
			flex: 3,
			editor: 'maestro.filter.form.characteristiccombo',
			//Caso a caracteristica nao possua descricao, entao exibe o nome
			renderer: function (val, meta, rec) {
				return rec.get('characteristicDescription') || rec.get('characteristicName');
			}
		},
		{
			header: 'Operator',
			dataIndex: 'operator',
			editor: 'maestro.filter.form.operatorcombo',
			flex: 2
		},
		{
			header: 'Values',
			dataIndex: 'conditions',
			flex: 3,
			/**
			 * Como um registro pode possuir multiplas condicoes a renderizacao é feita concatenando os valores
			 * das condicoes separados por ','. Caso o valor nao possua descrição é exibido o valor real */
			renderer: function (val, meta, rec) {
				let concat = [],
					store = rec.conditions(),
					size = store.count() > 5 ? 5 : store.count();
				for(let i = 0; i < size; i++) {
					concat.push(store.getAt(i).get('valueDescription') || store.getAt(i).get('value'));
				}
				return concat.join(',');
			}
		},
		{
			header: 'Index',
			dataIndex: 'index',
			editor: 'textfield',
			flex: 1
		},
		{
			header: 'Sequence',
			dataIndex: 'sequence',
			editor: 'textfield',
			flex: 1
		},
		{
			xtype: 'checkcolumn',
			header: 'Visible',
			dataIndex: 'visible',
			flex: 1
		}
	],

	listeners: {
		/**
		 * Para a coluna de conditions o editor é uma window com um grid que carrega todos os valores validos da característica */
		celldblclick: function (table, td, cellIndex, record) {
			if(cellIndex === table.getColumnManager().getHeaderByDataIndex('conditions').getIndex()) {
				Ext.create('compliance.view.filter.ConditionWindow', {
					currentRecord: record,
					listeners: {
						destroy: function () {
							table.up('grid').reconfigure();
						}
					}
				}).show();
			}
		},

	}

})