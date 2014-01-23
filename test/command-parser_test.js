"use strict";

var expect = require("expect.js"),
	parseCommand = require("../lib/command-parser");


describe("parseCommand", function() {
	var cmd;

	before(function(done) {
		parseCommand("ls -a \t--anchor \"argument with spaces\" \"argument with \\\"escapes\"",function(command){
			cmd = command;
			done();
		});
	});

	it("is defined", function() {
		expect(parseCommand).to.be.an("function");
	});

	it("return executable name", function() {
		expect(cmd.executable).to.be.equal("ls");
	});

	it("return all arguments", function() {
		expect(cmd.arguments.length).to.be.equal(4);
	});

	it("return arguments content", function() {
		expect(cmd.arguments[0]).to.be.equal("-a");
		expect(cmd.arguments[1]).to.be.equal("--anchor");
	});

	it("unquote arguments", function() {
		expect(cmd.arguments[2]).to.be.equal("argument with spaces");

	});

	it("escape quote in quoted arguments", function() {
		expect(cmd.arguments[3]).to.be.equal("argument with \"escapes");

	});


});