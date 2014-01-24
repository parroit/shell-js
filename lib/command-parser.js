var Tokenizer = require("tokenizer");
   

function setupTokenizer(tokenizer) {

    tokenizer.addRule(/^\\\"$/, "escaped-quote");
    tokenizer.addRule(/^\"$/, "quote");
    tokenizer.addRule(Tokenizer.whitespace);
    tokenizer.addRule(/^\$[^\s\"]+$/, "variable");
    tokenizer.addRule(/^[^\s\"]+$/, "segment");


};


module.exports = function parseCommand(command,cb) {
    var  tokenizer = new Tokenizer(),
        quotedContent = "",
        quoting = false,
        results = {
            executable: "",
            arguments: []
        };
    

    function nextSegment(segment) {
        if (!results.executable) {
            results.executable = segment;
        } else {
            results.arguments.push(segment);
        }
    }

    setupTokenizer(tokenizer);

    tokenizer.on("token", function(token, type) {
        //console.log(token)
        if (type === "quote") {
            if (quoting) {
                nextSegment(quotedContent);
                quotedContent = "";
            }

            quoting = !quoting;
            return;
        }

        if (quoting) {
            if (type === "escaped-quote") {
                quotedContent += "\"";
            } else {
                quotedContent += token.content;    
            }
            
            return;
        }


        if (type === "segment") {
            nextSegment(token.content);
            return;
        } else if (type === "variable") {
            nextSegment(process.env[token.content.substring(1)]);
            return;
        } 

    });

    
    tokenizer.on("finish", function() {
        //console.log("END");
        process.nextTick(function () {
            cb(results);
        });
    });

    //tokenizer.write(command);
   tokenizer.end(command);


   
};