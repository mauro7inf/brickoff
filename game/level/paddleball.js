levelScreen.initPaddleAndBallA = function () {
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

levelScreen.initPaddleAndBallHalfSize = function () { // doesn't work...
	gameCtx.lineWidth = 2;
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;
	var paddle = new PlayerPaddle((gameCanvas.width + lb - rb)*0.5, (gameCanvas.height + tb - bb)*(5.0/6.0), 25);
	paddle.setMaxSpeed(paddle.maxSpeed/2.0);
	paddle.capturing = true;
	paddle.subtype = 'halfSize';
	this.paddle = paddle;
	var ball = new CueBall(gameCanvas.width*0.5, (gameCanvas.height + tb - bb)*(5.0/6.0), 0, 0, 7.5);
	ball.captured = paddle;
	ball.subtype = 'halfSize';
	this.balls.push(ball);
};