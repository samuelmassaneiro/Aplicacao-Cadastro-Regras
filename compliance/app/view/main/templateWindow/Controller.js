Ext.define('compliance.view.main.templateWindow.Controller', {
    extend: 'compliance.view.main.MainController',
    alias: 'controller.view.main.template',

    getObjectContextSynchronizer() {
        return compliance.util.Config.getViewport().objectSync;
    },

    initComponent:  function(){
        var fields = Ext.first('#docTemplate').query('*[isContextControlled]'); //TODO no lugar de * era field
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].isContextControlled) {
				fields[i].setObjectContextSynchronizer(this.getObjectContextSynchronizer());
				fields[i].initMaestroComponent();
			}
		}
    }
})