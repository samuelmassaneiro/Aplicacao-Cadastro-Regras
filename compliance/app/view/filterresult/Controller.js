 Ext.define('compliance.view.filterresult.Controller', {
    extend: 'Ext.app.ViewController',
	
	alias: 'controller.compliance.view.filterresult.controller',
	itemId: 'filterResultController',
	
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

	buttonExecuteFilter: function(){
		Ext.first('#filterButton').fireEvent('click');
	},

	clearFilter: function(){
		Ext.first('#filterFilters').fireEvent('change');
		compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
	},

	newRule: function(){
		compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
		Ext.ComponentQuery.query('#maestrogrid')[0].getStore().removeAll();
		Ext.first('#certificatebaserule').setValue(false); 
		Ext.first('#mainpanelPanel').setActiveTab(0);
	},

	onCellClick: function(me, td, cellIndex, record, tr, rowIndex){
		if (record.get('description') != "Regra Padrão"){
			Ext.ComponentQuery.query('#dependenciesResultGrid')[0].getStore().removeAll();
			Ext.first('#displaySequence').setValue(null);
			Ext.first('#displayHeader').setValue(null);
			Ext.first('#displayId').setValue(null);
			Ext.first('#displayDescription').setValue(null);
			Ext.first('#displayCertificate').setValue(null);
			Ext.first('#criteriaPanel').getSelectionModel().select(2);
			var table = Ext.first('#criteriaPanel').getView();
			var recordCriteria = Ext.first('#criteriaPanel').getSelectionModel().getSelection()[0];
			globalThis.param = record.get('versionId');
			globalThis.sequence = record.get('sequence');
			Ext.first('#filterButton').fireEvent('click');	
		} else {
			Ext.Msg.alert('Erro ao verificar regra', 'Não é possível verificar o conteúdo da regra padrão!', Ext.emptyFn);
		}
	},

	getFilterValues: function(){
		compliance.util.Config.getViewport().objectSync.executeServerRequest('getCharacteristicName');
	},

	resizeGrid: function(a, x){
 		var grid = Ext.first('#rulesResultGrid');
		var resultGrid = Ext.first('#dependenciesResultGrid')
		oldWidth = grid.getWidth();
		oldResultWidth = resultGrid.getWidth();
		//resultWidth = resultGrid.getWidth();
		grid.setWidth(x);
		if(grid.getColumns()[2] != undefined){
			//grid.getColumns()[2].setWidth(grid.getColumns()[2].getWidth() + x - oldWidth);
		}
	},

	editRules: function () {
		let headerID = Ext.first('#displayHeader').getValue();
		if (Ext.first('#certificatebaserule').checked == true) {
			Ext.first('#logtype').setHidden(true);
		}
        if(Ext.isNumber(parseInt(headerID))) {
                Ext.getBody().mask("LOADING...");
                Ext.Ajax.request({ 
                    url: '/maestro/resources/mirror/load/' + headerID,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': 'application/json;charset=UTF-8'
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        //Ext.StoreMgr.get('MaestroContext.store.TreeStore').load();
						let responseData = Ext.decode(response.responseText);
						let ruleHeader = responseData.structure.Node;
						let ruleDependency = responseData.structure.ObjectContext[1].Node;
						Ext.Ajax.request({
							url: '/maestro/resources/mirror/values/' + ruleHeader,
							method: 'GET',
							headers: {
								'Content-Type': 'application/json;charset=UTF-8',
								'Accept': 'application/json;charset=UTF-8'
							},
							success: function(response){
								let ov = Ext.decode(response.responseText);
								ov.objectValues.forEach(function(meta){
									if (meta.characteristic.Name === 'COMPLIANCE_RULE_BASE_TO_CERTIFICATE'){
										if(meta.propertyValue.Description === 'Sim'){
											Ext.first('#certificatebaserule').setValue(true);
										} else {
											Ext.first('#certificatebaserule').setValue(false); 
										}
									}
								});
								Ext.Ajax.request({
									url: '/maestro/resources/mirror/values/' + ruleDependency,
									method: 'GET',
									headers: {
										'Content-Type': 'application/json;charset=UTF-8',
										'Accept': 'application/json;charset=UTF-8'
									},
									success: function(response){										
										//compliance.util.Config.getViewport().objectSync.executeServerRequest('newObjectContext');
											let ov = Ext.decode(response.responseText);
											var characteristicArray = [];
											var operatorArray = [];
											var initialArray = [];
											var finalArray = [];
											let storeArray = [];
											let cont = 0;
											let lastName = '';
											ov.objectValues.forEach(function(meta, index){
												if(meta.characteristic.Name === 'CHARACTERISTIC_DEP') {
													if (lastName != meta.characteristic.Name) {
														cont = 0;
													}
													characteristicIndex = meta.characteristic.Name;
													characteristicArray[cont] = {[meta.characteristic.Name]: meta.propertyValue.Description};
													lastName = meta.characteristic.Name;
													cont++;
												};
												if(meta.characteristic.Name === 'OPERATOR_DEP') {
													if (lastName != meta.characteristic.Name) {
														cont = 0;
													}
													operatorIndex = meta.characteristic.Name;
													operatorArray[cont] = {[meta.characteristic.Name]: meta.propertyValue.Value};
													lastName = meta.characteristic.Name;
													cont++;
												};
												if(meta.characteristic.Name === 'VALUE_INITIAL_DEP') {
													if (lastName != meta.characteristic.Name) {
														cont = 0;
													}
													valueInitialIndex = meta.characteristic.Name;
													initialArray[cont] = {[meta.characteristic.Name]: meta.propertyValue.Description};
													lastName = meta.characteristic.Name;
													cont++;
												};
												if(meta.characteristic.Name === 'VALUE_FINAL_DEP') {
													if (lastName != meta.characteristic.Name) {
														cont = 0;
													}
													valueFinalIndex = meta.characteristic.Name;
													if (meta.propertyValue.Value === undefined){
														finalArray[cont] = {[meta.characteristic.Name]: ''};
													} else {
														finalArray[cont] = {[meta.characteristic.Name]: meta.propertyValue.Value};
													}
													lastName = meta.characteristic.Name;
													cont++;
												};
											});
											for (k = 0; k < characteristicArray.length; k++){
												if (k < finalArray.length && (operatorArray[k][operatorIndex] != Weg.locale.compliance_required 
													|| operatorArray[k][operatorIndex] != Weg.locale.compliance_empty)) {
													storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
													[operatorIndex]: operatorArray[k][operatorIndex],
													[valueInitialIndex]: initialArray[k][valueInitialIndex],
													[valueFinalIndex]: finalArray[k][valueFinalIndex]};
												} else if (k < finalArray.length && (operatorArray[k][operatorIndex] != Weg.locale.compliance_required 
													|| operatorArray[k][operatorIndex] != Weg.locale.compliance_empty)) {
														storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
															[operatorIndex]: operatorArray[k][operatorIndex],
															[valueInitialIndex]: "",
															[valueFinalIndex]: ""};
												} else if (k > finalArray.length && (operatorArray[k][operatorIndex] == Weg.locale.compliance_required 
													|| operatorArray[k][operatorIndex] == Weg.locale.compliance_empty))  {
														storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
															[operatorIndex]: operatorArray[k][operatorIndex],
															[valueInitialIndex]: "",
															[valueFinalIndex]: ""};
												} else {
													storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
														[operatorIndex]: operatorArray[k][operatorIndex],
														[valueInitialIndex]: initialArray[k][valueInitialIndex],
														[valueFinalIndex]: ""};
												}
											}
											let grid = Ext.first('#maestrogrid');
											let store = Ext.first('#maestrogrid').getStore();
											store.removeAll();
											store.add(storeArray);
											grid.reconfigure(store);
									},
									failure: function(response) {
										console.log(response);
									}
 								});
							},
							failure: function(response) {
								console.log(response);
							}
						});
						Ext.first('#mainpanelPanel').setActiveTab(0);
						compliance.util.Config.getViewport().objectSync.executeServerRequest('savenobutton');
						Ext.first('#ruleid').setDisabled(true);
                    },
                    failure: function (response) {
                        Ext.getBody().unmask();
                        Ext.MessageBox.error(response.responseText);
                    }
                });  
            }
	},
 	/**
 	 * Chama a execução do filtro selecionado e com o retorno dos resultados configura o grid dinamicamente */
 	executeFilter: function () {
		let selection = this.lookupReference('filters').getSelectionModel().getSelection()[0];
		let resultGrid = this.lookupReference('result');
		let labelCount = this.lookupReference('filterCount');
		labelCount.setText('');
		if(selection) {
			resultGrid.setLoading(true);
			selection = selection.getFullData(); //Cria request do objeto do filtro
			//Cria a condição do filtro para ID regra
			console.log(selection);
			for(h = 0;h<selection.criterias.length;h++){
				if (selection.criterias[h].characteristicId == 90212){
					selection.criterias[h].conditions = [] //trocar o 0 por um for e achar a posicção correta, [] definiçãod e array para criar conditions
					var condition = {} //criar um objecto
					condition.value = globalThis.param;
					condition.valueDescription = "";
					selection.criterias[h].conditions.push(condition);
				} 
			}
			selection.limit = parseInt(this.lookupReference('filterLimit').getValue());
			Ext.Ajax.request({
				method: 'POST',
				url: '/maestro/api/objectfilters/filter',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					'Accept': 'application/json; charset=UTF-8'
				},
				timeout: 6000000,
				jsonData: Ext.encode(selection),
				success: function (response) {
					let data = Ext.decode(response.responseText);
					//Configura o store do grid
					let store = Ext.create('Ext.data.Store', {
						data: [],
						fields: []
					});
					let columns = [], fields = [];
					resultGrid.setLoading(false);
					if(!data.metadata) {
						labelCount.setText(Weg.locale.filter_not_found_registers);
						return;
					}
					//Cria as colunas e o model do grid
					var descriptionArray = [];
					var characteristicArray = [];
					var operatorArray = [];
					var initialArray = [];
					var finalArray = [];
					var descriptionIndex = "";
					var characteristicIndex = "";
					var operatorIndex = "";
					var initialIndex = "";
					var finalIndex = "";
					//seta a sequência da regra
					let sequence = Ext.first('#displaySequence');
					sequence.setValue(globalThis.sequence);
					data.metadata.forEach(function (meta) {
						if(meta.characteristic === 'HEADER_ID') {
							textDataIndex = meta.dataIndex;
							let header = Ext.first('#displayHeader');
							header.setValue(data.data[0][textDataIndex]);
						}
						if(meta.characteristic === 'COMPLIANCE_RULE_ID') {
							textDataIndex = meta.dataIndex;
							let id = Ext.first('#displayId');
							id.setValue(data.data[0][textDataIndex]);
						}
						if(meta.characteristic === 'COMPLIANCE_RULE_DESCRIPTION') {
							textDataIndex = meta.dataIndex;
							let desc = Ext.first('#displayDescription');
							desc.setValue(data.data[0][textDataIndex]);
						}
						if(meta.characteristic === 'COMPLIANCE_CERTIFICADO') {
							textDataIndex = meta.dataIndex;
							let certificate = Ext.first('#displayCertificate');
							certificate.setValue(data.data[0][textDataIndex]);
						}
						if(meta.characteristic === 'CHARACTERISTIC_DEP' || meta.characteristic === 'OPERATOR_DEP'
						|| meta.characteristic === 'VALUE_INITIAL_DEP' || meta.characteristic === 'VALUE_FINAL_DEP')
						{
							columns.push({
								header: Weg.locale[meta.characteristic] || meta.characteristic,
								dataIndex: meta.dataIndex
							});
							fields.push(meta.dataIndex);
							data.data.forEach(function(alldata, index){
								//console.log(data)
								let storeData = data.data[index][meta.dataIndex].split(",")
								if(meta.characteristic === 'COMPLIANCE_RULE_DESCRIPTION'){
									descriptionIndex = meta.dataIndex;
									storeData.forEach(function(meta, i){
										var metaReplace = meta.replace("[","").replace("]","");
										descriptionArray[i+index] = ({[descriptionIndex]: metaReplace});
									})
								}
								if(meta.characteristic === 'CHARACTERISTIC_DEP'){
									characteristicIndex = meta.dataIndex;
									storeData.forEach(function(meta, i){
										var metaReplace = meta.replace("[","").replace("]","");
										characteristicArray[i+index] = ({[characteristicIndex]: metaReplace});
									})
								}
								if(meta.characteristic === 'OPERATOR_DEP'){
									operatorIndex = meta.dataIndex;
									storeData.forEach(function(meta, i){
										var metaReplace = meta.replace("[","").replace("]","");
										operatorArray[i+index] = ({[operatorIndex]: metaReplace});
									})
								}	
								if(meta.characteristic === 'VALUE_INITIAL_DEP'){
									initialIndex = meta.dataIndex;
									storeData.forEach(function(meta, i){
										var metaReplace = meta.replace("[","").replace("]","");
										initialArray[i+index] = ({[initialIndex]: metaReplace});
									})
								}
								if(meta.characteristic === 'VALUE_FINAL_DEP'){
									finalIndex = meta.dataIndex;
									storeData.forEach(function(meta, i){
										var metaReplace = meta.replace("[","").replace("]","");
										finalArray[i+index] = ({[finalIndex]: metaReplace});
									})
								}
							});
						}
					});
					let storeArray = [];
					var j = 0;
					for (k = 0; k < characteristicArray.length; k++){
						if (characteristicArray.length > initialArray.length && (operatorArray[k][operatorIndex].replace(" ", "") == Weg.locale.compliance_required 
						|| operatorArray[k][operatorIndex].replace(" ", "") == Weg.locale.compliance_empty)){
							initialArray.splice(k, 0, "");
						}
						if(k == 0){
							var operatorBetween = operatorArray[k][operatorIndex];
						} else {
							var operatorBetween = operatorArray[k][operatorIndex].replace(" ", "");
						}
						if (operatorBetween == Weg.locale.compliance_between) {
							storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
							[operatorIndex]: operatorArray[k][operatorIndex],
							[initialIndex]: initialArray[k][initialIndex],
							[finalIndex]: finalArray[j][finalIndex]};
							store.add(storeArray[k])
							j = j + 1;	
						} else {
							if (k < finalArray.length && (operatorArray[k][operatorIndex].replace(" ", "") != Weg.locale.compliance_required 
								|| operatorArray[k][operatorIndex].replace(" ", "") != Weg.locale.compliance_empty)) {
									if(finalArray[k][finalIndex] == " null"){
										finalArray[k][finalIndex] = "";
									}
								storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
								[operatorIndex]: operatorArray[k][operatorIndex],
								[initialIndex]: initialArray[k][initialIndex],
								[finalIndex]: ""};
								//[finalIndex]: finalArray[k][finalIndex]};
								store.add(storeArray[k])
							} else if (k > finalArray.length && (operatorArray[k][operatorIndex].replace(" ", "") == Weg.locale.compliance_required 
								|| operatorArray[k][operatorIndex].replace(" ", "") == Weg.locale.compliance_empty))  {
									storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
										[operatorIndex]: operatorArray[k][operatorIndex],
										[initialIndex]: "",
										[finalIndex]: ""};
										store.add(storeArray[k])
							} else if (k >= finalArray.length) {
								storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
									[operatorIndex]: operatorArray[k][operatorIndex],
									[initialIndex]: initialArray[k][initialIndex],
									[finalIndex]: ""};
									store.add(storeArray[k])
							} else {
								storeArray[k] = {[characteristicIndex]: characteristicArray[k][characteristicIndex],
									[operatorIndex]: operatorArray[k][operatorIndex],
									[initialIndex]: "",
									[finalIndex]: ""};
									store.add(storeArray[k])
							}
						}
					}
					//Reconfigura o grid com o Store e as Colunas
					resultGrid.reconfigure(store, columns);
					//Atualiza tamanho das colunas
					resultGrid.getColumns().forEach(function(col, index){
						col.setWidth(resultGrid.getWidth()/4);
					});
					//Atualiza contador
					labelCount.setText(Weg.locale.found + ': ' + store.count());
				},
				failure: function () {
					resultGrid.setLoading(false);
				}
			});
		} else {
			Ext.Msg.alert('Select one filter');
		}
	},
	
    xlsxExporter() {
		let grid = Ext.first('#dependenciesResultGrid');
		let exporter = grid.getPlugin('exporterGrid');
		exporter.download();
    },
}); 