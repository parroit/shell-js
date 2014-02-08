var parser = require("./command-parser"),
    OsProcess = require("./os-process");

module.exports = function buildProcess(command, cb) {
    parser(command, function(cmd) {
        cb(new OsProcess(cmd.executable, cmd.arguments));
    });


};
