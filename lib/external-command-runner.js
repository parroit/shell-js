var spawn = require("child_process").spawn,
	EventEmitter = require("events").EventEmitter,
	ConsoleStdIn = require("./console-stdin"),
	path = require("path");

function ExternalCommandRunner(command, options) {
	this.command = command;
	this.options = options || [];
	this.events = new EventEmitter();
}

ExternalCommandRunner.prototype.sendInput = function(keycode){
	this.stdin.push(keycode);
}


ExternalCommandRunner.prototype.run = function(stdin) {
	var ls = spawn(this.command, this.options, {
		cwd: path.resolve(process.cwd(),"test/box"),
		env: process.env
	});
	
	var _this = this;

	if (!stdin) {
		stdin = this.stdin = new ConsoleStdIn();			
		stdin.on("inputRequested",function(){
			_this.events.emit("inputRequested");	
		});
	}

	stdin.pipe(ls.stdin);

	return {
		stdout: ls.stdout,
		stderr: ls.stderr
	};
};

module.exports = ExternalCommandRunner;