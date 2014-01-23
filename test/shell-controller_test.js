"use strict";

var expect = require("expect.js"),
	ShellController = require("../lib/shell-controller"),
	testView = require("./test-shell-view");


describe("ShellController", function() {
	var ctrl;

	it("is defined", function() {
		expect(ShellController).to.be.an("function");
	});

	describe("constructor", function() {
		before(function() {
			ctrl = new ShellController(testView);
		});

		it("create an object", function() {
			expect(ctrl).to.be.an("object");
		});
	});

	describe("on command event", function() {
		before(function(done) {
			ctrl.events.on("commandExecuted", done);
			testView.invokeCommand("ls");
		});
		after(function() {
			testView.reset();
		});

		it("write commands output to view", function() {
			var expected = "Gruntfile.js\nLICENSE-MIT\nREADME.md\nbower.json\nbower_components\nlib\nnode-webkit-v0.8.0-rc1-win-ia32\nnode_modules\npackage.json\nshell.sublime-workspace\nshelljs.sublime-project\nshelljs.sublime-workspace\ntest\nui\n";
			
			expect(testView.content).to.be.equal(expected);
		});
	});

	describe("findCommandRunner", function() {
		var runner;

		before(function() {
			runner = ctrl.findCommandRunner("ls test/files");
		});

		it("return a command runner", function() {

			expect(runner.run).to.be.a("function");
		});
	});
});