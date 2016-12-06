function HealingBrick(x, y, w, h, HP) {
	// basics
	this.type = 'HealingBrick';
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
	this.lineWidth = 2;
	
	// animation
	this.hitTime = this.area/3000.0;
	this.totalHitFrames = (this.hitTime*1000)/globalOptions.mspf;
	this.hitFrame = this.totalHitFrames;
	this.dying = false;
	this.deathTime = this.area/36000.0;
	this.totalDeathFrames = (this.deathTime*1000)/globalOptions.mspf;
	this.deathFrame = 0;

	// sound
	this.frequency = 48*C1;
	
	// game
	this.maxHP = HP;
	this.HP = HP;
	this.fullHealTime = 20000; // in ms
	this.healingRate = this.maxHP*globalOptions.mspf/this.fullHealTime;
}
HealingBrick.prototype = new GameObject();

HealingBrick.prototype.update = function () {
	if (this.locked) return;
	GameObject.prototype.update.call(this);
	if (this.hitFrame < this.totalHitFrames) this.hitFrame++;
	if (this.HP <= 0) {
		this.dying = true;
		this.HP = 0;
	} else if (this.HP < this.maxHP) {
		this.HP += this.healingRate;
		if (this.HP > this.maxHP) this.HP = this.maxHP;
	}
	if (this.dying) {
		this.deathFrame++;
		if (this.deathFrame >= this.totalDeathFrames) this.remove = true;
	}
	this.fillA = (this.hitFrame/this.totalHitFrames) * (this.HP/this.maxHP);
	this.strokeA = (1 - (this.deathFrame/this.totalDeathFrames));
}

HealingBrick.prototype.draw = function (f) {
	if (f === undefined) f = 1;

	var b = Math.min(this.h, this.w); // center box side
	var shine = gameCtx.createLinearGradient(this.tl.x + 0.5*(this.w - b), this.tl.y + 0.5*(this.h - b), this.tl.x + 0.5*(this.w + b), this.tl.y + 0.5*(this.h + b));
	shine.addColorStop(0, rgba(255, 255, 255, 0));
	shine.addColorStop(0.5, rgba(255, 255, 255, 0.5*f*this.fillA));
	shine.addColorStop(1, rgba(255, 255, 255, 0));

	GameObject.prototype.draw.call(this);
	gameCtx.lineWidth = this.lineWidth;
	gameCtx.fillStyle = rgba(this.fillR,this.fillG,this.fillB,this.fillA*f);
	gameCtx.strokeStyle = rgba(this.strokeR,this.strokeG,this.strokeB,this.strokeA*f);
	gameCtx.fillRect(this.tl.x, this.tl.y, this.w, this.h);
	gameCtx.strokeRect(this.tl.x, this.tl.y, this.w, this.h);

	var circleRadius = 0.37*b;
	var centerx = 0.5*(this.tl.x + this.br.x);
	var centery = 0.5*(this.tl.y + this.br.y);
	
	// circle
	gameCtx.lineWidth = b/23.0;
	gameCtx.beginPath();
	gameCtx.arc(centerx, centery, circleRadius, 0, 2*Math.PI, true);
	gameCtx.stroke();
	// plus sign
	gameCtx.lineWidth = b/9.0;
	gameCtx.beginPath();
	gameCtx.moveTo(centerx - 0.67*circleRadius, centery);
	gameCtx.lineTo(centerx + 0.67*circleRadius, centery);
	gameCtx.moveTo(centerx, centery - 0.67*circleRadius);
	gameCtx.lineTo(centerx, centery + 0.67*circleRadius);
	gameCtx.stroke();

	gameCtx.fillStyle = shine;
	gameCtx.fillRect(this.tl.x, this.tl.y, this.w, this.h);
}

HealingBrick.prototype.damage = function (dam) {
	this.HP -= dam;
	this.hitFrame = ((2.0*this.HP/3.0)/this.maxHP)*this.totalHitFrames;
	if (this.hitFrame < 0) this.hitFrame = 0;
	if (this.HP < 0) {
		this.HP = 0;
		this.dying = true;
	}
}