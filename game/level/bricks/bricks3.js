levelScreen.initBricks3 = function () {
	var bigBrickSize = (gameCanvas.width - 132.0)/7.0;
	var middleBrickSize = (bigBrickSize - 4.0)/2.0;
	var smallBrickSize = (middleBrickSize - 4.0)/2.0;
	// positions of the top left corner in units of the small brick, whose side is 1/4 of the big one
	var bigBrickPositions = [
		[0, 0], [4, 4], [8, 8], [16, 8], [20, 4], [24, 0], [12, 0]
	];
	var middleBrickPositions = [
		[4, 2], [2, 4], [8, 6], [6, 8], [12, 10], [10, 12], [14, 10], [16, 12], [18, 6], [20, 8], [22, 2], [24, 4], [10, 0], [13, 4], [16, 0]
	];
	var smallBrickPositions = [
		[1, 4], [3, 6], [5, 8], [7, 10], [9, 12], [4, 1], [6, 3], [8, 5], [10, 7], [12, 9], [12, 12],
		[26, 4], [24, 6], [22, 8], [20, 10], [18, 12], [23, 1], [21, 3], [19, 5], [17, 7], [15, 9], [15, 12],
		[9, 0], [11, 2], [16, 2], [18, 0]
	];
	for (var i = 0; i < bigBrickPositions.length; i++) {
		var bigBrick = new HealingBrick(54 + bigBrickPositions[i][0]*(4 + smallBrickSize),
										54 + bigBrickPositions[i][1]*(4 + smallBrickSize),
										bigBrickSize,
										bigBrickSize,
										16000000);
		bigBrick.fillR = 96;
		bigBrick.fillG = 96;
		bigBrick.fillB = 16;
		bigBrick.strokeR = 192;
		bigBrick.strokeG = 192;
		bigBrick.strokeB = 32;
		bigBrick.frequency = 40*C1;
		this.bricks.push(bigBrick);
	}
	for (var i = 0; i < middleBrickPositions.length; i++) {
		var middleBrick = new HealingBrick(54 + middleBrickPositions[i][0]*(4 + smallBrickSize),
											54 + middleBrickPositions[i][1]*(4 + smallBrickSize),
											middleBrickSize,
											middleBrickSize,
											8000000);
		middleBrick.fillR = 80;
		middleBrick.fillG = 80;
		middleBrick.fillB = 80;
		middleBrick.strokeR = 160;
		middleBrick.strokeG = 160;
		middleBrick.strokeB = 160;
		this.bricks.push(middleBrick);
	}
	for (var i = 0; i < smallBrickPositions.length; i++) {
		var smallBrick = new HealingBrick(54 + smallBrickPositions[i][0]*(4 + smallBrickSize),
											54 + smallBrickPositions[i][1]*(4 + smallBrickSize),
											smallBrickSize,
											smallBrickSize,
											4000000);
		smallBrick.fillR = 92;
		smallBrick.fillG = 57;
		smallBrick.fillB = 25;
		smallBrick.strokeR = 184;
		smallBrick.strokeG = 114;
		smallBrick.strokeB = 50;
		smallBrick.frequency = 72*C1;
		this.bricks.push(smallBrick);
	}
}