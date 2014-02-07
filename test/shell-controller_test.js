/*"use strict";

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
			testView.invokeCommand("ls test/files --color");
		});
		after(function() {
			testView.reset();
		});

		it("write commands output to view", function() {
			var expected = 
				" <span style=\'color:rgba(170,170,170,255)\'>1.txt<br> 2.txt<br><br><br></span>";

			expect(testView.content).to.be.equal(expected);
		});
	});

	describe("findCommandRunner", function() {
		var runner;

		before(function(done) {
			ctrl.findCommandRunner("ls test/files", function(cmdRunner) {
				runner = cmdRunner;
				done();
			});
		});

		it("return a command runner", function() {

			expect(runner.run).to.be.a("function");
		});
	});
});*/