
window.onload = function initShellView() {
    
    var ShellController = require("../lib/shell-controller"),
        
        $ = document.querySelector.bind(document),
        body = document.body,
        

        controller = new ShellController(),
        cols = Math.floor((body.clientWidth-10) / $("#width-test").getClientRects()[0].width ),

        term = new Terminal({
            cols: cols,
            rows: 40,
            useStyle: false,
            screenKeys: true
        });




    controller.on('data', function(data) {
        term.write(data);

    });

    term.on('data', function(data) {
        controller.currentProcess.write(data);

    });


    term.on('title', function(title) {
        document.title = title;
    });

    term.open(document.body);

    term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');

};

