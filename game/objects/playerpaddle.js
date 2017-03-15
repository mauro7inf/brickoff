function PlayerPaddle(x, y, radius) {
	// basics
	this.type = "PlayerPaddle";
	this.subtype = "normal";
	this.locked = false;
	
	// definition
	this.radius = radius;
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	
	// physical parameters
	this.mass = this.radius*this.radius*5; // the player's paddle is not governed by physics
	this.maxSpeed = undefined; // pixels/s
	this.currentMaxSpeed = undefined;
	this.currentMaxDistancePerFrame = undefined;
	this.timeToMaxSpeedWhenCapturing = 100; // in s
	this.setMaxSpeed(4800);
	
	// drawing
	this.fillR = 255;
	this.fillG = 255;
	this.fillB = 255;
	this.fillA = 1;
	this.strokeR = 176;
	this.strokeG = 160;
	this.strokeB = 224;
	this.strokeA = 1;
	this.liftedFillR = 255;
	this.liftedFillG = 255;
	this.liftedFillB = 255;
	this.liftedFillA = 0.33;
	this.capturingFillR = 255;
	this.capturingFillG = 255;
	this.capturingFillB = 255;
	this.capturingFillA = 0.67;
	
	// movement
	this.moveToX = x;
	this.moveToY = y;
	this.timeForVelocityAverage = 100; // in ms
	this.nVelocityFrames = Math.floor(this.timeForVelocityAverage/globalOptions.mspf);
	this.pastLocations = [{x: x, y: y}];
	this.lastPosition = {x: x, y: y};
	this.lastVelocity = {x: 0, y: 0};
	
	// game state
	this.lifted = false;
	this.capturing = false;
}
PlayerPaddle.prototype = new GameObject();

PlayerPaddle.prototype.update = function () {
	if (this.locked) return;
	while (this.pastLocations.length >= this.nVelocityFrames) {
		this.pastLocations.shift();
	}
	this.pastLocations.push({x: this.x, y: this.y});
	this.lastPosition = {x: this.x, y: this.y};
	this.lastVelocity = {x: this.vy, y: this.vy};
	if (gameState.title) {
		this.fillA = titleScreen.fadeOutParameter;
		this.strokeA = titleScreen.fadeOutParameter;
	}
	var x = this.moveToX;
	var y = this.moveToY;
	if (this.capturing) { // limit acceleration so that ball doesn't fall out
		var dx = x - this.x;
		var dy = y - this.y;
		var lastdx = this.x - this.pastLocations[this.pastLocations.length - 2];
		var lastdy = this.y - this.pastLocations[this.pastLocations.length - 2];
		var maxAcceleration = (this.currentMaxSpeed/this.timeToMaxSpeedWhenCapturing)*(globalOptions.mspf/1000.0)*(globalOptions.mspf/1000.0);
		// acceleration in pixels/frame^2
		if (distance(dx, dy, lastdx, lastdy) > maxAcceleration) {
			var k = quadraticPlus(dx*dx + dy*dy, -2*(dx*lastdx + dy*lastdy), lastdx*lastdx + lastdy*lastdy - maxAcceleration*maxAcceleration);
			console.log(k);
			x = k*dx + this.x;
			y = k*dy + this.y;
		}
	}
	// limit speed
	var ds = distance(this.x, this.y, x, y);
	if (ds > this.currentMaxDistancePerFrame) {
		x = this.x + (x - this.x)*this.currentMaxDistancePerFrame/ds;
		y = this.y + (y - this.y)*this.currentMaxDistancePerFrame/ds;
	}
	this.vx = (x - this.pastLocations[0].x)/(this.pastLocations.length*globalOptions.mspf/1000.0);
	this.vy = (y - this.pastLocations[0].y)/(this.pastLocations.length*globalOptions.mspf/1000.0);
	this.x = x;
	this.y = y;
}

PlayerPaddle.prototype.draw = function (f) {
	if (f === undefined) f = 1;
	if (!this.lifted && !this.capturing) {
		gameCtx.fillStyle = 'rgba(' + this.fillR + ',' + this.fillG + ',' + this.fillB + ',' +
			this.fillA*f + ')';
	} else if (this.lifted) {
		gameCtx.fillStyle = 'rgba(' + this.liftedFillR + ',' + this.liftedFillG + ',' + this.liftedFillB + ',' +
			this.liftedFillA*f + ')';
	} else {
		gameCtx.fillStyle = 'rgba(' + this.capturingFillR + ',' + this.capturingFillG + ',' + this.capturingFillB + ',' +
			this.capturingFillA*f + ')';
	}
	gameCtx.strokeStyle = 'rgba(' + this.strokeR + ',' + this.strokeG + ',' + this.strokeB + ',' +
		this.strokeA*f + ')';
	gameCtx.lineWidth = 2;
	gameCtx.beginPath();
	gameCtx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
	gameCtx.fill();
	gameCtx.stroke();
	if (debug) {
	 	gameCtx.font = '16px sans-serif';
		gameCtx.strokeText(Math.floor(distance(0,0,this.vx,this.vy)), this.x - 8, this.y + 6);
	}
};

PlayerPaddle.prototype.move = function (x, y) {
	this.moveToX = x;
	this.moveToY = y;
};

PlayerPaddle.prototype.capture = function (ball) {
	if (ball.type == "CueBall") {
		var ds = distance(this.x, this.y, ball.x, ball.y);
		if (ds < this.radius + ball.radius) {
			ball.capturedBy(this);
			this.capturing = true;
			if (this.subtype == 'halfSize' && ball.subtype == 'halfSize') {
				soundBank.halfSizePaddleCapture();
			} else {
				soundBank.paddleCapture();
			}
			if (ball.maxSpeed < this.currentMaxSpeed) {
				this.currentMaxSpeed = ball.maxSpeed;
				this.currentMaxDistancePerFrame = ball.maxSpeed*globalOptions.mspf/1000.0;
			}
		}
	}
	this.lifted = false;
};

PlayerPaddle.prototype.reviseCapture = function (ball) {
	this.currentMaxSpeed = this.maxSpeed;
	this.currentMaxDistancePerFrame = this.maxSpeed*globalOptions.mspf/1000.0;
	if (ball.type == "CueBall") {
		var ds = distance(this.x, this.y, ball.x, ball.y);
		if (ds < this.radius + ball.radius) {
			ball.capturedBy(this);
			this.capturing = true;
			if (ball.maxSpeed < this.currentMaxSpeed) {
				this.currentMaxSpeed = ball.maxSpeed;
				this.currentMaxDistancePerFrame = ball.maxSpeed*globalOptions.mspf/1000.0;
			}
		} else {
			ball.captured = undefined;
		}
	}
};

PlayerPaddle.prototype.setMaxSpeed = function (maxSpeed) {
	this.maxSpeed = maxSpeed;
	if (!this.capturing || (this.currentMaxSpeed > this.maxSpeed)) {
		// the intended behavior is that the max speed while capturing is the minimum max speed of the paddle and ball(s),
		// but since we don't have a reference to the ball(s) here, we'll just set the current max speed to the lowest value we do have.
		this.resetCurrentMaxSpeed();
	}
};

PlayerPaddle.prototype.resetCurrentMaxSpeed = function () {
	this.currentMaxSpeed = this.maxSpeed;
	this.currentMaxDistancePerFrame = this.maxSpeed*globalOptions.mspf/1000.0;
}