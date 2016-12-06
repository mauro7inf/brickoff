function PurpleBall(x, y, vx, vy, radius) {
	Ball.apply(this, arguments);
	// basics
	this.type = "PurpleBall";
	this.locked = false;
	
	// definition
	this.radius = radius;
	this.x = x;
	this.y = y;
	this.vx = vx; // pixels per second
	this.vy = vy;
	this.area = this.radius*this.radius*Math.PI;
	
	// physical parameters
	this.density = 1.0/Math.PI;
	this.mass = this.area * this.density;
	this.bgDrag = .03; // fraction of velocity lost per second
	this.dragMultiplierPerFrame = Math.pow(1 - this.bgDrag, globalOptions.mspf/1000.0);
	this.compressionCoefficient = 8000.0; // unused at the moment
	this.rigidCollision = 0; // if a rigid collision has already happened this frame
	this.rigidVector = []; // unit normal vectors of collision
	
	// drawing
	this.fillR = 84;
	this.fillG = 0;
	this.fillB = 216;
	this.fillA = 1.0;
	this.strokeR = 64;
	this.strokeG = 16;
	this.strokeB = 128;
	this.strokeA = 1.0;
	
	// animation
	this.hitTime = this.radius/30.0;
	this.totalHitFrames = (this.hitTime*1000)/globalOptions.mspf;
	this.hitFrame = this.totalHitFrames;
	this.dying = false;
	this.deathTime = this.radius/60.0;
	this.totalDeathFrames = (this.deathTime*1000)/globalOptions.mspf;
	this.deathFrame = 0;
	
	// game state data
	this.maxHP = 400.0*this.mass*radius;
	this.HP = this.maxHP;
	this.isIn = false;
}
PurpleBall.prototype = (function (ballConstructor, purpleBallConstructor) {
    function protoCreator() {
        this.constructor = purpleBallConstructor.prototype.constructor
    };
    protoCreator.prototype = ballConstructor.prototype;
    return new protoCreator();
})(Ball, PurpleBall);

PurpleBall.prototype.update = function() {
	if (this.locked) return;
	if ((this.x < -2*this.radius && this.vx <= 0) ||
		(this.x > gameCanvas.width + 2*this.radius && this.vx >= 0) ||
		(this.y < -2*this.radius && this.vy <= 0) ||
		(this.y > gameCanvas.height + 2*this.radius && this.vy >= 0)) {
		this.remove = true;
	} else {
		Ball.prototype.update.call(this);
	}
	if (this.x > 5 + this.radius && this.x <gameCanvas. width - 5 - this.radius &&
		this.y > 5 + this.radius && this.y < gameCanvas.height - 5 - this.radius)
		this.isIn = true;
	if (this.hitFrame < this.totalHitFrames) this.hitFrame++;
	if (this.HP <= 0) this.dying = true;
	if (this.dying) {
		this.deathFrame++;
		if (this.deathFrame >= this.totalDeathFrames) this.remove = true;
	}
	this.fillA = (this.hitFrame/this.totalHitFrames) * (this.HP/this.maxHP) * titleScreen.fadeOutParameter;
	this.strokeA = (1 - (this.deathFrame/this.totalDeathFrames)) * titleScreen.fadeOutParameter;
};

PurpleBall.prototype.damage = function (dam) {
	this.HP -= dam;
	this.hitFrame = ((2.0*this.HP/3.0)/this.maxHP)*this.totalHitFrames;
	if (this.hitFrame < 0) this.hitFrame = 0;
	if (this.HP < 0) {
		this.HP = 0;
		this.dying = true;
	}
};

PurpleBall.prototype.death = function () {
	titleScreen.purpleBallCount--;
	while (titleScreen.purpleBallCount < titleScreen.numPurpleBalls) titleScreen.generatePurpleBall();
};