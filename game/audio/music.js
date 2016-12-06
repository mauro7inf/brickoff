music = {
	'title': function () {
		var tempo = 180; // bpm
		var beat = 60*1000/tempo; // ms
		var seq = new Sequence([
			{
				time: beat,
				action: function () {
					var sound = new Tone(2*C1, beat*0.95, 0.05);
					sound.setFormula('sine');
					sound.play();
				}
			},
			{
				time: 2*beat,
				action: function () {
					var sound = new Tone(3*C1, beat*0.95, 0.05);
					sound.setFormula('sine');
					sound.play();
				}
			},
			{
				time: 3*beat,
				action: function () {
					var sound = new Tone(5*C1, beat*0.95, 0.05);
					sound.setFormula('sine');
					sound.play();
				}
			},
			{
				time: 4*beat,
				action: function () {
					var sound1 = new Tone(7*C1, beat*2.95, 0.05);
					var sound2 = new Tone(5*C1, beat*2.95, 0.05);
					var sound3 = new Tone(6*C1, beat*2.95, 0.05);
					var sound4 = new Tone(4*C1, beat*2.95, 0.05);
					sound1.setFormula('sine');
					sound2.setFormula('sine');
					sound3.setFormula('sine');
					sound4.setFormula('sine');
					sound1.play();
					sound2.play();
					sound3.play();
					sound4.play();
				}
			}
		]);
		seq.start();
	},
	'gameWin': function () {
		var tempo = 60; // bpm
		var beat = 60*1000/tempo; // ms
		var seq = new Sequence([
			{
				time: beat/3,
				action: function () {
					var sound = new Tone(2*C1, beat*(2.0/3 - 0.05), 0.1);
					sound.setFormula('triangle');
					sound.play();
				}
			},
			{
				time: beat/2,
				action: function () {
					var sound = new Tone(3*C1, beat*(0.5 - 0.05), 0.04);
					sound.setFormula('triangle');
					sound.play();
				}
			},
			{
				time: 2*beat/3,
				action: function () {
					var sound = new Tone(4*C1, beat*(1.0/3 - 0.05), 0.06);
					sound.setFormula('triangle');
					sound.play();
				}
			},
			{
				time: 5*beat/6,
				action: function () {
					var sound = new Tone(5*C1, beat*(1.0/6 - 0.05), 0.08);
					sound.setFormula('triangle');
					sound.play();
				}
			},
			{
				time: beat,
				action: function () {
					var sound1 = new Tone(6*C1, beat*(1.0/2 - 0.1), 0.1);
					var sound2 = new Tone(8*C1, beat*(1.0/2 - 0.1), 0.1);
					var sound3 = new Tone(10*C1, beat*(1.0/2 - 0.1), 0.1);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
				}
			},
			{
				time: 1.5*beat,
				action: function () {
					var sound1 = new Tone(6*C1, beat*(1.0/4 - 0.1), 0.1);
					var sound2 = new Tone(8*C1, beat*(1.0/4 - 0.1), 0.1);
					var sound3 = new Tone(10*C1, beat*(1.0/4 - 0.1), 0.1);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
				}
			},
			{
				time: 1.75*beat,
				action: function () {
					var sound1 = new Tone(6*C1, beat*(1.0/4 - 0.1), 0.1);
					var sound2 = new Tone(8*C1, beat*(1.0/4 - 0.1), 0.1);
					var sound3 = new Tone(10*C1, beat*(1.0/4 - 0.1), 0.1);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
				}
			},
			{
				time: 2*beat,
				action: function () {
					var sound1 = new Tone(7*C1, beat*(1.0/2 - 0.1), 0.1);
					var sound2 = new Tone(9*C1, beat*(1.0/2 - 0.1), 0.1);
					var sound3 = new Tone(11*C1, beat*(1.0/2 - 0.1), 0.1);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
				}
			},
			{
				time: 2.5*beat,
				action: function () {
					var sound1 = new Tone(7*C1, beat*(1.0/6 - 0.1), 0.1);
					var sound2 = new Tone(9*C1, beat*(1.0/6 - 0.1), 0.1);
					var sound3 = new Tone(11*C1, beat*(1.0/6 - 0.1), 0.1);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
				}
			},
			{
				time: 2.6667*beat,
				action: function () {
					var sound1 = new Tone(6*C1, beat*(1.0/6 - 0.1), 0.1);
					var sound2 = new Tone(8*C1, beat*(1.0/6 - 0.1), 0.1);
					var sound3 = new Tone(10*C1, beat*(1.0/6 - 0.1), 0.1);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
				}
			},
			{
				time: 2.8333*beat,
				action: function () {
					var sound1 = new Tone(7*C1, beat*(1.0/6 - 0.1), 0.1);
					var sound2 = new Tone(9*C1, beat*(1.0/6 - 0.1), 0.1);
					var sound3 = new Tone(11*C1, beat*(1.0/6 - 0.1), 0.1);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
				}
			},
			{
				time: 3*beat,
				action: function () {
					var sound1 = new Tone(8*C1, beat*1.05, 0.1);
					var sound2 = new Tone(10*C1, beat*1.05, 0.1);
					var sound3 = new Tone(12*C1, beat*1.05, 0.1);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
				}
			}
		]);
		seq.start();
	},
	'gameOver': function () {
		var tempo = 60; // bpm
		var beat = 60*1000/tempo; // ms
		var seq = new Sequence([
			{
				time: beat/3,
				action: function () {
					var sound = new Tone(2*C1, beat*(2.0/3 - 0.05), 0.1);
					sound.setFormula('triangle');
					sound.play();
				}
			},
			{
				time: beat/2,
				action: function () {
					var sound = new Tone(3*C1, beat*(0.5 - 0.05), 0.04);
					sound.setFormula('triangle');
					sound.play();
				}
			},
			{
				time: 2*beat/3,
				action: function () {
					var sound = new Tone(4*C1, beat*(1.0/3 - 0.05), 0.06);
					sound.setFormula('triangle');
					sound.play();
				}
			},
			{
				time: 5*beat/6,
				action: function () {
					var sound = new Tone(5*C1, beat*(1.0/6 - 0.05), 0.08);
					sound.setFormula('triangle');
					sound.play();
				}
			},
			{
				time: beat,
				action: function () {
					var sound1 = new Tone(12*C1, beat*2, 0.15);
					var sound2 = new Tone(15*C1, beat*2, 0.15);
					var sound3 = new Tone(18*C1, beat*2, 0.15);
					var sound4 = new Tone(22*C1, beat*2, 0.15);
					var sound5 = new Tone(28*C1, beat*2, 0.15);
					sound1.setFormula('triangle');
					sound2.setFormula('triangle');
					sound3.setFormula('triangle');
					sound4.setFormula('triangle');
					sound5.setFormula('triangle');
					sound1.play();
					sound2.play();
					sound3.play();
					sound4.play();
					sound5.play();
				}
			}
		]);
		seq.start();
	}
}