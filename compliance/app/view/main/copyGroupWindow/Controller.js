Ext.define('compliance.view.main.copyGroupWindow.Controller', {
    extend: 'compliance.view.main.MainController',
    alias: 'controller.view.main.copygroup',

    getObjectContextSynchronizer() {
        return compliance.util.Config.getViewport().objectSync;
    },

    initComponent:  function(){
        var fields = Ext.first('#copyRuleGroup').query('*[isContextControlled]'); //TODO no lugar de * era field
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].isContextControlled) {
				fields[i].setObjectContextSynchronizer(this.getObjectContextSynchronizer());
				fields[i].initMaestroComponent();
			}
		}
    }
})