(function(global, exports) {
    var term = new Terminal({
        cols: 120,
        rows: 40,
        useStyle: true,
        screenKeys: true
    }),
        view = exports.shellView = {
            events: new EventEmitter(),
            write: function(text) {
               
                term.write(text);
            }
        },

        $ = global.$,
        ShellController = require("../lib/shell-controller"),
        buffer = [],
        controller = new ShellController(view);


    term.on('data', function(data) {
        if (controller.currentRunner) {
            return controller.currentRunner.sendInput(data);
        }
        
        buffer.push(data);
        term.write(data);
    });


    term.on('keydown', function(ev) {
        if (!controller.currentRunner && ev.keyCode === 13) {
            var command = buffer.join("");
            buffer = [];
            if (command.trim() !== "") {
                view.events.emit("command", command);
            }
        }
    });

    term.on('title', function(title) {
        document.title = title;
    });

    term.open($("#stdout")[0]);

    term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');
   
})(window, window);
