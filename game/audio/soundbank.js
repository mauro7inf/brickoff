// functions to create sounds
soundBank = {
	'death': function () {
		var sound = new Tone(2*C1, 150, 0.3);
		sound.envelope.attack = 20;
		sound.envelope.attackGain = 1.2;
		sound.play();
	},
	'wallClunk': function (p) {
		var sound = new Tone(4*C1, 100, 3*p);
		sound.setFormula('triangle');
		sound.play();
	},
	'bombWallClunk': function (p) {
		var sound = new Tone(12*C1, 50, 2*p);
		sound.setFormula('triangle');
		sound.play();
	},
	'paddleTouch': function (p) {
		var sound = new Tone(8*C1, 100, p);
		sound.play();
	},
	'paddleCapture': function () {
		var sound1 = new Tone(16*C1, 50, 0.09);
		var sound2 = new Tone(8*C1, 50, 0.03);
		sound1.setFormula('triangle');
		sound2.setFormula('square');
		sound1.envelope.release = 400;
		sound1.envelope.attackGain = 1.0;
		sound2.envelope.release = 200;
		sound2.envelope.attackGain = 1.5
		sound1.play();
		sound2.play();
	},
	'brickClunk': function (p, freq) {
		var sound1 = new Tone(16*C1, 50, 0.7*p);
		var sound2 = new Tone(freq, 50, 0.7*p);
		sound1.setFormula('sawtooth5');
		sound2.setFormula('sine');
		sound1.envelope.attackGain = 1.5;
		sound1.envelope.attack = 10;
		sound1.envelope.decay = 10;
		sound1.envelope.release = 50;
		sound2.envelope.attackGain = 1.5;
		sound2.envelope.attack = 10;
		sound2.envelope.decay = 10;
		sound2.envelope.release = 50;
		sound1.play();
		sound2.play();
	},
	'brickDestroy': function (p, freq) {
		var sound1 = new Tone(16*C1, 50, 0.7*p);
		var sound2 = new Tone(freq, 50, 0.7*p);
		sound1.setFormula('sawtooth5');
		sound2.setFormula('sine');
		sound1.envelope.attackGain = 4.0;
		sound1.envelope.attack = 5;
		sound1.envelope.decay = 10;
		sound1.envelope.release = 200;
		sound2.envelope.attackGain = 4.0;
		sound2.envelope.attack = 5;
		sound2.envelope.decay = 10;
		sound2.envelope.release = 200;
		sound1.play();
		sound2.play();
	},
	'healingClunk': function (p, freq) {
		var sound = new Tone(freq, 100, p);
		sound.setFormula('triangle');
		sound.envelope.attackGain = 4.0;
		sound.envelope.attack = 5;
		sound.envelope.decay = 45;
		sound.envelope.release = 50;
		sound.play();
		var sound2 = new Tone(16*C1, 100, p/3);
		sound2.setFormula('triangle');
		sound2.envelope.attackGain = 4.0;
		sound2.envelope.attack = 5;
		sound2.envelope.decay = 45;
		sound2.envelope.release = 100;
		sound2.play();
	},
	'healingDestroy': function (p, freq) {
		var sound = new Tone(freq, 100, p);
		sound.setFormula('triangle');
		sound.envelope.attackGain = 4.0;
		sound.envelope.attack = 5;
		sound.envelope.decay = 45;
		sound.envelope.release = 400;
		sound.play();
		var sound2 = new Tone(16*C1, 100, p/3);
		sound2.setFormula('triangle');
		sound2.envelope.attackGain = 4.0;
		sound2.envelope.attack = 5;
		sound2.envelope.decay = 45;
		sound2.envelope.release = 200;
		sound2.play();
	},
	'polygonClunk': function (p, freq1, freq2, freq3) {
		var sound1 = new Tone(freq1, 60, p*0.7);
		sound1.setFormula('pwmA');
		sound1.envelope.attackGain = 3.0;
		sound1.envelope.attack = 10;
		sound1.envelope.decay =  10;
		sound1.envelope.release = 50;
		var sound2 = new Tone(freq2, 50, p*0.7);
		sound2.setFormula('pwmA');
		sound2.envelope.attackGain = 0.4;
		sound2.envelope.attack = 10;
		sound2.envelope.decay =  10;
		sound2.envelope.release = 50;
		var sound3 = new Tone(freq3, 70, p*0.4);
		sound3.setFormula('pwmA');
		sound3.envelope.attackGain = 1.5;
		sound3.envelope.attack = 10;
		sound3.envelope.decay = 10;
		sound3.envelope.release = 60;
		sound1.play();
		sound2.play();
		sound3.play();
	},
	'polygonDestroy': function (p, freq1, freq2, freq3) {
		var sound1 = new Tone(freq1, 120, p*0.7);
		sound1.setFormula('pwmA');
		sound1.envelope.attackGain = 3.0;
		sound1.envelope.attack = 10;
		sound1.envelope.decay =  10;
		sound1.envelope.release = 100;
		var sound2 = new Tone(freq2, 100, p*0.7);
		sound2.setFormula('pwmA');
		sound2.envelope.attackGain = 0.4;
		sound2.envelope.attack = 10;
		sound2.envelope.decay =  10;
		sound2.envelope.release = 100;
		var sound3 = new Tone(freq3, 140, p*0.4);
		sound3.setFormula('pwmA');
		sound3.envelope.attackGain = 1.5;
		sound3.envelope.attack = 10;
		sound3.envelope.decay = 10;
		sound3.envelope.release = 110;
		sound1.play();
		sound2.play();
		sound3.play();
	},
	'bombBombClink': function (p) {
		var sound = new Tone(60*C1, 50, p);
		sound.setFormula('triangle');
		sound.play();
	},
	'bombClunk': function (p, freq) {
		var sound1 = new Tone(20*C1, 50, 0.7*p);
		var sound2 = new Tone(freq, 100, 1.3*p);
		sound1.setFormula('sawtooth5');
		sound2.setFormula('sine');
		sound1.envelope.attackGain = 1.1;
		sound1.envelope.attack = 40;
		sound1.envelope.decay = 10;
		sound1.envelope.release = 50;
		sound2.envelope.attackGain = 2;
		sound2.envelope.attack = 10;
		sound2.envelope.decay = 30;
		sound2.envelope.release = 200;
		sound1.play();
		sound2.play();
	},
	'bombExplode': function () {
		var sound1 = new Tone(3*C1, 150, 0.2);
		sound1.envelope.attack = 10;
		sound1.envelope.attackGain = 1.6;
		sound1.envelope.release = 300;
		var sound2 = new Tone(7*C1, 150, 0.2);
		sound2.envelope.attack = 60;
		sound2.envelope.attackGain = 1.4;
		sound2.envelope.release = 250;
		var sound3 = new Tone(15*C1, 150, 0.2);
		sound3.envelope.attack = 100;
		sound3.envelope.attackGain = 1.2;
		sound3.envelope.release = 200;
		sound1.play();
		sound2.play();
		sound3.play();
	}
};