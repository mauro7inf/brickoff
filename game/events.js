function onMouseMove(e) {
	e.preventDefault();
	var canvasRect = gameCanvas.getBoundingClientRect();
	var x = e.clientX - canvasRect.left;
	var y = e.clientY - canvasRect.top;
	if (gameState.title) {
		if (e.which != 1) titleScreen.mouseDown = false;
		titleScreen.mouseMove(x,y);
	} else if (gameState.level) {
		if (e.which != 1) levelScreen.mouseDown = false;
		levelScreen.mouseMove(x,y);
	}
}

function onMouseOut(e) {
	var canvasRect = gameCanvas.getBoundingClientRect();
	var x = e.clientX - canvasRect.left;
	var y = e.clientY - canvasRect.top;
	if (gameState.title) titleScreen.mouseMove(x,y);
	else if (gameState.level) levelScreen.mouseMove(x,y);
}

function onMouseUp(e) {
	e.preventDefault();
	var canvasRect = gameCanvas.getBoundingClientRect();
	var x = e.clientX - canvasRect.left;
	var y = e.clientY - canvasRect.top;
	if (gameState.title) {
		if (0 <= x && x <= gameCanvas.width && 0 <= y && y <= gameCanvas.height) {
			titleScreen.mouseUp(x,y);
		}
		titleScreen.mouseDown = false;
	} else if (gameState.level) {
		if (0 <= x && x <= gameCanvas.width && 0 <= y && y <= gameCanvas.height) {
			levelScreen.mouseUp(x,y);
		}
		levelScreen.mouseDown = false;
	}
	//console.log('mouse up at (' + x + ',' + y + ')');
}

function onMouseDown(e) {
	e.preventDefault();
	var canvasRect = gameCanvas.getBoundingClientRect();
	var x = e.clientX - canvasRect.left;
	var y = e.clientY - canvasRect.top;
	if (gameState.title) {
		titleScreen.mouseDown = true;
	} else if (gameState.level) {
		levelScreen.mouseDown = true;
	}
	//console.log('mouse down at (' + x + ',' + y + ')');
}

function onKeyUp(e) {
	//console.log(e.which);
	if (e.which == 80) {
		pauseToggle();
	} else if (e.which == 83) {
		soundToggle();
	}
}

function onKeyDown(e) {
	if (e.which == 32) e.preventDefault();
}