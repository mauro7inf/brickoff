// timer for fading; read the fadeParameter for current strength of fade
// to use, make sure to call the start() method
// default formulas for fading are r^2 and (1 - r)^2
function Fader(fadeIn, wait, fadeOut) {
	if (arguments.length <= 1) { // fades in and leaves it
		fadeIn = fadeIn || 0.0;
		this.type = 'inFader';
		this.fadeIn = fadeIn;
		this.fadeInFrames = fadeIn * 1000.0 / globalOptions.mspf;
	} else { // fades in and out
		if (arguments.length == 2) {
			fadeOut = wait;
			wait = 0.0;
		}
		this.type = 'fader';
		this.fadeIn = fadeIn;
		this.wait = wait;
		this.waitFade = 1.0;
		this.fadeOut = fadeOut;
		this.fadeInFrames = fadeIn * 1000.0 / globalOptions.mspf;
		this.waitFrames = wait * 1000.0 / globalOptions.mspf;
		this.fadeOutFrames = fadeOut * 1000.0 / globalOptions.mspf;
	}
	this.frame = 0;
	this.inverted = false;
	if (fadeIn > 0) this.fadeParameter = 0;
	else this.fadeParameter = 1; // fading has already happened
	this.mode = 'inactive';
	this.fadeMode = 'fadeIn';
	if (fadeIn == 0) {
		this.fadeMode = 'wait';
		if (wait == 0) this.fadeMode = 'fadeOut';
	}
	this.fadeInFormula = 'quadratic'; // default formula for calculating fade in parameter
	this.fadeOutFormula = 'quadraticDec'; // default formula for calculating fade out parameter
}

Fader.prototype.update = function () {
	if (this.mode != 'active') return;
	else if (this.fadeMode == 'fadeIn') {
		if (this.frame > this.fadeInFrames) {
			if (this.type == 'fader') {
				this.fadeMode = 'wait';
				this.frame = 0;
			} else if (this.type == 'inFader') {
				this.mode = 'done';
			}
			this.fadeParameter = this.waitFade;
		} else {
			this.fadeParameter = this.calculateParameter(this.frame, this.fadeInFrames, this.fadeInFormula);
			this.frame++;
		}
	} else if (this.fadeMode == 'wait') {
		if (this.frame > this.waitFrames) {
			this.fadeMode = 'fadeOut';
			this.frame = 0;
		} else {
			this.frame++;
		}
	} else if (this.fadeMode == 'fadeOut') {
		if (this.frame > this.fadeOutFrames) {
			this.fadeMode = undefined;
			this.mode = 'done';
		} else {
			this.fadeParameter = this.calculateParameter(this.frame, this.fadeOutFrames, this.fadeOutFormula);
			this.frame++;
		}
	}
};

Fader.prototype.calculateParameter = function (frame, total, formula) {
	var r = this.inverted ? (1.0 - frame/total) : frame/total;
	if (formula == 'quadratic') return Math.pow(r, 2); // r^2
	else if (formula == 'quadraticDec') return Math.pow(1.0 - r, 2); // (1 - r)^2
	else if (formula == 'linear') return r; // r
	else if (formula == 'linearDec') return 1.0 - r; // 1 - r
	else {
		console.log('Fader error: Invalid formula: ' + formula);
		return 0;
	}
};

// inverts behavior of fader, though fadeIn and fadeOut are still at the start and end of the cycle, respectively
Fader.prototype.invertFader = function() {
	this.inverted = true;
	this.waitFade = 0;
};

Fader.prototype.start = function () {
	if (this.fadeMode !== undefined) this.mode = 'active'; // can't restart a fader after it's done
};

Fader.prototype.pause = function () {
	this.mode = 'paused';
};

Fader.prototype.stop = function () {
	this.mode = 'done';
};

Fader.prototype.draw = function () {}; // there's nothing to draw, but just in case this gets called somehow it shouldn't do anything