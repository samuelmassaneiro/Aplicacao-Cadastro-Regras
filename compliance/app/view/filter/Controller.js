/**
 * Possui todos os métodos usados pelos panel da tela de filtro, a entidade pai
 * Maestro.filter.Panel compartilha o controler com todos os panel filhos */
 Ext.define('compliance.view.filter.Controller', {
    extend: 'Maestro.filter.Controller',
	
	alias: 'controller.compliance.view.filter.controller',
	itemId: 'filterController',
	/**
	 * Para os eventos de beforesync disparados pelos metodos de crud da API REST,
	 * é adicionado a mascara de loading nos grids de criteria e filters  */
	configure: function (scope) {
		let me = this,
			gridFilters = me.lookupReference('filters'),
			gridCriteria = me.lookupReference('criteria');
		gridFilters.getStore().on('beforesync', function () {
			gridFilters.setLoading(true);
			gridCriteria.setLoading(true);
		});
		me.objectTypeId = compliance.util.Config.getObjectTypeId();
		me.loadFilters();
		me.lookupReference('result').on('rowdblclick', function(scope, record) {
            Ext.Msg.show({
	            title : Weg.locale.load,
	            msg : Weg.locale.nwt_not_saved_message,
	            width : 300,
	            closable : false,
	            buttons : Ext.Msg.YESNO,
	            buttonText : 
	            {
	                yes : Weg.locale.yes,
	                no : Weg.locale.no,
	            },
	            fn : function(buttonValue, inputText, showConfig){
	                if('yes' === buttonValue)
						me.getView().fireEvent('filterselection', record);
	            }
        	});		
        });
	},

	/**
	 * Toda vez que o filtro é atualizado, se mantém a selecão anterior após
	 * o carregamento do grid */
	loadFilters: function () {
		let grid = this.lookupReference('filters'),
			lastSelection;
		if(grid.getSelection()[0]) lastSelection = grid.getSelection()[0].get('id');
		grid.getSelectionModel().clearSelections();
		grid.getStore().load({
			params: {
				objectTypeId: this.objectTypeId,
				public: this.lookupReference('publicFilter').getValue(),
				private: this.lookupReference('privateFilter').getValue(),
				query: this.lookupReference('queryFilter').getValue()
			},
			callback: function () {
				if(!lastSelection){
					grid.getSelectionModel().select(grid.getStore().getById(compliance.util.Config.getFilterId()));
				} else {
					grid.getSelectionModel().select(grid.getStore().getById(lastSelection));
				}		
			}
		});
		this.lookupReference('criteria').getStore().removeAll();
	},

	saveFilters: function () {
		let me = this,
			gridFilters = me.lookupReference('filters'),
			gridCriteria = this.lookupReference('criteria');
		gridFilters.getStore().sync({
			success: function () {
				me.loadFilters();
				gridFilters.setLoading(false);
				gridCriteria.setLoading(false);
			},
			failure: function (response) {
				Ext.Msg.alert("Error", response.getExceptions()[0].error.response.responseText);
				gridFilters.setLoading(false);
				gridCriteria.setLoading(false);
			}
		});
	},

	copyFilters: function () {
		this.lookupReference('filters').getStore().insert(0, {
			objectTypeId: this.objectTypeId,
			visibility: 'Public',
			description: 'Copy of ' + this.lookupReference('filters').getSelectionModel().getSelection()[0].data.description
		});
		let clonedCriteriasList = this.lookupReference('criteria').getStore().getData().items;
		this.lookupReference('filters').getSelectionModel().select(this.lookupReference('filters').getStore().data.items[0]);
		for (let idx in clonedCriteriasList) {
			let criteriaClone = Ext.decode(Ext.encode(clonedCriteriasList[idx].data));
			delete criteriaClone.id;
			this.lookupReference('criteria').getStore().insert(idx, criteriaClone);
			let clonedCriteriaConditions = clonedCriteriasList[idx].conditions().data.items;
			for (let _idx in clonedCriteriaConditions) {
				let clonedCriteriaCondition = Ext.decode(Ext.encode(clonedCriteriaConditions[_idx].data));
				delete clonedCriteriaCondition.id;
				this.lookupReference('criteria').getStore().getData().items[idx].conditions().insert(_idx, clonedCriteriaCondition);
			}
		}
		this.lookupReference('criteria').getView().refresh()

	},

	loadCriterias: function (scope, record) {
		this.lookupReference('criteria').setStore(record.criterias());
		this.lookupReference('result').getStore().removeAll();
	},

	addCriteria: function () {
		let criteriaGrid = this.lookupReference('criteria');
        var rec = criteriaGrid.getStore().insert(0, {});
		rec[0].data.objectTypeId = this.objectTypeId;
        rec[0].data.objectTypeName = this.lookupReference('filterObjectType').getDisplayValue(),
		rec[0].data.node = this.lookupReference('filterObjectType').getDisplayValue(),
		criteriaGrid.getPlugins()[0].startEditByPosition({ row: 0, column: 3 });
	},

	delCriteria: function () {
		let grid = this.lookupReference('criteria'),
			selectedRecords = grid.getSelectionModel().getSelection();
		for (let i = 0, selectedItem; selectedItem = selectedRecords[i]; i++) {
			grid.getStore().remove(selectedItem);
		}
	},

	addFilter: function () {
		this.lookupReference('filters').getStore().add({
			objectTypeId: this.objectTypeId,
			visibility: 'Public'
		});
	},

	delFilter: function () {
		let grid = this.lookupReference('filters'),
			rec = grid.getSelectionModel().getSelection()[0];
		if(rec) {
			grid.getStore().remove(rec);
		}
	},

	ruleIdCriteria: function(){
		Ext.first('#criteriaPanel').getSelectionModel().select(3);
		var table = Ext.first('#criteriaPanel').getView();
		var record = Ext.first('#criteriaPanel').getSelectionModel().getSelection()[0];
		globalThis.param = "#filterRuleId"
		Ext.create('compliance.view.filter.ConditionWindow', {
			currentRecord: record,
			listeners: {
				destroy: function () {
					table.up('grid').reconfigure();
				}
			}
		}).show();
		setTimeout(function(){
			Ext.first('#applyCriteriaButton').fireEvent('click');
		}, 50)
		
	},

	certificateCriteria: function(){
		Ext.first('#criteriaPanel').getSelectionModel().select(0);
		var table = Ext.first('#criteriaPanel').getView();
		var record = Ext.first('#criteriaPanel').getSelectionModel().getSelection()[0];
		globalThis.param = "#filterCertificate"
		Ext.create('compliance.view.filter.ConditionWindow', {
			currentRecord: record,
			listeners: {
				destroy: function () {
					table.up('grid').reconfigure();
				}
			}
		}).show();
		setTimeout(function(){
			Ext.first('#applyCriteriaButton').fireEvent('click');
		}, 50)
		
	},

	certificateForCriteria: function(){
		Ext.first('#criteriaPanel').getSelectionModel().select(2);
		var table = Ext.first('#criteriaPanel').getView();
		var record = Ext.first('#criteriaPanel').getSelectionModel().getSelection()[0];
		globalThis.param = "#filterCertificateFor"
		Ext.create('compliance.view.filter.ConditionWindow', {
			currentRecord: record,
			listeners: {
				destroy: function () {
					table.up('grid').reconfigure();
				}
			}
		}).show();
		setTimeout(function(){
			Ext.first('#applyCriteriaButton').fireEvent('click');
		}, 50)
		
	},

	additionalInfoCriteria: function(){
		Ext.first('#criteriaPanel').getSelectionModel().select(1);
		var table = Ext.first('#criteriaPanel').getView();
		var record = Ext.first('#criteriaPanel').getSelectionModel().getSelection()[0];
		globalThis.param = "#filterAdditionalInfo"
		Ext.create('compliance.view.filter.ConditionWindow', {
			currentRecord: record,
			listeners: {
				destroy: function () {
					table.up('grid').reconfigure();
				}
			}
		}).show();
		setTimeout(function(){
			Ext.first('#applyCriteriaButton').fireEvent('click');
		}, 50)
		
	},

	descriptionCriteria: function(){
		Ext.first('#criteriaPanel').getSelectionModel().select(4);
		var table = Ext.first('#criteriaPanel').getView();
		var record = Ext.first('#criteriaPanel').getSelectionModel().getSelection()[0];
		globalThis.param = "#filterDescription"
		Ext.create('compliance.view.filter.ConditionWindow', {
			currentRecord: record,
			listeners: {
				destroy: function () {
					table.up('grid').reconfigure();
				}
			}
		}).show();
		setTimeout(function(){
			Ext.first('#applyCriteriaButton').fireEvent('click');
		}, 50)

	},


	buttonApplyChanges: function () {
		let scope = Ext.first('#applyCriteriaButton')
		let win = scope.up('window'),
			gridStore = win.currentRecord.conditions(),
			toRemove = [];
		let selections = [];
		gridStore.each(function (gridRec) {
			let index = selections.indexOf(gridRec.get('value'));
			if (index === -1) {
				toRemove.push(gridRec);
			}
		});
		toRemove.forEach(function (rec) {
			gridStore.remove(rec);
		});
		win.down('grid').getSelection().forEach(function (winRec) {
			if (gridStore.findExact('value', winRec.get('value')) === -1) {
				win.currentRecord.conditions().add({
					value: winRec.get('value'),
					valueDescription: winRec.get('valueDescription')
				});
			}
			selections.push(winRec.get('value'));
		});
		win.destroy();
	},

	buttonExecuteFilter: function(){
		Ext.first('#filterButton').fireEvent('click');
	},

	clearFilter: function(){
		Ext.first('#filterFilters').fireEvent('change');
		compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
		Ext.first('#rulesResultGrid').getStore().removeAll();
		Ext.first('#displayHeader').setValue(null);
		Ext.first('#displayId').setValue(null);
		Ext.first('#displayDescription').setValue(null);
		Ext.first('#displayCertificate').setValue(null);
		Ext.first('#certificatebaserule').setValue(false); 
		//Ext.first('#displayType').setValue(null);	
		//Ext.first('#displayInfo').setValue(null);
	},

	newRule: function(){
		compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
		Ext.ComponentQuery.query('#maestrogrid')[0].getStore().removeAll();
		Ext.first('#certificatebaserule').setValue(false); 
		Ext.first('#mainpanelPanel').setActiveTab(0);
	},

	getFilterValues: function(){
		if(Ext.first('#certificateCombo').getValue() == null && Ext.first('#textDescription').getValue() == '' && Ext.first('#filterRuleId').getValue() == ''){
			Ext.Msg.alert('Erro ao Filtrar',  'Adicione alguma forma de filtro!', Ext.emptyFn);
			return;
		} else {
			compliance.util.Config.getViewport().objectSync.executeServerRequest('filterRules');
			compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
			Ext.first('#mainpanelPanel').setActiveTab(2);
			Ext.first('#certificatebaserule').fireEvent('change');
		}
	},

	getBaseFilterValues: function(){
		if(Ext.first('#certificateCombo').getValue() == null && Ext.first('#textDescription').getValue() == '' && Ext.first('#filterRuleId').getValue() == ''){
			Ext.Msg.alert('Erro ao Filtrar',  'Adicione alguma forma de filtro!', Ext.emptyFn);
			return;
		} else {
			compliance.util.Config.getViewport().objectSync.executeServerRequest('filterBaseRules');
			compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
			Ext.first('#mainpanelPanel').setActiveTab(2);
		}
	},

}); 