var Readable = require("stream").Readable,
    util = require("util");



function ConsoleStdIn(opt) {
    Readable.call(this, opt);

}


util.inherits(ConsoleStdIn, Readable);

ConsoleStdIn.prototype._read = function() {

    this.emit("inputRequested");
};



module.exports = ConsoleStdIn;