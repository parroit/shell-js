/*

"use strict";

var expect = require("expect.js"),
	concat = require("concat-stream"),
	through = require("through"),
	ExternalCommandRunner = require("../lib/external-command-runner");


describe("ExternalCommandRunner", function() {
	var cmd = new ExternalCommandRunner("grep", ["this is"]);

	it("is defined", function() {
		expect(ExternalCommandRunner).to.be.an("function");
	});

	it("can be constructed", function() {
		expect(cmd).to.be.an("object");
	});

	describe("run",function(){
		it("is defined", function() {
			expect(cmd.run).to.be.an("function");
		});	

		it("return readable stream", function() {
			
			var stdio = cmd.run();
			expect(stdio.stdout).to.be.an("object");
		});	

		it("accept writable stream argument", function() {
			
			var stdin = through(),
				io = cmd.run(stdin);

			io.stdout.pipe(concat(function(data){
				data = data.toString("utf8");
				expect(data).to.be.equal("this is a test\n");	
			}));

			stdin.write("this was a try\n");
			stdin.end("this is a test");
			
		});	
	});
	
});

 */