function Ball(x, y, vx, vy, radius) {
	// basics
	this.type = "Ball";
	this.locked = false;
	
	// definition
	this.radius = radius;
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.area = this.radius*this.radius*Math.PI;
	this.lastPosition = {x: x, y: y};
	
	// physical parameters
	this.maxSpeed = 1000.0*this.radius/globalOptions.mspf
	this.density = 1.0/Math.PI;
	this.mass = this.area * this.density;
	this.bgDrag = 0;
	this.dragMultiplierPerFrame = Math.pow(1 - this.bgDrag, globalOptions.mspf/1000.0);
	this.compressionCoefficient = 8000.0;
	this.rigidCollision = 0;
	this.rigidVector = [];
	this.nearCollision = false;
	
	// drawing -- default parameters
	this.fillR = 84;
	this.fillG = 0;
	this.fillB = 216;
	this.fillA = 1.0;
	this.strokeR = 64;
	this.strokeG = 16;
	this.strokeB = 128;
	this.strokeA = 1.0;
}
Ball.prototype = new GameObject();

Ball.prototype.update = function () {
	if (this.locked) return;
	GameObject.prototype.update.call(this);
	this.nearCollision = false;
	this.rigidCollision = 0; // reset the collision
	this.rigidVector = [];
	this.lastPosition.x = this.x;
	this.lastPosition.y = this.y;
	this.vx *= this.dragMultiplierPerFrame;
	this.vy *= this.dragMultiplierPerFrame;
	var v = distance(0,0,this.vx,this.vy);
	if (v > this.maxSpeed) {
		// console.log('Speed reduced');
		this.vx *= (this.maxSpeed/v);
		this.vy *= (this.maxSpeed/v);
	}
	this.x += this.vx * globalOptions.mspf / 1000.0;
	this.y += this.vy * globalOptions.mspf / 1000.0;
}

// change in velocity due to compression; unused
Ball.prototype.compressionReaction = function (compression) {
	return (this.compressionCoefficient*compression*compression)/(this.mass*this.mass);
}

Ball.prototype.draw = function (f) {
	if (f === undefined) f = 1;
	gameCtx.fillStyle = 'rgba(' + this.fillR + ',' + this.fillG + ',' + this.fillB + ',' + this.fillA*f + ')';
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