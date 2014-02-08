var Duplex = require("stream").Duplex,
    Buffer = require("buffer").Buffer,
    util = require("util"),
    path = require("path");

util.inherits(ShellProcess, Duplex);


function ShellProcess(ctrl) {
    Duplex.call(this);

    this.ctrl = ctrl;
    this.chunks = [];

}


ShellProcess.prototype._read = function() {
    
};

ShellProcess.prototype._write = function(chunk, encoding, callback) {
    if (chunk[0] === 13) {
        var command = Buffer.concat(this.chunks).toString("utf8");
        this.chunks = [];
        if (command.trim() !== "") {
            this.ctrl.runCommand(command);
        }
    }

    //console.log(chunk[0]);
    this.chunks.push(chunk);

    if ( !this.push(chunk)  ) {

    }

    callback();

};


ShellProcess.prototype.run = function(stdin) {



};

module.exports = ShellProcess;
