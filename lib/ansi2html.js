"use strict";
var escapes,

	BLACK = 0,
	RED = 1,
	GREEN = 2,
	YELLOW = 3,
	BLUE = 4,
	MAGENTA = 5,
	CYAN = 6,
	WHITE = 7,

	NONE = 0x0,
	BRIGHT = 0x1,
	UNDERLINE = 0x4,
	BLINK = 0x5,
	REVERSE = 0x7,
	INVISIBLE = 0x9,

	ANSICOLORS = [
		[0, 0, 0, 255], // Black
		[170, 0, 0, 255], // Red
		[0, 170, 0, 255], // Green
		[170, 85, 0, 255], // Yellow
		[0, 0, 170, 255], // Blue
		[170, 0, 170, 255], // Magenta
		[0, 170, 170, 255], // Cyan
		[170, 170, 170, 255], // White

		// Bright:

		[85, 85, 85, 255],
		[255, 85, 85, 255],
		[85, 255, 85, 255],
		[255, 255, 85, 255],
		[85, 85, 255, 255],
		[255, 85, 255, 255],
		[85, 255, 255, 255],
		[255, 255, 255, 255]
	],

	BINCOLORS = [
		[0, 0, 0, 255], // Black
		[0, 0, 170, 255], // Blue
		[0, 170, 0, 255], // Green
		[0, 170, 170, 255], // Cyan
		[170, 0, 0, 255], // Red
		[170, 0, 170, 255], // Magenta
		[170, 85, 0, 255], // Yellow
		[170, 170, 170, 255], // White

		// Bright:

		[85, 85, 85, 255],
		[85, 85, 255, 255],
		[85, 255, 85, 255],
		[85, 255, 255, 255],
		[255, 85, 85, 255],
		[255, 85, 255, 255],
		[255, 255, 85, 255],
		[255, 255, 255, 255]
	],

	MAX_HEIGHT = 12000 // Or 750 lines at 16 px/line

	;


function isDeferred(obj) {
	return (typeof obj.done === "function");
}



function parseIntArray(array) {
	var i = array.length;
	while (i--) {
		array[i] = parseInt(array[i], 10);
	}
	return array;
}

function stupidCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function Cursor(options) {
	if (!(this instanceof Cursor)) {
		return new Cursor(options);
	}

	this.options = options;

	// Content buffer
	this.rows = [];

	// Position
	this.column = 1;
	this.row = 1;
	this.scrollback = 0;

	// Graphic mode
	this.palette = stupidCopy(ANSICOLORS);

	this.clearCanvas();
	this.resetColor();

	
}

Cursor.prototype = {

	moveCursorBy: function(columns, rows) {
		this.column += columns;
		//incrow
		this.row += rows;
return;
		// Enforce boundaries
		this.column = Math.max(this.column, 1);
		this.column = Math.min(this.column, 80);
		this.row = Math.max(this.row, 1);
		this.row = Math.min(this.row, 25);
	},

	clearCanvas: function() {
		this.rows = [];
		this.flags = NONE;
	},



	savePosition: function() {
		this.saved = {};
		this.saved.row = this.row;
		this.saved.column = this.column;
	},

	loadPosition: function() {
		this.column = this.saved.column;
		this.row = this.saved.row;
		delete this.saved;
	},

	getColor: function(code, bright) {
		return this.palette[bright ? code + 8 : code];
	},

	resetColor: function() {
		this.foreground = WHITE;
		this.background = BLACK;
	},

	renderChar: function(charcode, foreground, background) {
		var cursor = this;

		function incColumn() {
			if (cursor.options.columns && cursor.column === cursor.options.columns) {
				cursor.column = 1;
				cursor.row++;
			} else {
				cursor.column++;
			}
		}

		var char = String.fromCharCode(charcode);

		if (char === " ") {
			char = "&nbsp;";
			
		}

		if (char === "\t") {
			
			while (this.column % 5 !== 0) {
				this.renderChar(" ".charCodeAt(0),foreground,background);
			}
			return;
		}

		var textToWrite = [];

		if (!this.rows.length) {
			textToWrite.push("<span style='color:rgba(" + foreground + ")'>");
		}

		

		if (this.lastForeground && foreground !== this.lastForeground) {
			textToWrite.push("</span>");

			textToWrite.push("<span style='color:rgba(" + foreground + ")'>");

			
		}

		textToWrite.push(char);

		incColumn();
		
		var row = this.rows[this.row-1];
		if (!row) {
			row = this.rows[this.row-1] = [];
		}
		
		row[this.column-1] = textToWrite.join("");
		
		this.lastRow = this.row;
		this.lastForeground = foreground;

	},

	parse: function(buffer, options) {
		var re = /(?:\x1b\x5b)([\?=;0-9]*?)([ABCDGHJKfhlmnpsu])/g,
			pos = 0,
			opcode,
			args,
			match;

		// DOS treats Ctrl-Z (SUB) as EOF. Some ANSI artists hid their alias in a file
		// by placing it after the EOF.

		buffer = buffer.split(String.fromCharCode(0x1a), 1)[0];

		do {
			pos = re.lastIndex;
			match = re.exec(buffer);
			if (match !== null) {
				if (match.index > pos) {
					options.onLiteral.call(this, buffer.slice(pos, match.index),options);
				}
				opcode = match[2];
				args = parseIntArray(match[1].split(";"));
				options.onEscape.call(this, opcode, args);
			}
		} while (re.lastIndex !== 0);

		if (pos < buffer.length) {
			options.onLiteral.call(this, buffer.slice(pos),options);
		}

		return this;
	},

	emitRow: function(options) {
		var c=0;


		//for (; r < this.rows.length; r++) {
		var fullRow = [],
			actualRow = this.rows.splice(0,1)[0] || [];
		
		this.row--;


		for (; c < actualRow.length; c++) {
			fullRow.push(actualRow[c] || " ");
		}	
		
		//	fullRows.push(actualRow.join(""));
			
		//}
		
		var result = fullRow.join("");

		options.onComplete(result+"<br>");
		return this;
	},

	escape: function(opcode, args) {
		var arg, i, length;

		switch (opcode) {
			case "A": // Cursor Up
				arg = args[0] || 1;
				this.moveCursorBy(0, -arg);
				break;

			case "B": // Cursor Down
				arg = args[0] || 1;
				this.moveCursorBy(0, arg);
				break;

			case "C": // Cursor Forward
				arg = args[0] || 1;
				this.moveCursorBy(arg, 0);
				break;

			case "K":	
				var row = this.rows[this.row-1] || [],
					c;
				switch (args[0] || 0) {
					case 0:	//Clear line from cursor right
						for (c = this.column-1; c < row.length; c++) {
							row[c] = " ";
						}
						break;
					case 1:	//Clear line from cursor left
						for (c = 0; c < this.column-1; c++) {
							row[c] = " ";
						}
						break;
					case 2:	//Clear entire line
						this.rows[this.row-1] = [];
						break;
					default:
						//unsupported 
				}
				break;
			case "D": // Cursor Backward
				arg = args[0] || 1;
				this.moveCursorBy(-arg, 0);
				break;
			case "G": // Cursor Character Absolute [column]
				arg = args[0] || 1;
				this.column = 1;
				break;

			case "f": // Horizontal & Vertical Position
			case "H": // Cursor Position
				//incrow
				this.row = args[0] || 1;
				this.column = args[1] || 1;
				break;

			case "s": // Save Cursor Position
				this.savePosition();
				break;

			case "u": // Restore Cursor Position
				this.loadPosition();
				break;

			case "m": // Set Graphics Rendition
				for (i = 0, length = args.length; i < length; i++) {
					arg = args[i];
					if (arg === NONE) {
						this.flags = NONE;
						this.resetColor();
					} else {
						switch (Math.floor(arg / 10)) {
							case 0:
								this.flags |= arg;
								break;
							case 3:
								this.foreground = arg - 30;
								break;
							case 4:
								this.background = arg - 40;
								break;
						}
					}
				}
				break;

			case "J": // Erase Display
				if (args[0] === 2) {
					this.clearCanvas();
				}
				break;
		}
	},

	write: function(text,options) {
		var CR = 0x0d,
			LF = 0x0a,
			cursor = this,
			background,
			foreground,
			charcode,
			
			i,
			length;

		foreground = this.getColor(this.foreground, this.flags & BRIGHT);
		background = this.getColor(this.background);

		for (i = 0, length = text.length; i < length; i++) {
			charcode = text.charCodeAt(i) & 0xff; // truncate to 8 bits
			switch (charcode) {
				case CR:
					cursor.column = 1;
					break;

				case LF:
					cursor.column = 1;
					cursor.row++;
					cursor.rows[cursor.row-1] = [];
					this.emitRow(options);
					break;

				default:
					
					this.renderChar(charcode, foreground, background);
					

					
					break;
			}

			// The value of "row" represents current position relative to the top of the
			// screen and therefore cannot exceed 25. Vertical scroll past the 25th line
			// increments the scrollback buffer instead.

			if (cursor.options.rows && cursor.row === cursor.options.rows) {
				cursor.scrollback++;
				cursor.row--;
			}
		}
	}

};

escapes = function(options) {
	var property, cursor;

	options = options || {};
	cursor = new Cursor(options);
	
	for (property in options) {
		cursor[property] = options[property];
	}

	if (options.transparent) {
		cursor.palette[BLACK][3] = 0;
	}


	return cursor;
};

Cursor.prototype.parseChunk = function(data,callback) {
	this.rows = [];
	this.row = 1;
	this.column = 1;
	this.parse(data, {
		onEscape: this.escape,
		onLiteral: this.write,
		onComplete: callback
	});
};
	




//escapes.Cursor = Cursor;
module.exports = escapes;