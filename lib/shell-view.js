(function() {
    var ShellController = require("../lib/shell-controller"),

        $ = document.querySelector.bind(document),
        html = document.documentElement,
        body = document.body,

        term,
        controller;


    function getTermSize() {
        var sizeTest = $("#width-test").getClientRects()[0],


            bodyHeight = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            );

        return {
            cols: Math.floor((body.clientWidth - 10) / sizeTest.width),
            rows: Math.floor((bodyHeight - 100) / sizeTest.height),
        };
    }

    window.onresize = function() {
        var size = getTermSize();
        term.resize( size.cols, size.rows );
    }

    window.onload = function() {

        var size = getTermSize();

        controller = new ShellController();


        term = new Terminal({
            cols: size.cols,
            rows: size.rows,
            useStyle: false,
            screenKeys: true
        });

        term.currentLine = function(){
            return this.lines[this.y].map(function(cell){return cell[1]}).join("").trim()
            
        }


        controller.on('data', function(data) {

            term.write(data);

        });



        term.on('data', function(data) {
            if (data === "\r") {
                console.log("`"+term.currentLine()+"`");
            }
            controller.currentProcess.write(data);

        });


        term.on('title', function(title) {
            document.title = title;
        });

        term.open(document.body);

        term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');

    };

})();
