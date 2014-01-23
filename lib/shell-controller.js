/*
 * shell.js
 * https://github.com/parroit/shell.js
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */
"use strict";

var EventEmitter = require("events").EventEmitter,
	ansispan = require('ansispan'),
	parser = require("./command-parser"),
	methods = ShellController.prototype,
	ExternalCommandRunner = require("./external-command-runner");

function ShellController(shellView) {
	var _this = this;
	_this.events = new EventEmitter();
	_this.view = shellView;
	_this.view.events.on("command", function(command) {
		_this.findCommandRunner(command, function(runner) {
			var io = runner.run();
			io.stdout.on("data", function(chunk) {

				var out = chunk.toString("utf8");

				_this.view.write(ansispan(out));

			});

			io.stdout.on("end", function() {
				_this.events.emit("commandExecuted");
			});

		});

	});
}

methods.findCommandRunner = function(command, cb) {
	parser(command, function(cmd) {
		cb(new ExternalCommandRunner(cmd.executable, cmd.arguments));
	});


};


module.exports = ShellController;