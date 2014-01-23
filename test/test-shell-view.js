var EventEmitter = require("events").EventEmitter;

module.exports = {
	events: new EventEmitter(),
	content: "",

	invokeCommand: function(command) {
		this.events.emit("command",command);
	},

	reset: function() {
		this.content = "";
	},

	write: function(content) {
		this.content += content;	
	}
};
