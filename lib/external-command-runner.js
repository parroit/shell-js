var spawn = require("child_process").spawn,
	path = require("path");

function ExternalCommandRunner(command, options) {
	this.command = command;
	this.options = options || [];
}


ExternalCommandRunner.prototype.run = function(stdin) {
	var ls = spawn(this.command, this.options, {
		cwd: path.resolve(process.cwd(),"test/box"),
		env: process.env
	});

	if (stdin) {
		stdin.pipe(ls.stdin);
	}

	return {
		stdout: ls.stdout,
		stderr: ls.stderr
	};
};

module.exports = ExternalCommandRunner;