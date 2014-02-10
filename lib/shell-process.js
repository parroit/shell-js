var Duplex = require("stream").Duplex,
    Buffer = require("buffer").Buffer,
    util = require("util"),
    path = require("path");

util.inherits(ShellProcess, Duplex);


function ShellProcess(ctrl) {
    Duplex.call(this);
    this.mode = "line";
    this.ctrl = ctrl;
    
}


ShellProcess.prototype._read = function() {
    
};

ShellProcess.prototype._write = function(chunk, encoding, callback) {
        var command = chunk.toString("utf8");
    
        if (command.trim() !== "") {
            this.ctrl.runCommand(command);
        }

        return callback();
    
};


ShellProcess.prototype.run = function(stdin) {



};

module.exports = ShellProcess;
