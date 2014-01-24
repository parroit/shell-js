(function(global, exports) {
	var EventEmitter = global.EventEmitter,
		view = exports.shellView = {
			events: new EventEmitter(),
			write: function(text) {
				//var count = 0;
				//console.log("write view:", text.replace(/\<br\>/g,function(){count++;return "<br>"}));
				//console.log("total br:"+count)
				$("#stdout").append(text);	
			}
		},

		$ = global.$,
		ShellController = require("../lib/shell-controller"),
		controller = new ShellController(view),

		stdin = $("#stdin");


	

	stdin
		.keyup(function(e) {
			if (e.keyCode == 13) {
				var command = stdin.text();
				view.write(command+"<br>");
				stdin.html("");
				
				if (command.trim() !== "") {
					view.events.emit("command",command);	
				}
				
				
			}
		})

		.blur(function(e) {
			process.nextTick(function(){
				stdin.focus();	
			});
			
			e.preventDefault();
		});





})(window, window);