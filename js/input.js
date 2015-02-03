// Translation of numeric key codes to literals
var KeyCodes = {
	48: '0',
	49: '1',
	50: '2',
	51: '3',
	52: '4',
	53: '5',
	54: '6',
	55: '7',
	56: '8',
	57: '9',
	96: '0',
	97: '1',
	98: '2',
	99: '3',
	100: '4',
	101: '5',
	102: '6',
	103: '7',
	104: '8',
	105: '9',
	65: 'A',
	66: 'B',
	67: 'C',
	68: 'D',
	69: 'E',
	70: 'F',
	71: 'G',
	72: 'H',
	73: 'I',
	74: 'J',
	75: 'K',
	76: 'L',
	77: 'M',
	78: 'N',
	79: 'O',
	80: 'P',
	81: 'Q',
	82: 'R',
	83: 'S',
	84: 'T',
	85: 'U',
	86: 'V',
	87: 'W',
	88: 'X',
	89: 'Y',
	90: 'Z',
}

var InputHandler = function() {
	this.input_text = '';
	this.callback_view = null;
}

InputHandler.prototype.addToInput = function (character)
{
	this.input_text += character;
}

InputHandler.prototype.processKey = function (key)
{
	// If no callback exists, do nothing
	if(this.callback_view === undefined)
		return;

	switch(key)
	{
		case 13:
			// ENTER key
			this.callback_view.confirm();
			this.resetInput();
			break;
		case 107:
			// PLUS key on NUMPAD
			this.callback_view.add();
			break;
		case 109:
			// MINUS key on NUMPAD
			this.callback_view.remove();
			break;
		default:
			// Numbers typed by user or barcode scanner
			character = KeyCodes[key];
			if(character)
			{
				this.addToInput(character);
			}
			this.callback_view.input(this.input_text);
			break;
	}
}

InputHandler.prototype.resetInput = function () {
	this.input_text = '';
};

InputHandler.prototype.setView = function (view) {
	this.callback_view = view;
};