function PolygonBrick(vertices, HPperArea) {
	// basics
	this.type = 'PolygonBrick';
	this.locked = false;
	
	// definition
	this.vertices = vertices; // it's just a list of vertices, which makes it kind of difficult to get anything else, but we do need area
	// maybe at some point we'll also need centroid, moment of inertia, etc., but for now...
	this.nVertices = vertices.length;
	this.area = 0;
	for (var i = 0; i < this.nVertices; i++) {
		this.area += vertices[i].x*vertices[(i + 1) % this.nVertices].y - vertices[i].y*vertices[(i + 1) % this.nVertices].x;
	}
	this.area = Math.abs(this.area/2.0);
	
	// drawing
	this.fillR = 32;
	this.fillG = 140;
	this.fillB = 32;
	this.fillA = 1.0;
	this.strokeR = 64;
	this.strokeG = 255;
	this.strokeB = 64;
	this.strokeA = 1.0;
	this.lineWidth = 2;
	
	// animation
	this.hitTime = this.area/3000.0;
	this.totalHitFrames = (this.hitTime*1000)/globalOptions.mspf;
	this.hitFrame = this.totalHitFrames;
	this.dying = false;
	this.deathTime = this.area/6000.0;
	this.totalDeathFrames = (this.deathTime*1000)/globalOptions.mspf;
	this.deathFrame = 0;

	// sound
	this.frequency1 = 24*C1;
	this.frequency2 = 30*C1;
	this.frequency3 = 16*C1; // intended to be a lower drone
	
	// game
	this.maxHP = HPperArea * this.area;
	this.HP = this.maxHP;
}
PolygonBrick.prototype = new GameObject();

PolygonBrick.prototype.update = function () {
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

PolygonBrick.prototype.draw = function (f) {
	if (f === undefined) f = 1;
	GameObject.prototype.draw.call(this);
	gameCtx.lineWidth = this.lineWidth;
	gameCtx.fillStyle = rgba(this.fillR,this.fillG,this.fillB,this.fillA*f);
	gameCtx.strokeStyle = rgba(this.strokeR,this.strokeG,this.strokeB,this.strokeA*f);
	gameCtx.beginPath();
	gameCtx.moveTo(this.vertices[0].x, this.vertices[0].y);
	for (var i = 1; i <= this.nVertices; i++) {
		gameCtx.lineTo(this.vertices[i % this.nVertices].x, this.vertices[i % this.nVertices].y)
	}
	gameCtx.fill();
	gameCtx.stroke();
}

PolygonBrick.prototype.damage = function (dam) {
	this.HP -= dam;
	this.hitFrame = ((2.0*this.HP/3.0)/this.maxHP)*this.totalHitFrames;
	if (this.hitFrame < 0) this.hitFrame = 0;
	if (this.HP < 0) {
		this.HP = 0;
		this.dying = true;
	}
}