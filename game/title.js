titleScreen = {
	// animation

	// fade in
	fadeInParameter: 0,
	titleInFader: undefined,

	// fade out
	fadeOutParameter: 1,
	titleOutFader: undefined,

	// "Click to Start" blinker
	clickToStartBlinker: undefined,
	clickToStartBlinkTime: 0.5, // in seconds
	clickToStartDraw: false,
	
	// game data
	purpleBallCount: 0,
	numPurpleBalls: 20,
	paddle: undefined,
	walls: [],
	purpleBalls: [],
	
	// misc state
	mouseDown: false
};

titleScreen.initTitle = function () { // set up the title object
	gameState.title = true;
	//music.gameOver(); // experimental

	// set up animation
	this.fadeInParameter = 0;
	this.titleInFader = new Fader(2.5);
	//this.titleInFader.fadeInFormula = 'quadratic';
	this.titleInFader.start();
	
	// initialize fadeout, though it won't happen for a while
	this.fadeOutParameter = 1;
	this.titleOutFader = new Fader(0.0, 0.0, 1.5);
	
	// reset blinker
	this.clickToStartDraw = false;
	this.clickToStartBlinker = undefined;
	
	// reset purple balls
	this.purpleBallCount = 0;
	this.purpleBalls = [];
	
	// reset paddle
	this.paddle = undefined;
	
	// build up walls
	var wallL = new Wall(5, 5, 5, gameCanvas.height - 5); // create wall objects for collisions
	var wallR = new Wall(gameCanvas.width - 5, 5, gameCanvas.width - 5, gameCanvas.height - 5);
	var wallT = new Wall(5, 5, gameCanvas.width - 5, 5);
	var wallB = new Wall(5, gameCanvas.height - 5, gameCanvas.width - 5, gameCanvas.height - 5);
	this.walls = [wallL, wallR, wallT, wallB];
	
	//diagnoseTitle();
};

titleScreen.update = function () { // update the title screen
	if (this.titleInFader.mode == 'active') {
		this.titleInFader.update();
		this.fadeInParameter = this.titleInFader.fadeParameter;
	} else {
		this.fadeInParameter = 1.0;
		if (!this.paddle) this.initPaddle();
		if (!this.clickToStartBlinker) this.initClickToStartBlinker();
		if (this.purpleBallCount < this.numPurpleBalls && this.titleOutFader.mode == 'inactive') this.generatePurpleBall();
	}
	if (this.titleOutFader.mode == 'active') {
		this.titleOutFader.update();
		this.fadeOutParameter = this.titleOutFader.fadeParameter;
	} else if (this.titleOutFader.mode == 'done') {
		this.fadeOutParameter = 0.0;
		this.endTitle();
	}
	// no need to update walls
	for (var o = 0; o < this.purpleBalls.length; o++) {
		this.purpleBalls[o].update();
	}
	if (this.paddle) {
		this.paddle.update();
		for (var w = 0; w < this.walls.length; w++) {
			collide(this.walls[w], this.paddle);
		}
	}
	for (var o = 0; o < this.purpleBalls.length; o++) { // check for collisions
		for (var w = 0; w < this.walls.length; w++) {
			collide(this.walls[w], this.purpleBalls[o]);
		}
		for (var o2 = o + 1; o2 < this.purpleBalls.length; o2++) {
			collide(this.purpleBalls[o], this.purpleBalls[o2]);
		}
		if (this.paddle) collide(this.purpleBalls[o], this.paddle);
		//this.objectList[o].update();
		if (this.purpleBalls[o].remove) {
			this.purpleBalls[o].death();
			this.purpleBalls.splice(o,1);
			o--;
		}
	}
};

titleScreen.draw = function () {
	clearCanvas();
	this.drawBackground();
	this.drawOutline();
	for (var o = 0; o < this.purpleBalls.length; o++) {
		this.purpleBalls[o].draw(this.fadeInParameter*this.fadeOutParameter);
	}
	if (this.paddle) this.paddle.draw();
	this.drawTitle();
}

titleScreen.initClickToStartBlinker = function () {
	var toggleClickToStart = function () {
		titleScreen.clickToStartDraw = !titleScreen.clickToStartDraw;
	};
	this.clickToStartBlinker = setInterval(toggleClickToStart, titleScreen.clickToStartBlinkTime*1000);
};

titleScreen.initPaddle = function () {
	var paddle = new PlayerPaddle(gameCanvas.width*0.5, gameCanvas.height*0.8, 50);
	this.paddle = paddle;
}

titleScreen.drawTitle = function () {
	gameCtx.fillStyle = 'rgba(237,237,237,' + this.fadeInParameter * this.fadeOutParameter + ')';
	gameCtx.strokeStyle = 'rgba(140,32,32, ' + this.fadeOutParameter + ')';
	gameCtx.lineWidth = 3;
	gameCtx.font = 'bold 96px serif';
	var brickoffWidth = gameCtx.measureText('BRICKOFF!').width;
	gameCtx.fillText('BRICKOFF!', gameCanvas.width*0.5 - brickoffWidth*0.5, gameCanvas.height*0.5 + 18);
	gameCtx.strokeText('BRICKOFF!', gameCanvas.width*0.5 - brickoffWidth*0.5, gameCanvas.height*0.5 + 18);
	if (this.clickToStartDraw) {
		gameCtx.font = '32px serif';
		var clickToStartWidth = gameCtx.measureText('Click to Start').width;
		gameCtx.fillText('Click to Start', gameCanvas.width*0.5 - clickToStartWidth*0.5, gameCanvas.height*0.5 + 90);
	}
	//gameCtx.fillStyle = 'rgba(237,237,237,' + this.fadeInParameter * this.fadeOutParameter + ')';
		// straight from microtonal synthesizer
	gameCtx.font = '72px serif';
	var offtonicWidth = gameCtx.measureText('Offtonic').width;
	gameCtx.fillText('Offtonic', gameCanvas.width*0.5 - offtonicWidth*0.5, 96);
};

titleScreen.drawBackground = function () {
	gameCtx.fillStyle = '#1E1E1E';
	gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	gameCtx.fillStyle = 'rgba(0,0,0,' + this.fadeInParameter * this.fadeOutParameter + ')';;
	gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
};

titleScreen.drawOutline = function () {
	drawOutline('rgba(0,0,30,' + this.fadeInParameter * this.fadeOutParameter + ')',
		'rgba(64,64,255,' + this.fadeInParameter * this.fadeOutParameter + ')');
};

titleScreen.generatePurpleBall = function () {
	var radius = 8 + 52 * (Math.random() * Math.random());
	var v = 400*(90 + 150 * Math.random())/(radius*radius);
	var theta = 2 * Math.PI * Math.random();
	var vx = v*Math.cos(theta);
	var vy = v*Math.sin(theta);
	var x = 0;
	var y = 0;
	if (theta > 7*Math.PI/4 && theta <= Math.PI/4) {
		x = -2*radius;
		y = gameCanvas.height*Math.random();
	} else if (theta > Math.PI/4 && theta <= 3*Math.PI/4) {
		y = -2*radius;
		x = gameCanvas.width*Math.random();
	} else if (theta > 3*Math.PI/4 && theta <= 5*Math.PI/4) {
		x = gameCanvas.width + 2*radius;
		y = gameCanvas.height*Math.random();
	} else if (theta > 5*Math.PI/4 && theta <= 7*Math.PI/4) {
		y = gameCanvas.height + 2*radius;
		x = gameCanvas.width*Math.random();
	}
	var b = new PurpleBall(x, y, vx, vy, radius);
	this.purpleBalls.push(b);
	this.purpleBallCount++;
};

titleScreen.mouseMove = function (x, y) {
	if (this.paddle) this.paddle.move(x,y);
};

titleScreen.mouseUp = function (x, y) {
	//console.log('Mouse up!');
	if (this.clickToStartBlinker) {
		clearInterval(this.clickToStartBlinker);
		this.clickToStartDraw = true;
		this.fadingOut = true;
		this.titleOutFader.start();
	}
};

titleScreen.endTitle = function () {
	gameState.title = false;
	levelScreen.initGame();
};

function diagnoseTitle() {
	console.log('Diagnosing title... purpleBalls has ' + titleScreen.purpleBalls.length + ' objects');
	for (var o = 0; o < titleScreen.purpleBalls.length; o++) {
		var obj = titleScreen.purpleBalls[o];
		if (obj.type == 'Wall') {
			console.log('Wall from (' + obj.x1 + ',' + obj.y1 + ') to (' + obj.x2 + ',' + obj.y2 + ')');
		} else if (obj.type == 'PurpleBall') {
			console.log('PurpleBall with center (' + obj.x + ',' + obj.y + ') and radius ' + obj.radius);
			console.log('Velocity: <' + obj.vx + ',' + obj.vy + '>');
		}
	}
}