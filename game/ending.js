endingScreen = {
	// basics
	text: undefined,
	endingType: undefined,
	
	// animation
	fader: undefined,
	outlineFader: undefined
};

endingScreen.init = function () {
	gameState.ending = true;
	this.fader = new Fader(1, 2, 3);
	this.fader.start();
	this.outlineFader = new Fader(0, 5, 2);
}

endingScreen.gameWon = function () {
	this.init();
	this.text = 'Congratulations!';
	this.endingType = 'gameWon';
	music.gameWin();
}

endingScreen.gameOver = function () {
	this.init();
	this.text = 'GAME OVER';
	this.endingType = 'gameOver';
}

endingScreen.update = function () {
	this.fader.update();
	if (this.outlineFader.mode == 'active') this.outlineFader.update();
	if (this.fader.fadeMode == 'wait' && this.outlineFader.mode == 'inactive' && this.endingType == 'gameOver') this.outlineFader.start();
	if (this.outlineFader.mode == 'done' || (this.endingType == 'gameWon' && this.fader.mode == 'done')) this.end();
}

endingScreen.draw = function () {
	this.drawBackground();
	this.drawOutline();
	this.drawTitle();
}

endingScreen.drawBackground = function () {
	if (this.fader.fadeParameter < 1) {
		gameCtx.fillStyle = '#1E1E1E';
		gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	}
	if (this.endingType == 'gameOver' && this.fader.fadeMode != 'fadeIn') gameCtx.fillStyle = 'rgba(30,0,0,' + this.fader.fadeParameter + ')';
	else  gameCtx.fillStyle = 'rgba(0,0,0,' + this.fader.fadeParameter + ')';
	gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
};

endingScreen.drawOutline = function () {
	if (this.endingType == 'gameOver' && this.fader.fadeMode != 'fadeIn') {
		drawOutline('rgba(30,0,0,' + this.fader.fadeParameter + ')','rgba(255,64,64,' + this.fader.fadeParameter + ')');
	} else drawOutline('rgba(0,0,30,' + this.fader.fadeParameter + ')','rgba(64,64,255,' + this.fader.fadeParameter + ')');
};

endingScreen.drawTitle = function () {
	if (this.endingType == 'gameOver' && this.fader.fadeMode != 'fadeIn') {
		gameCtx.fillStyle = 'rgba(128, 0, 0, ' + this.fader.fadeParameter + ')';
	} else gameCtx.fillStyle = 'rgba(237, 237, 237, ' + this.fader.fadeParameter + ')';
	if (this.endingType == 'gameOver') gameCtx.font = '120px serif';
	else gameCtx.font = '72px serif';
	var textWidth = gameCtx.measureText(this.text).width;
	gameCtx.fillText(this.text, gameCanvas.width*0.5 - textWidth*0.5, gameCanvas.height*0.5 + 18);
	if (this.endingType == 'gameOver' && this.fader.fadeMode != 'fadeIn') {
		gameCtx.strokeStyle = 'rgba(0,0,0,' + this.outlineFader.fadeParameter + ')';
		gameCtx.lineWidth = 3;
		gameCtx.strokeText(this.text, gameCanvas.width*0.5 - textWidth*0.5, gameCanvas.height*0.5 + 18);
	}
}

endingScreen.end = function () {
	this.fader = undefined;
	this.outlineFader = undefined;
	gameState.ending = false;
	gameState.title = true;
	titleScreen.initTitle();
}