/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'compliance.Application',

    name: 'compliance',

    requires: [
        // This will automatically load all classes in the compliance namespace
        // so that application classes do not need to require each other.
        'compliance.*'
    ],
     // The name of the initial view to create.
     mainView: 'compliance.Viewport'
});
