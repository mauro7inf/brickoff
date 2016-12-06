levelScreen.initBricks5 = function () {
	var self = this;
	var r = 25.0;
	var hp = 80000000;
	ls = 2.0; // separation

	function createBomb(row, col, color) {
		var rEff = r + ls/2.0;
		var y = 300 - row*(rEff*Math.sqrt(3));
		var colEff = col - row*0.5;
		var x = 400 + colEff*2.0*rEff;

		var bomb = new Bomb(x, y, r, hp);
		if (color) {
			bomb.fillR = color.r/2.0;
			bomb.fillG = color.g/2.0;
			bomb.fillB = color.b/2.0;
			bomb.strokeR = color.r;
			bomb.strokeG = color.g;
			bomb.strokeB = color.b;
		}
		self.bricks.push(bomb);
	}

	var colors = {
		'0': {
			'0': { // 1
				r: 255,
				g: 255,
				b: 0
			}
		},
		'1': {
			'0': { // 2
				r: 0,
				g: 0,
				b: 255
			},
			'1': { // 3
				r: 255,
				g: 0,
				b: 0
			}
		},
		'2': {
			'0': { // 4
				r: 128,
				g: 0,
				b: 255
			},
			'1': { // 5
				r: 255,
				g: 128,
				b: 0
			},
			'2': { // 6
				r: 0,
				g: 255,
				b: 0
			}
		},
		'3': {
			'0': { // 7
				r: 128,
				g: 64,
				b: 0
			},
			'1': { // 8
				r: 48,
				g: 48,
				b: 48
			},
			'2': { // 9
				r: 255,
				g: 255,
				b: 128
			},
			'3': { // 10
				r: 128,
				g: 128,
				b: 255
			}
		},
		'4': {
			'0': { // 11
				r: 255,
				g: 128,
				b: 128
			},
			'1': { // 12
				r: 192,
				g: 128,
				b: 255
			},
			'2': { // 13
				r: 255,
				g: 192,
				b: 128
			},
			'3': { // 14
				r: 128,
				g: 255,
				b: 128
			},
			'4': { // 15
				r: 192,
				g: 160,
				b: 128
			}
		}
	}

	for (var row = 0; row < 5; row++) {
		for (var col = 0; col <= row; col++) {
			if (colors[row] && colors[row][col]) createBomb(row, col, colors[row][col]);
			else createBomb(row, col);
		}
	}
}