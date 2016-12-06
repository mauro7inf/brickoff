levelScreen.initPaddleAndBallA = function () {
	// could be level-dependent
	gameCtx.lineWidth = 2;
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;
	var paddle = new PlayerPaddle((gameCanvas.width + lb - rb)*0.5, (gameCanvas.height + tb - bb)*(5.0/6.0), 50);
	paddle.capturing = true;
	this.paddle = paddle;
	var ball = new CueBall(gameCanvas.width*0.5, (gameCanvas.height + tb - bb)*(5.0/6.0), 0, 0, 15);
	ball.captured = paddle;
	this.balls.push(ball);
};