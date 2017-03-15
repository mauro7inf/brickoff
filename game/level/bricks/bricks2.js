levelScreen.initBricks2 = function () {
	for (var i = 0; i < 10; i++) {
		if (i == 2 || i == 7) continue;
		for (var j = 0; j < 6; j++) {
			var brick = new SimpleBrick(54 + i*(4 + (gameCanvas.width - 144.0)/10.0),
										150 + 24*j,
										(gameCanvas.width - 144.0)/10.0,
										20,
										8000000);
			var c = randomColor();
			brick.fillR = Math.floor(c.r/2.0);
			brick.fillG = Math.floor(c.g/2.0);
			brick.fillB = Math.floor(c.b/2.0);
			brick.strokeR = 2*brick.fillR;
			brick.strokeG = 2*brick.fillG;
			brick.strokeB = 2*brick.fillB;
			if (j % 3 == 2) brick.frequency2 = 22*C1;
			else if (j % 3 == 0) brick.frequency2 = 18*C1;
			this.bricks.push(brick);
		}
	}
};