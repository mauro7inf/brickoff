levelScreen.initBricks1 = function () {
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 6; j++) {
			var brick = new SimpleBrick(54 + i*(4 + (gameCanvas.width - 144.0)/10.0),
										150 + 24*j,
										(gameCanvas.width - 144.0)/10.0,
										20,
										8000000);
			brick.HP = (brick.HP * (7 - j))/7;
			brick.update(); // make sure the color on the brick is correct
			this.bricks.push(brick);
		}
	}
};