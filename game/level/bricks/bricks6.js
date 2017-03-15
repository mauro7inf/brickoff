levelScreen.initBricks6 = function () {
	var self = this;

	var brickWidth = (gameCanvas.width - 140.0)/19;
	var brickHeight = 10;

	var createBrick = function (r, c) { // rows and columns labeled from the top left, columns from 0 to 18 and rows about the same
		return new SimpleBrick(52 + c*(2 + brickWidth), 100 + r*(2 + brickHeight), brickWidth, brickHeight, 2000000);
	};

	var createGreenBrick = function (r, c) {
		var brick = createBrick(r, c);
		brick.strokeR = 64;
		brick.strokeG = 255;
		brick.strokeB = 160;
		brick.fillR = 32;
		brick.fillG = 127;
		brick.fillB = 80;
		brick.frequency2 = 21*C1;
		brick.frequency1 = 24*C1;
		return brick;
	};

	var createBlueBrick = function (r, c) {
		var brick = createBrick(r, c);
		brick.strokeR = 0;
		brick.strokeG = 160;
		brick.strokeB = 255;
		brick.fillR = 0;
		brick.fillG = 80;
		brick.fillB = 127;
		brick.frequency2 = 15*C1;
		brick.frequency1 = 24*C1;
		return brick;
	};

	var createPinkBrick = function (r, c) {
		var brick = createBrick(r, c);
		brick.strokeR = 255;
		brick.strokeG = 160;
		brick.strokeB = 255;
		brick.fillR = 127;
		brick.fillG = 80;
		brick.fillB = 127;
		brick.frequency2 = 18*C1;
		brick.frequency1 = 24*C1;
		return brick;
	};

	var finishBrickSetup = function (brick, r) {
		brick.HP = (brick.HP * (6 - r/4)/6);
		brick.lineWidth = 1;
		brick.update(); // make sure color matches HP
		self.bricks.push(brick);
	};

	// positions: there are 6 rows labeled 0-5, with 9 bricks (0-8) on even rows and 10 (0-9) on odd, staggered
	// there should be 19 bricks of each color
	var greenPositions = [[0, 3], [0, 4], [0, 5],
		[1, 0], [1, 2], [1, 4], [1, 5], [1, 7], [1, 9],
		[2, 0], [2, 2], [2, 6], [2, 8],
		[3, 1], [3, 8],
		[4, 0], [4, 3], [4, 5], [4, 8]];
	var bluePositions = [[0, 0], [0, 1], [0, 7], [0, 8],
		[1, 1], [1, 8],
		[2, 1], [2, 4], [2, 7],
		[3, 0], [3, 2], [3, 3], [3, 6], [3, 7], [3, 9],
		[4, 1], [4, 2], [4, 6], [4, 7]];
	var pinkPositions = [[0, 2], [0, 6],
		[1, 3], [1, 6],
		[2, 3], [2, 5],
		[3, 4], [3, 5],
		[4, 4],
		[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9]];

	for (var i = 0; i < greenPositions.length; i++) {
		var rc = greenPositions[i];
		var r = rc[0]; // must multiply by 4
		var c = 2*rc[1] + ((r + 1) % 2);
		var brick = createGreenBrick(4*r, c);
		finishBrickSetup(brick, 4*r);
	}

	for (var i = 0; i < bluePositions.length; i++) {
		var rc = bluePositions[i];
		var r = rc[0]; // must multiply by 4
		var c = 2*rc[1] + ((r + 1) % 2);
		var brick = createBlueBrick(4*r, c);
		finishBrickSetup(brick, 4*r);
	}

	for (var i = 0; i < pinkPositions.length; i++) {
		var rc = pinkPositions[i];
		var r = rc[0]; // must multiply by 4
		var c = 2*rc[1] + ((r + 1) % 2);
		var brick = createPinkBrick(4*r, c);
		finishBrickSetup(brick, 4*r);
	}

	/*for (var r = 0; r <= 20; r += 4) {
		for (var c = (r/4 + 1) % 2; c <= 18; c += 2) {
			if (r/4 < 2) { // top 2 rows
				brick = createGreenBrick(r, c);
			} else if (r/4 < 4) { // next 2 rows
				brick = createBlueBrick(r, c);
			} else { // bottom 2 rows
				brick = createPinkBrick(r, c);
			}
			finishBrickSetup(brick, r);
		}
	}*/
};