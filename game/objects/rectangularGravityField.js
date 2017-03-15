function RectangularGravityField(x, y, w, h, gx, gy) {
	// basics
	this.type = 'RectangularGravityField';
	this.locked = false;
	
	// definition
	this.tl = {x: x, y: y};
	this.tr = {x: x + w, y: y};
	this.br = {x: x + w, y: y + h};
	this.bl = {x: x, y: y + h};
	this.w = w;
	this.h = h;

	// drawing
	this.fillR = 0;
	this.fillG = 0;
	this.fillB = 0;
	this.fillA = 0;

	this.hasDots = true;
	this.dotColors = [
		{
			r: 64,
			g: 255,
			b: 160
		},
		{
			r: 0,
			g: 160,
			b: 255
		},
		{
			r: 255,
			g: 160,
			b: 255
		}
	];

	this.dotDensity = 0.1; // per second per unit length of diagonal in appropriate direction
	this.dotDiagonalLR = 0; // left/right component of diagonal
	this.dotDiagonalTB = 0; // top/bottom component of diagonal
	this.dotDiagonal = 0; // is set during setup; the cross-section of rectangle normal to gravity direction
	this.dotsPerFrame = 0; // is set during setup
	this.dotRadius = 1;
	this.dotsFromTop = false;
	this.dotsFromBottom = false;
	this.dotsFromLeft = false;
	this.dotsFromRight = false;
	this.dotOffset = undefined; // is set during setup; how far new dots are offset from edge (vector)
	this.dotLeadTime = 0.1; // in seconds, how long dots take to enter field once generated

	this.dots = []; // get generated with a color chosen at random from the list, a random a for that color, and random position offscreen
	this.dotsThisFrame = 0; // number of dots this frame still to draw; draws a dot only if >= 1;

	// physics
	this.g = { // acceleration in pixels/s^2
		x: gx,
		y: gy
	};
	this.n = { // normal to gravity
		x: gy,
		y: -gx
	}

	this.setupDotGeometry();
}
RectangularGravityField.prototype = new GameObject();

RectangularGravityField.prototype.setupDotGeometry = function () {
	if (this.g.x === 0 && this.g.y === 0) { // no gravity, no dots
		this.hasDots = false;
		return;
	}

	// figure out where dots are coming from
	if (this.g.x > 0) this.dotsFromLeft = true;
	if (this.g.x < 0) this.dotsFromRight = true;
	if (this.g.y > 0) this.dotsFromTop = true;
	if (this.g.y < 0) this.dotsFromBottom = true;

	this.dotDiagonalLR = Math.abs(projectionLength({x: 0, y: this.h}, this.n));
	this.dotDiagonalTB = Math.abs(projectionLength({x: this.w, y: 0}, this.n));
	this.dotDiagonal = this.dotDiagonalLR + this.dotDiagonalTB;

	var g = Math.sqrt(this.g.x*this.g.x + this.g.y*this.g.y);
	var offsetDistance = 0.5*g*this.dotLeadTime*this.dotLeadTime + 2*this.dotRadius;
	this.dotOffset = {
		x: -this.g.x*offsetDistance/g,
		y: -this.g.y*offsetDistance/g
	}

	var dotsPerSecond = this.dotDiagonal * this.dotDensity;
	this.dotsPerFrame = dotsPerSecond*globalOptions.mspf/1000.0;
};

RectangularGravityField.prototype.generateDot = function () {
	if (!this.hasDots) return;

	var pos = Math.random()*this.dotDiagonal; // position along diagonal
	var dot = {
		velocity: {
			x: 0,
			y: 0
		}
	};
	var entryX = 0; // if from left
	var entryY = 0; // if from top
	if (pos < this.dotDiagonalLR) { // without loss of generality assume that lower numbers go on L/R and higher on T/B
		entryY = (pos/this.dotDiagonalLR)*this.h;
		if (this.dotsFromRight) {
			entryX = this.w;
		}
	} else {
		entryX = ((pos - this.dotDiagonalLR)/this.dotDiagonalTB)*this.w;
		if (this.dotsFromBottom) {
			entryY = this.h;
		}
	}
	var colorIndex = Math.floor(Math.random()*this.dotColors.length);
	var dot = {
		position: {
			x: entryX + this.dotOffset.x,
			y: entryY + this.dotOffset.y
		},
		velocity: {
			x: 0,
			y: 0
		},
		color: {
			r: this.dotColors[colorIndex].r,
			g: this.dotColors[colorIndex].g,
			b: this.dotColors[colorIndex].b,
			a: Math.random()
		}
	};
	this.dots.push(dot);
};

RectangularGravityField.prototype.draw = function (f) {
	gameCtx.save();
	gameCtx.rect(this.tl.x, this.tl.y, this.w, this.h);
	gameCtx.clip();

	gameCtx.fillStyle = rgba(this.fillR,this.fillG,this.fillB,this.fillA*f);
	gameCtx.fillRect(this.tl.x, this.tl.y, this.w, this.h);

	for (var d = 0; d < this.dots.length; d++) {
		/*gameCtx.fillStyle = rgba(this.dots[d].color.r, this.dots[d].color.g, this.dots[d].color.b, this.dots[d].color.a*f);
		gameCtx.beginPath();
		gameCtx.arc(this.dots[d].position.x, this.dots[d].position.y, this.dotRadius, 0, 2*Math.PI, true);
		gameCtx.fill();*/
		gameCtx.strokeStyle = rgba(this.dots[d].color.r, this.dots[d].color.g, this.dots[d].color.b, this.dots[d].color.a*f);
		gameCtx.lineWidth = this.dotRadius;
		gameCtx.beginPath();
		gameCtx.moveTo(this.dots[d].position.x, this.dots[d].position.y);
		gameCtx.lineTo(this.dots[d].position.x + 0.05*this.dots[d].velocity.x, this.dots[d].position.y + 0.05*this.dots[d].velocity.y);
		gameCtx.stroke();
	}

	gameCtx.restore();
};

RectangularGravityField.prototype.update = function () {
	if (!this.hasDots) return;
	this.dotsThisFrame += this.dotsPerFrame;

	while (this.dotsThisFrame >= 1) {
		this.generateDot();
		this.dotsThisFrame--;
	}

	for (var d = 0; d < this.dots.length; d++) {
		this.dots[d].velocity.x += this.g.x*globalOptions.mspf/1000.0;
		this.dots[d].velocity.y += this.g.y*globalOptions.mspf/1000.0;
		this.dots[d].position.x += this.dots[d].velocity.x*globalOptions.mspf/1000.0;
		this.dots[d].position.y += this.dots[d].velocity.y*globalOptions.mspf/1000.0;
		if ((this.dotsFromTop && this.dots[d].position.y > this.h + this.dotRadius) ||
			(this.dotsFromBottom && this.dots[d].position.y < -this.dotRadius) ||
			(this.dotsFromLeft && this.dots[d].position.x > this.w + this.dotRadius) ||
			(this.dotsFromRight && this.dots[d].position.y < -this.dotRadius)) {
			this.dots.splice(d, 1);
			d--;
		}
	}
};