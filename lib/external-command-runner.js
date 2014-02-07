var pty = require("../pty.js/lib/pty.js"),
    EventEmitter = require("events").EventEmitter,
    path = require("path");

function ExternalCommandRunner(command, options) {
    this.command = command;
    this.options = options || [];
    this.events = new EventEmitter();
}

ExternalCommandRunner.prototype.sendInput = function(data) {
    this.term.write(data);
}


ExternalCommandRunner.prototype.run = function(stdin) {
    this.term = pty.fork(this.command, this.options, {
        name: require('fs').existsSync('/usr/share/terminfo/x/xterm-256color') ? 'xterm-256color' : 'xterm',
        cols: 120,
        rows: 40,
        cwd: path.resolve(process.cwd(), "test/box")
    });

    return this.term;

};

module.exports = ExternalCommandRunner;
