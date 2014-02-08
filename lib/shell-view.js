(function() {
    var ShellController = require("../lib/shell-controller"),
        controller = new ShellController(),
        
        term = new Terminal({
            cols: 120,
            rows: 40,
            useStyle: true,
            screenKeys: true
        });




    controller.on('data', function(data) {
        term.write(text);

    });

    term.on('data', function(data) {
        controller.currentProcess.write(data);

    });


    term.on('title', function(title) {
        document.title = title;
    });

    term.open(document.getElementById("stdout"));

    term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');

})();
