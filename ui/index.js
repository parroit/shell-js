(function(global, exports) {
	var EventEmitter = global.EventEmitter,
		view = exports.shellView = {
			events: new EventEmitter(),
			write: function(text) {

				$("#stdout").append("<br>" + text.replace(/\n/g, "<br>"));	
			}
		},

		$ = global.$,
		ShellController = require("../lib/shell-controller"),
		controller = new ShellController(view);



	$("#stdin").keyup(function(e) {
		if (e.keyCode == 13) {
			var stdin = $("#stdin").text();
			view.events.emit("command",stdin);
			$("#stdin").html("");
		}
	});



})(window, window);