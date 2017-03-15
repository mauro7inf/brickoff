function CueBall(x, y, vx, vy, radius) {
	Ball.apply(this, arguments);
	// basics
	this.type = "CueBall";
	this.subtype = "normal";
	this.locked = false;
	
	// definition
	this.radius = radius;
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.area = this.radius*this.radius*Math.PI;
	
	// physical parameters
	this.density = 20.0/Math.PI;
	this.mass = this.area * this.density;
	this.bgDrag = 0.0; // fraction of velocity lost per second
	this.dragMultiplierPerFrame = Math.pow(1 - this.bgDrag, globalOptions.mspf/1000.0);
	this.compressionCoefficient = 8000.0; // unused at the moment
	this.rigidCollision = 0; // if a rigid collision has already happened this frame
	this.rigidVector = []; // unit normal vectors of collision
	
	// drawing
	this.fillR = 255;
	this.fillG = 255;
	this.fillB = 255;
	this.fillA = 1;
	this.strokeR = 141;
	this.strokeG = 128;
	this.strokeB = 180;
	this.strokeA = 1;
	this.expiredFillR = 255;
	this.expiredFillG = 255;
	this.expiredFillB = 255;
	this.expiredFillA = 0.5;
	
	// game data
	this.captured = undefined; // becomes the paddle if the ball is captured by the paddle
	this.lastTouched = 0;
	this.expired = false; // expiration is checked by the level to prevent creation of unnecessary date objects
	this.expiration = 30000; // in ms
}
CueBall.prototype = (function (ballConstructor, cueBallConstructor) {
    function protoCreator() {
        this.constructor = cueBallConstructor.prototype.constructor
    };
    protoCreator.prototype = ballConstructor.prototype;
    return new protoCreator();
})(Ball, CueBall);

CueBall.prototype.capturedBy = function (paddle) {
	this.captured = paddle;
}

CueBall.prototype.update = function () {
	if (this.locked) return;
	if (this.captured) {
		if (!this.captured.capturing) this.captured = undefined;
		else {
			if (distance(this.captured.x, this.captured.y, this.x, this.y) > this.radius + this.captured.radius) {
				this.captured = undefined;
			}
		}
	}
	if (this.captured) {
		GameObject.prototype.update.call(this);
		this.lastTouched = 0;
		this.expired = false;
		this.rigidCollision = 0; // reset the collision
		this.rigidVector = [];
		var nearCollFactor = 1;
		if (this.nearCollision) nearCollFactor = 0.5; // make sure ball doesn't tunnel
		this.nearCollision = false;
		var lastLoc = this.captured.pastLocations[this.captured.pastLocations.length - 1];
		var last2Loc = this.captured.pastLocations[this.captured.pastLocations.length - 2];
		var dx = (lastLoc.x - last2Loc.x);
		var dy = (lastLoc.y - last2Loc.y);
		var ds = distance(0,0,dx,dy);
		var v = ds*(globalOptions.mspf/1000.0);
		if (v > this.maxSpeed) {
			//console.log('reduced');
			this.x += dx*nearCollFactor*this.maxSpeed/v;
			this.y += dy*nearCollFactor*this.maxSpeed/v;
			this.vx = nearCollFactor*this.captured.lastVelocity.x*this.maxSpeed/v;
			this.vy = nearCollFactor*this.captured.lastVelocity.y*this.maxSpeed/v;
		} else {
			this.x += nearCollFactor*dx;
			this.y += nearCollFactor*dy;
			this.vx = nearCollFactor*this.captured.lastVelocity.x;
			this.vy = nearCollFactor*this.captured.lastVelocity.y;
		}
	} else {
		this.lastTouched += globalOptions.mspf;
		Ball.prototype.update.call(this);
	}
}

CueBall.prototype.draw = function (f) {
	if (f === undefined) f = 1;
	if (!this.expired) {
		gameCtx.fillStyle = 'rgba(' + this.fillR + ',' + this.fillG + ',' + this.fillB + ',' + this.fillA*f + ')';
	} else {
		gameCtx.fillStyle = 'rgba(' + this.expiredFillR + ',' + this.expiredFillG + ',' + this.expiredFillB + ',' +
			this.expiredFillA*f + ')';
	}
	gameCtx.strokeStyle = 'rgba(' + this.strokeR + ',' + this.strokeG + ',' + this.strokeB + ',' + this.strokeA*f + ')';
	gameCtx.lineWidth = 2;
	gameCtx.beginPath();
	gameCtx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
	gameCtx.fill();
	gameCtx.stroke();
	if (debug) {
		gameCtx.font = '16px sans-serif';
		gameCtx.strokeText(Math.floor(distance(0,0,this.vx,this.vy)), this.x - 8, this.y + 6);
	}
}