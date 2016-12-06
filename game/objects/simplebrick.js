function SimpleBrick(x, y, w, h, HP) {
	// basics
	this.type = 'SimpleBrick';
	this.locked = false;
	
	// definition
	this.tl = {x: x, y: y};
	this.tr = {x: x + w, y: y};
	this.br = {x: x + w, y: y + h};
	this.bl = {x: x, y: y + h};
	this.center = {x: x + 0.5*w, y: y + 0.5*h};
	this.w = w;
	this.h = h;
	this.vx = 0;
	this.vy = 0;
	this.area = w*h;
	this.radius = distance(this.center.x, this.center.y, this.tl.x, this.tl.y);
	
	// drawing
	this.fillR = 140;
	this.fillG = 32;
	this.fillB = 32;
	this.fillA = 1.0;
	this.strokeR = 255;
	this.strokeG = 64;
	this.strokeB = 64;
	this.strokeA = 1.0;
	
	// animation
	this.hitTime = this.area/3000.0;
	this.totalHitFrames = (this.hitTime*1000)/globalOptions.mspf;
	this.hitFrame = this.totalHitFrames;
	this.dying = false;
	this.deathTime = this.area/6000.0;
	this.totalDeathFrames = (this.deathTime*1000)/globalOptions.mspf;
	this.deathFrame = 0;

	// sound
	this.frequency = 20*C1;
	
	// game
	this.maxHP = HP;
	this.HP = HP;
}
SimpleBrick.prototype = new GameObject();

SimpleBrick.prototype.update = function () {
	if (this.locked) return;
	GameObject.prototype.update.call(this);
	if (this.hitFrame < this.totalHitFrames) this.hitFrame++;
	if (this.HP <= 0) {
		this.dying = true;
		this.HP = 0;
	}
	if (this.dying) {
		this.deathFrame++;
		if (this.deathFrame >= this.totalDeathFrames) this.remove = true;
	}
	this.fillA = (this.hitFrame/this.totalHitFrames) * (this.HP/this.maxHP);
	this.strokeA = (1 - (this.deathFrame/this.totalDeathFrames));
}

SimpleBrick.prototype.draw = function (f) {
	if (f === undefined) f = 1;
	GameObject.prototype.draw.call(this);
	gameCtx.lineWidth = 2;
	gameCtx.fillStyle = rgba(this.fillR,this.fillG,this.fillB,this.fillA*f);
	gameCtx.strokeStyle = rgba(this.strokeR,this.strokeG,this.strokeB,this.strokeA*f);
	gameCtx.fillRect(this.tl.x, this.tl.y, this.w, this.h);
	gameCtx.strokeRect(this.tl.x, this.tl.y, this.w, this.h);
}

SimpleBrick.prototype.damage = function (dam) {
	this.HP -= dam;
	this.hitFrame = ((2.0*this.HP/3.0)/this.maxHP)*this.totalHitFrames;
	if (this.hitFrame < 0) this.hitFrame = 0;
	if (this.HP < 0) {
		this.HP = 0;
		this.dying = true;
	}
}