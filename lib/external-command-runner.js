function ExternalCommandRunner(command,options) {
	this.command = command;	
	this.options = options || [];
}


ExternalCommandRunner.prototype.run = function(stdin) {
	var spawn = require('child_process').spawn,
		ls = spawn(this.command, this.options);

	if (stdin) {
		stdin.pipe(ls.stdin);	
	}	
	
/*
	ls.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
	});

	ls.stderr.on('data', function(data) {
		console.log('stderr: ' + data);
	});

	ls.on('close', function(code) {
		console.log('child process exited with code ' + code);
	});
*/
	return {
		stdout: ls.stdout,
		stderr: ls.stderr
	};
};

module.exports = ExternalCommandRunner;