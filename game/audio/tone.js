function Tone(frequency, duration, gain) {
	this.frequency = frequency;
	this.duration = duration;
	this.gain = gain;
	this.formula = 'sawtooth'; // can be set to something else
	this.frame = 0; // current audio frame
	this.isPlaying = false; // set that when it's added to the notes array
	this.phase = Math.random()*2.0*Math.PI; // start with a random phase to prevent weird effects
	this.fourierCoeffs = [];
	this.fourierOffsets = [];
	// envelope
	this.envelope = {
		attack: 10, // in ms
		decay: 10,
		// sustain is governed by duration
		release: 20, // *past* specified duration
		attackGain: 2.0 // ratio of max power after attack to sustain power
	};
	this.pwm = 1.0; // in pulse-width modulated sounds, this is the pulse width, in multiples of pi (not 2pi)
}

// calculates relevant frame points for the envelope
Tone.prototype.calculateFrames = function () {
	this.attackUntilFrame = this.envelope.attack/globalOptions.mspa;
	this.decayUntilFrame = this.attackUntilFrame + this.envelope.decay/globalOptions.mspa;
	this.sustainUntilFrame = this.duration/globalOptions.mspa;
	this.releaseUntilFrame = this.sustainUntilFrame + this.envelope.release/globalOptions.mspa;
}

// arbitrary stopping is not implemented -- notes stop automatically
Tone.prototype.play = function () {
	this.calculateFrames();
	this.isPlaying = true;
	audioPlayer.notes.push(this);
}

Tone.prototype.generateEnvelope = function () {
	if (this.frame < this.attackUntilFrame) {
		return (this.frame/this.attackUntilFrame)*this.envelope.attackGain;
	} else if (this.frame < this.decayUntilFrame) {
		return ((this.frame - this.attackUntilFrame)/(this.decayUntilFrame - this.attackUntilFrame))*(1.0 - this.envelope.attackGain) + this.envelope.attackGain;
	} else if (this.frame < this.sustainUntilFrame) {
		return 1;
	} else if (this.frame < this.releaseUntilFrame) {
		return 1.0 - (this.frame - this.sustainUntilFrame)/(this.releaseUntilFrame - this.sustainUntilFrame);
	} else {
		this.isPlaying = false;
		return 0;
	}
}

Tone.prototype.generate = function () {
	if (gameState.paused || !this.isPlaying) return 0;
	if (typeof this.formula == 'function') return this.formula();
	var sample = 0;
	if (this.formula == 'sawtooth') sample = (this.phase/Math.PI) - 1.0;
	else if (this.formula == 'sawtooth5') sample = this.fourier();
	else if (this.formula == 'square') sample = (this.phase < Math.PI) ? 1.0 : -1.0;
	else if (this.formula == 'sine') sample = Math.sin(this.phase);
	else if (this.formula == 'triangle') sample = 2.0*Math.abs((this.phase/Math.PI) - 1.0) - 1.0;
	else if (this.formula == 'pwmA') {
		this.pwm = 1.0 - this.frame/(this.releaseUntilFrame);
		sample = (this.phase < this.pwm*Math.PI) ? 1.0 : -1.0;
	}
	sample *= this.gain*this.generateEnvelope();

	// update
	this.phase += Math.PI*this.frequency*globalOptions.mspa/500.0;
	while (this.phase > 2*Math.PI) this.phase -= 2*Math.PI;
	this.frame++;

	return sample;
}

Tone.prototype.fourier = function () {
	var sample = 0;
	for (var i = 0; i < this.fourierCoeffs.length; i++) {
		sample += this.fourierCoeffs[i]*Math.sin((i + 1)*(this.phase - this.fourierOffsets[i]));
	}
	return sample;
}

Tone.prototype.setFormula = function (formula) {
	if (formula == 'sawtooth' || formula == 'square' || formula == 'sine' || formula == 'triangle' || formula == 'pwmA') this.formula = formula;
	else if (formula == 'sawtooth5') {
		this.fourierCoeffs = [1, 0.5, 1.0/3.0, 0.25, 0.2];
		this.fourierOffsets = [0, 0, 0, 0, 0];
		this.formula = formula;
	} else if (typeof formula == 'function') this.formula = formula;
}