function load() { // initialization
	gameCanvas = document.getElementById('game');
	gameCtx = gameCanvas.getContext('2d');
	controlCanvas = document.getElementById('controlCanvas');
	controlCtx = controlCanvas.getContext('2d');
	titleScreen.initTitle();
	document.addEventListener('mouseout', onMouseOut, false);
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('mouseup', onMouseUp, false);
	document.addEventListener('keyup', onKeyUp, false);
	document.addEventListener('keydown', onKeyDown, false);
	var drawNow = 0;
	var controlDrawNow = 0;
	var drawFrames = globalOptions.drawFrames;
	var mainLoop = function () {
		if (!gameState.paused) {
			update();
			if (drawNow == 0) draw();
			drawNow = (drawNow + 1) % drawFrames;
		}
		controlText.update();
		if (controlDrawNow == 0) controlText.draw();
		controlDrawNow = (controlDrawNow + 1) % drawFrames;
	}
	setInterval(mainLoop, globalOptions.mspf);
	audioPlayer.initAudio();
}

function update() { // update the game
	if (gameState.title) titleScreen.update();
	else if (gameState.level) levelScreen.update();
	else if (gameState.ending) endingScreen.update();
	sequencer.update();
}

function draw() { // render the scene
	if (gameState.title) titleScreen.draw();
	else if (gameState.level) levelScreen.draw();
	else if (gameState.ending) endingScreen.draw();
}

function pauseToggle() {
	gameState.paused = !gameState.paused;
	sequencer.pauseToggle();
}

function soundToggle() {
	gameState.soundOn = !gameState.soundOn;
	controlText.soundToggle();
}