/*
 * shell.js
 * https://github.com/parroit/shell.js
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */
"use strict";

var EventEmitter = require("events").EventEmitter,
    util = require("util"),
    ShellProcess = require("./shell-process"),
    buildProcess = require("./process-builder"),
    methods = ShellController.prototype;


util.inherits(ShellController, EventEmitter);

ShellController.prototype.runCommand = function(command) {
    var _this = this;

    buildProcess(command, function(process) {
        _this.currentProcess = process;


        process.run();



        process.on("data", _this.onProcessData);


        process.on("end", function() {
            
            _this.currentProcess = _this.shellProcess;

        });

    });

}

function onProcessData(chunk) {
	var data = chunk.toString("utf8");
	this.emit("data",data);
}

function ShellController() {
    EventEmitter.call(this);
    this.onProcessData = onProcessData.bind(this);

    this.currentProcess = this.shellProcess = new ShellProcess(this);
    this.currentProcess.on("data", this.onProcessData);


   
}



module.exports = ShellController;
