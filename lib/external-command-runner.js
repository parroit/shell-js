function ExternalCommandRunner(command,options) {
	this.command = command;	
	this.options = options || [];
}


ExternalCommandRunner.prototype.run = function(stdin) {
	var spawn = require('child_process').spawn,
		ls = spawn(this.command, this.options,{
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