function Bomb(x, y, radius, HP) {
	Ball.apply(this, arguments);
	// basics
	this.type = "Bomb"; // becomes "Explosion" when it blows up
	this.locked = false;
	
	// definition
	this.radius = radius;
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.area = this.radius*this.radius*Math.PI;
	
	// physical parameters
	this.density = 40.0/Math.PI;
	this.mass = this.area * this.density;
	this.bgDrag = 0.15; // fraction of velocity lost per second
	this.dragMultiplierPerFrame = Math.pow(1 - this.bgDrag, globalOptions.mspf/1000.0);
	this.compressionCoefficient = 8000.0; // unused at the moment
	this.rigidCollision = 0; // if a rigid collision has already happened this frame
	this.rigidVector = []; // unit normal vectors of collision
	this.explosionForceConstant = 200000000; // G in the equation F = G/r^2 for physical aspect of explosion
	this.explosionForceDuration = 0.1; // s
	this.explosionForceTotalFrames = this.explosionForceDuration/(globalOptions.mspf/1000.0);
	this.explosionForceFrame = 0;
	this.explosionForce = false;
	
	// drawing
	this.fillR = 255;
	this.fillG = 255;
	this.fillB = 255;
	this.fillA = 1;
	this.strokeR = 141;
	this.strokeG = 128;
	this.strokeB = 180;
	this.strokeA = 1;
	this.tickA = 0;

	// animation
	this.hitTime = this.radius/30.0;
	this.totalHitFrames = (this.hitTime*1000)/globalOptions.mspf;
	this.hitFrame = this.totalHitFrames;
	this.dying = false;
	this.deathTime = this.radius/90.0;
	this.totalDeathFrames = (this.deathTime*1000)/globalOptions.mspf;
	this.deathFrame = 0;
	this.explosionRadius = 2*this.radius; // visible explosion
	this.explosionThickness = 20;
	this.oscPeriodInitial = 2.0;
	this.osc = 0;
	this.oscPhase = 0;
	this.oscPeriod = this.oscPeriodInitial;
	
	// sound
	this.frequency = 30*C1;
	
	// game
	this.maxHP = HP;
	this.HP = HP;
}
Bomb.prototype = (function (ballConstructor, bombConstructor) {
    function protoCreator() {
        this.constructor = bombConstructor.prototype.constructor
    };
    protoCreator.prototype = ballConstructor.prototype;
    return new protoCreator();
})(Ball, Bomb);

Bomb.prototype.update = function() {
	if (this.locked) return;
	if (this.dying) {
		this.deathFrame++;
		if (this.deathFrame >= this.totalDeathFrames) this.remove = true;
	}
	if (this.type === "Bomb") {
		Ball.prototype.update.call(this);
		if (this.hitFrame < this.totalHitFrames) this.hitFrame++;
		if (this.HP <= 0) {
			if (!this.dying) this.explode();
			this.dying = true;
		}
		this.fillA = (this.hitFrame/this.totalHitFrames);
		this.oscPhase += (2*Math.PI/(this.oscPeriod*1000))*globalOptions.mspf;
		while (this.oscPhase > 2*Math.PI) this.oscPhase -= 2*Math.PI;
		this.osc = Math.sin(this.oscPhase);
	} else if (this.type === "Explosion") {
		this.explosionForceFrame++;
		this.explosionForce = (this.explosionForceFrame <= this.explosionForceTotalFrames);
		this.radius = this.explosionRadius*(this.deathFrame/this.totalDeathFrames);
		this.strokeA = (1 - Math.pow(this.deathFrame/this.totalDeathFrames, 3));
	}
};

Bomb.prototype.draw = function (f) {
	if (f === undefined) f = 1;
	if (this.type === "Bomb") {
		var gradient = gameCtx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, 0);
		var hpRatio = this.HP/this.maxHP;
		var hpFormula = (1 - (1 - hpRatio)*(1 - hpRatio))*(2 + this.osc)/3;
		gradient.addColorStop(0, rgba(this.fillR,this.fillG,this.fillB,this.fillA*f));
		gradient.addColorStop(hpFormula/2, rgba(this.strokeR,this.strokeG,this.strokeB,this.fillA*f));
		gradient.addColorStop((1 + hpFormula)/2, rgba(0,0,0,this.fillA*f));
		gameCtx.fillStyle = gradient;
		gameCtx.strokeStyle = rgba(this.strokeR,this.strokeG,this.strokeB,this.strokeA*f);
		gameCtx.lineWidth = 2;
		gameCtx.beginPath();
		gameCtx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
		gameCtx.fill();
		var whiteGradient = gameCtx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, 0);
		whiteGradient.addColorStop(hpFormula/2, rgba(0,0,0,0));
		whiteGradient.addColorStop(1, rgba(0,255,0,f*(1 - this.osc)/2));
		gameCtx.fillStyle = whiteGradient;
		gameCtx.fill();
		gameCtx.stroke();
		if (debug) {
			gameCtx.font = '16px sans-serif';
			gameCtx.strokeText(Math.floor(distance(0,0,this.vx,this.vy)), this.x - 8, this.y + 6);
		}
	} else if (this.type === "Explosion") {
		var insideRadius = this.radius - this.explosionThickness;
		if (insideRadius < 0) insideRadius = 0;
		var gradient = gameCtx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, insideRadius);
		gradient.addColorStop(0.33, rgba(this.strokeR,this.strokeG,this.strokeB,this.strokeA*f));
		gradient.addColorStop(1, rgba(0,0,0,0));
		gameCtx.fillStyle = gradient;
		gameCtx.beginPath();
		gameCtx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
		gameCtx.fill();
	}
}

Bomb.prototype.damage = function (dam) {
	this.HP -= dam;
	this.hitFrame = (1 - (dam*20.0)/this.maxHP)*this.totalHitFrames;
	if (this.hitFrame < 0) this.hitFrame = 0;
	if (this.HP < 0) {
		this.HP = 0;
		if (!this.dying) this.explode();
		this.dying = true;
	}
	this.oscPeriod = (this.HP/this.maxHP)*this.oscPeriodInitial;
	if (this.oscPeriod <= 0) {
		this.oscPeriod = 1.0/1000.0;
	}
};

Bomb.prototype.explode = function () {
	this.type = "Explosion";
	this.radius = 0;
	soundBank.bombExplode();
};