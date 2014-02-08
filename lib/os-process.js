var pty = require("../pty.js/lib/pty.js"),
    Duplex = require("stream").Duplex,
    util = require("util"),
    path = require("path");

util.inherits(OsProcess, Duplex);


function OsProcess(command, arguments) {
    Duplex.call(this);

    this.command = command;
    this.arguments = arguments || [];
    
}


OsProcess.prototype._read = function() {
    this.term.resume();
};

OsProcess.prototype._write = function(chunk, encoding, callback) {
    this.term.write( chunk);
    callback();

};


OsProcess.prototype.run = function(stdin) {
    var options = {
        name: require('fs').existsSync('/usr/share/terminfo/x/xterm-256color') ? 'xterm-256color' : 'xterm',
        cols: 120,
        rows: 40,
        cwd: path.resolve(process.cwd(), "test/box")
    },

        term = this.term = pty.fork(this.command, this.arguments, options),

        _this = this;

    term.on("data", function(chunk) {

        if (!_this.push(chunk))
            term.pause();

    });


    term.on("close", function() {
        _this.push(null);

    });



};

module.exports = OsProcess;
