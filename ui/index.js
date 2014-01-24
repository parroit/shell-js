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

		stdin = $("#stdin"),
		stdout = $("#stdout");


	stdin
		.keyup(function(e) {
			if (e.keyCode == 13) {
				var command = stdin.text();
				view.write(command + "<br>");
				stdin.html("");


				if (command.trim() !== "") {
					stdin.removeAttr("contenteditable");

					controller.events.on("commandExecuted", function() {
						stdin.attr("contenteditable", "");
						stdout.removeAttr("contenteditable");
						stdout.off("keyup");
						stdin.focus();
					});

					controller.events.on("inputRequested",function(){
						stdout.attr("contenteditable", "");
						stdout.keyup(function(e) {
							controller.sendInput(String.fromCharCode(e.keyCode));
						});
						stdout.focus();
					})

					view.events.emit("command", command);
				}


			}
		})

	.blur(function(e) {
		process.nextTick(function() {
			stdin.focus();
		});

		e.preventDefault();
	});



})(window, window);