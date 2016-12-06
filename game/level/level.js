/*********************************************************************************************\
██╗     ███████╗██╗   ██╗███████╗██╗         ███████╗ ██████╗██████╗ ███████╗███████╗███╗   ██╗
██║     ██╔════╝██║   ██║██╔════╝██║         ██╔════╝██╔════╝██╔══██╗██╔════╝██╔════╝████╗  ██║
██║     █████╗  ██║   ██║█████╗  ██║         ███████╗██║     ██████╔╝█████╗  █████╗  ██╔██╗ ██║
██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║         ╚════██║██║     ██╔══██╗██╔══╝  ██╔══╝  ██║╚██╗██║
███████╗███████╗ ╚████╔╝ ███████╗███████╗    ███████║╚██████╗██║  ██║███████╗███████╗██║ ╚████║
╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚══════╝    ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝
\*********************************************************************************************/

levelScreen = {
	// basics
	level: undefined,
	levelWon: false,
	death: false,
	
	// animation
	titleFader: undefined,
	levelFader: undefined,
	levelOutFader: undefined,
	deathFader: undefined,
	
	// game objects
	balls: undefined,
	bricks: undefined,
	walls: undefined,
	paddle: undefined,
	
	// misc state
	mouseDown: false,
	retrieveLostBallNext: false,

	// level geometry -- it's set by each level anyway
	tb: 50, // top buffer between end of canvas and wall
	bb: 50, // bottom buffer
	lb: 50, // left buffer
	rb: 50, // right buffer
	cornerRadius: 100, // corner radius
	goalWidth: 250, // width of goal area along bottom wall
	goalRadius: 45, // radius of goal's rounded edges;
	extraRadius: 5, // if the goal radius is too big, this smoothes out the hidden goal corner
	edgeWidth: 5, // width of edge around game canvas
	centerLineOffset: 0, // how far down the center line is from the middle

	// level data
	levelData: undefined
};

levelScreen.initGame = function () {
	player.initPlayer();
	this.initLevel(startingLevel);
}

levelScreen.initLevel = function (n) {
	//console.log('init level ' + n);
	gameState.level = true;
	this.level = n;
	this.levelWon = false;
	this.death = false;
	this.retrieveLostBallNext = false;

	// fading
	this.titleFader = new Fader(1.0, 1.0, 1.0); // fade in for 1 second, wait for 1 second, fade out for 1 second
	this.titleFader.start();
	this.levelFader = new Fader(1.0, 0.0, 1.0); // fade in for 1 second, then out for 1 second, but we're going to pause it
	this.endingFader = new Fader(1.0, 1.0, 1.0); // same as title fader
	this.deathFader = undefined;
	
	// reset paddle and balls
	this.paddle = undefined;
	this.balls = [];
	this.bricks = [];

	// set geometry
	var geometry = this.levelData[this.level]['geometry'];
	this.cornerRadius = geometry.cornerRadius;
	this.tb = geometry.tb;
	this.bb = geometry.bb;
	this.lb = geometry.lb;
	this.rb = geometry.rb;
	this.goalWidth = geometry.goalWidth;
	this.goalRadius = geometry.goalRadius;
	if (geometry.centerLineOffset !== undefined) this.centerLineOffset = geometry.centerLineOffset;

	// make walls
	this[this.levelData[this.level]['initWalls']]();

	// edit player lives
	player.lives += this.levelData[this.level]['newLives'];
};

levelScreen.levelStart = function () {
	this[this.levelData[this.level]['initPaddleAndBall']]();
	this[this.levelData[this.level]['initBricks']]();
};

levelScreen.nextLevel = function () {
	if (this.level >= endingLevel) {
		gameState.level = false;
		endingScreen.gameWon();
	} else {
		levelScreen.initLevel(this.level + 1);
	}
};

levelScreen.gameOver = function () {
	gameState.level = false;
	endingScreen.gameOver();
};

levelScreen.mouseMove = function (x, y) {
	if (this.paddle) this.paddle.move(x,y);
};

levelScreen.mouseUp = function (x, y) {
	this.retrieveLostBallNext = true;
};

levelScreen.capture = function () {
	for (var b = 0; b < this.balls.length; b++) {
		this.paddle.capture(this.balls[b]);
	}
};

levelScreen.reviseCapture = function () {
	this.paddle.capturing = false;
	for (var b = 0; b < this.balls.length; b++) {
		this.paddle.reviseCapture(this.balls[b]);
	}
};

levelScreen.retrieveLostBall = function () {
	var lostBall = false;
	for (var b = 0; b < this.balls.length; b++) {
		if (this.balls[b].expired) lostBall = true;
	}
	if (!lostBall) return;
	var minTouch = this.balls[0].lastTouched + 1;
	var minBall = -1;
	for (var b = 0; b < this.balls.length; b++) {
		if (this.balls[b].lastTouched < minTouch) {
			minTouch = this.balls[b].lastTouched;
			minBall = b;
		}
	}
	this.paddle.capturing = true;
	this.balls[minBall].captured = this.paddle;
	this.balls[minBall].x = this.paddle.x + (4*Math.random() - 2); // don't center it to prevent concentric collisions
	this.balls[minBall].y = this.paddle.y + (4*Math.random() - 2);
	this.balls[minBall].lastPosition.x = this.balls[minBall].x;
	this.balls[minBall].lastPosition.y = this.balls[minBall].y;
	this.balls[minBall].vx = 0;
	this.balls[minBall].vy = 0;
};

/*********************************************************************************************\
██╗     ███████╗██╗   ██╗███████╗██╗         ██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗
██║     ██╔════╝██║   ██║██╔════╝██║         ██║   ██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
██║     █████╗  ██║   ██║█████╗  ██║         ██║   ██║██████╔╝██║  ██║███████║   ██║   █████╗  
██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║         ██║   ██║██╔═══╝ ██║  ██║██╔══██║   ██║   ██╔══╝  
███████╗███████╗ ╚████╔╝ ███████╗███████╗    ╚██████╔╝██║     ██████╔╝██║  ██║   ██║   ███████╗
╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚══════╝     ╚═════╝ ╚═╝     ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
\*********************************************************************************************/

levelScreen.update = function () {
	if (this.paddle) {
		if (this.mouseDown) {
			this.paddle.lifted = true;
			this.paddle.capturing = false;
		} else {
			if (this.paddle.lifted) this.capture();
			else if (this.paddle.capturing) this.reviseCapture();
		}
		if (this.retrieveLostBallNext) {
			this.retrieveLostBall();
			this.retrieveLostBallNext = false;
		}
	}
	if (this.levelFader && this.levelFader.mode === 'paused' && !this.death) {
		// updates
		if (this.paddle) this.paddle.update();
		for (var b = 0; b < this.balls.length; b++) {
			this.balls[b].update();
			// check if ball has disappeared
			if (this.balls[b].y > gameCanvas.height + this.balls[b].radius) this.balls[b].remove = true;
		}
		for (var b = 0; b < this.bricks.length; b++) {
			this.bricks[b].update();
		}
		// collisions
		if (this.paddle) {
			for (var w = 0; w < this.walls.length; w++) {
				collide(this.walls[w], this.paddle);
			}
		}
		for (var b = 0; b < this.balls.length; b++) {
			for (var w = 0; w < this.walls.length; w++) {
				collide(this.walls[w], this.balls[b]);
			}
			for (var b2 = b + 1; b2 < this.balls.length; b2++) {
				collide(this.balls[b], this.balls[b2]);
			}
			for (var b2 = 0; b2 < this.bricks.length; b2++) {
				collide(this.balls[b], this.bricks[b2]);
			}
			if (this.paddle) collide(this.balls[b], this.paddle);
		}
		for (var b = 0; b < this.bricks.length; b++) {
			for (var w = 0; w < this.walls.length; w++) {
				collide(this.walls[w], this.bricks[b]);
			}
			for (var b2 = b + 1; b2 < this.bricks.length; b2++) {
				collide(this.bricks[b], this.bricks[b2]);
			}
			if (this.paddle) collide(this.bricks[b], this.paddle);
		}
		// remove dead objects
		for (var b = 0; b < this.balls.length; b++) {
			if (this.balls[b].remove) {
				this.balls[b].death();
				this.balls.splice(b,1);
				b--;
			}
		}
		for (var b = 0; b < this.bricks.length; b++) {
			if (this.bricks[b].remove) {
				this.bricks[b].death();
				this.bricks.splice(b,1);
				b--;
			}
		}
		// check whether balls have expired (been left untouched too long)
		for (var b = 0; b < this.balls.length; b++) {
			if (this.balls[b].lastTouched > this.balls[b].expiration) this.balls[b].expired = true;
		}
		// check whether the level has been won
		if (!this.levelWon && this.bricks.length == 0) {
			this.levelWon = true;
			this.paddle = undefined;
			this.balls = [];
			this.endingFader.start();
			this.levelFader.start();
		}
		// check whether all balls have been lost
		if (!this.levelWon && this.balls.length == 0) {
			this.death = true;
			soundBank.death();
			if (player.lives > 0) {
				this.deathFader = new Fader(0.5, 0.1, 0.5);
			} else {
				this.deathFader = new Fader(1.5);
				this.death = 'final';
			}
			this.deathFader.invertFader();
			this.deathFader.fadeParameter = 1.0;
			this.deathFader.start();
		}
	} else if (this.death) {
		if (this.deathFader) this.deathFader.update();
		if ((this.deathFader && this.deathFader.fadeMode == 'fadeOut' && this.balls.length == 0) ||
			(this.death == 'final' && this.deathFader && this.deathFader.mode == 'done')) {
			this.paddle = undefined;
			player.die();
			if (player.lives >= 0) {
				this[this.levelData[this.level]['initPaddleAndBall']]();
			}
		} else if (this.deathFader && this.deathFader.mode == 'done') {
			this.death = false;
			this.deathFader = undefined;
		}
	} else {
		if (this.titleFader) this.titleFader.update();
		if (this.levelFader) this.levelFader.update();
		if (this.endingFader) this.endingFader.update();
		if (this.levelFader && this.levelFader.mode == 'inactive' && this.titleFader && this.titleFader.fadeMode == 'fadeOut') {
			this.levelFader.start();
			this.levelStart();
		}
		if (this.titleFader && this.titleFader.mode == 'done' && this.levelFader && this.levelFader.fadeMode == 'fadeOut') {
			this.titleFader = undefined;
			this.levelFader.pause();
		}
		if (this.levelFader && this.levelFader.mode == 'done') {
			this.levelFader = undefined;
		}
		if (this.endingFader && this.endingFader.mode == 'done') {
			this.endingFader = undefined;
			this.nextLevel();
		}
	}
};

/*****************************************************************************\
██╗     ███████╗██╗   ██╗███████╗██╗         ██████╗ ██████╗  █████╗ ██╗    ██╗
██║     ██╔════╝██║   ██║██╔════╝██║         ██╔══██╗██╔══██╗██╔══██╗██║    ██║
██║     █████╗  ██║   ██║█████╗  ██║         ██║  ██║██████╔╝███████║██║ █╗ ██║
██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║         ██║  ██║██╔══██╗██╔══██║██║███╗██║
███████╗███████╗ ╚████╔╝ ███████╗███████╗    ██████╔╝██║  ██║██║  ██║╚███╔███╔╝
╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚══════╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ 
\*****************************************************************************/

levelScreen.draw = function () {
	//console.log('draw level');
	var deathFadeParameter = this.deathFader ? this.deathFader.fadeParameter : 1.0;
	var levelFadeParameter = this.levelFader ? this.levelFader.fadeParameter : 1.0;
	var f = deathFadeParameter * levelFadeParameter;
	this.drawBackground();
	this.drawOutline();
	if (this.titleFader) this.drawTitle();
	if (this.endingFader && this.endingFader.mode != 'inactive') this.drawEnding();
	if ((!this.endingFader || this.endingFader.mode == 'inactive') && (!this.levelFader || this.levelFader.mode != 'inactive')) this.drawGameWall(f);
	for (var w = 0; w < this.walls.length; w++) this.walls[w].draw(f);
	for (var b = 0; b < this.balls.length; b++) this.balls[b].draw(f);
	for (var b = 0; b < this.bricks.length; b++) this.bricks[b].draw(f);
	if (this.paddle) this.paddle.draw(f);
	if (this.levelFader) this.drawStatus(f);
};

levelScreen.drawBackground = function () {
	if ((this.titleFader && this.titleFader.fadeMode == 'fadeIn') || (this.endingFader && this.endingFader.fadeMode == 'fadeOut') || (this.death == 'final' && this.deathFader)) {
		var fadeParameter = 1;
		if (this.titleFader && this.titleFader.fadeMode == 'fadeIn') fadeParameter = this.titleFader.fadeParameter;
		else if (this.endingFader && this.endingFader.fadeMode == 'fadeOut') fadeParameter = this.endingFader.fadeParameter;
		else if (this.death == 'final' && this.deathFader) fadeParameter = this.deathFader.fadeParameter;
		gameCtx.fillStyle = '#1E1E1E';
		gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
		gameCtx.fillStyle = 'rgba(0,0,0,' + fadeParameter + ')';
		gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	} else {
		gameCtx.fillStyle = 'rgb(0,0,0)';
		gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	}
};

levelScreen.drawOutline = function () {
	var f = 1;
	if (this.titleFader && this.titleFader.fadeMode == "fadeIn") f = this.titleFader.fadeParameter;
	else if (this.endingFader && this.endingFader.fadeMode == 'fadeOut') f = this.endingFader.fadeParameter;
	else if (this.deathFader && this.death == 'final') f = this.deathFader.fadeParameter;
	//drawOutline(rgba(0, 0, 30, f), rgba(64, 64, 255, f)); // original blue outline
	var outlineFill = this.levelData[this.level]['outlineFill'];
	var outlineStroke = this.levelData[this.level]['outlineStroke'];
	drawOutline(rgba(outlineFill.r, outlineFill.g, outlineFill.b, f), rgba(outlineStroke.r, outlineStroke.g, outlineStroke.b, f));
};

levelScreen.drawTitle = function () {
	var titleFadeParameter = 0;
	if (this.titleFader && this.titleFader.mode == 'active') titleFadeParameter = this.titleFader.fadeParameter;
	gameCtx.fillStyle = 'rgba(237, 237, 237, ' + titleFadeParameter + ')';
	gameCtx.font = '72px serif';
	var levelNWidth = gameCtx.measureText('Level ' + this.level).width;
	//gameCtx.fillText('Level ' + this.level, gameCanvas.width*0.5 - levelNWidth*0.5, gameCanvas.height*0.5 + 18);
	gameCtx.fillText('Level ' + this.level, gameCanvas.width*0.5 - levelNWidth*0.5, gameCanvas.height*0.5 - 36);
	var titleWidth = gameCtx.measureText(this.levelData[this.level].title).width;
	gameCtx.fillText(this.levelData[this.level].title, gameCanvas.width*0.5 - titleWidth*0.5, gameCanvas.height*0.5 + 54);
}

levelScreen.drawEnding = function () {
	var endingFadeParameter = 0;
	if (this.endingFader && this.endingFader.mode == 'active') endingFadeParameter = this.endingFader.fadeParameter;
	gameCtx.fillStyle = 'rgba(237, 237, 237, ' + endingFadeParameter + ')';
	gameCtx.font = '72px serif';
	var levelNWidth = gameCtx.measureText('Level ' + this.level).width;
	gameCtx.fillText('Level ' + this.level, gameCanvas.width*0.5 - levelNWidth*0.5, gameCanvas.height*0.5 - 36);
	var completeWidth = gameCtx.measureText('Complete').width;
	gameCtx.fillText('Complete', gameCanvas.width*0.5 - completeWidth*0.5, gameCanvas.height*0.5 + 54);
}

levelScreen.drawGameWall = function (f) {
	var gradients = this[this.levelData[this.level]['gradients']](f);
	this[this.levelData[this.level]['drawGameWall']](gradients.stroke, gradients.fill);
}

levelScreen.drawStatus = function (f) {
	if (f === undefined) f = 1;
	// top of screen, at least for now
	gameCtx.fillStyle = 'rgba(237, 237, 237, ' + f + ')';
	gameCtx.font = '36px serif';
	if (player.lives >= 0) {
		var livesWidth = gameCtx.measureText(player.lives).width;
		var livesHeight = 26; // there's no height metric
		gameCtx.fillText(player.lives, gameCanvas.width - this.edgeWidth - livesWidth - 8, this.edgeWidth + livesHeight + 8);
	}
	// X
	gameCtx.strokeStyle = rgba(237, 237, 237, f);
	gameCtx.lineWidth = 2;
	gameCtx.beginPath();
	gameCtx.moveTo(gameCanvas.width - this.edgeWidth - livesWidth - 8 - 16, this.edgeWidth + livesHeight + 8);
	gameCtx.lineTo(gameCanvas.width - this.edgeWidth - livesWidth - 8 - 16 - livesHeight, this.edgeWidth + 8);
	gameCtx.moveTo(gameCanvas.width - this.edgeWidth - livesWidth - 8 - 16, this.edgeWidth + 8);
	gameCtx.lineTo(gameCanvas.width - this.edgeWidth - livesWidth - 8 - 16 - livesHeight, this.edgeWidth + livesHeight + 8);
	gameCtx.stroke();
	// ball icon
	var ballRadius = 15;
	gameCtx.fillStyle = rgba(255, 255, 255, f);
	gameCtx.strokeStyle = rgba(141, 128, 180, f);
	gameCtx.lineWidth = 2;
	gameCtx.beginPath();
	gameCtx.arc(gameCanvas.width - this.edgeWidth - livesWidth - 8 - 16 - livesHeight - 16 - ballRadius, this.edgeWidth + (livesHeight/2.0) + 8, ballRadius, 0, 2*Math.PI, true);
	gameCtx.fill();
	gameCtx.stroke();
}