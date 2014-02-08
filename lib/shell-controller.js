/*
 * shell.js
 * https://github.com/parroit/shell.js
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */
"use strict";

var EventEmitter = require("events").EventEmitter,
    buildProcess = require("./process-builder"),
    methods = ShellController.prototype;

function runCommand(command) {
    var _this = this;
    
    buildProcess(command, function(process) {
        _this.currentProcess = process;


        process.run();



        process.on("data", function(chunk) {

            var out = chunk.toString("utf8");

            _this.view.write(out);


        });


        process.on("end", function() {
            console.log("stdout.on end")
            _this.currentProcess.removeEventListener("data");
            _this.currentProcess.removeEventListener("end");
            _this.currentProcess = null;

        });

    });

}

function ShellController(shellView) {
    this.events = new EventEmitter();
    this.view = shellView;
    this.view.events.on("command", runCommand.bind(this) );
}



module.exports = ShellController;
