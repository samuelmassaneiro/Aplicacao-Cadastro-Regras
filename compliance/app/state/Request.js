//@charset UTF-8
// @tag ExclusiveApp
Ext.define('compliance.state.Requests', {
    extend: 'Maestro.state.Requests',

    errorHandler: function(messageText) {
        var msg = Ext.create('Ext.window.MessageBox', {
            title: messageText ? messageText.statusText : '',
            resizable: true,
            height: 250
        });

        msg.show({
            msg: messageText ? messageText.responseText : '',
            buttons: Ext.MessageBox.OK,
            icon: Ext.Msg.WARNING,
            width: 500
        });

        this.getObjectContextSynchronizer().clearProcessingServerRequest();
        this.getObjectContextSynchronizer().fireEvent('objectContextSynchronizerError', this);
    }

});
