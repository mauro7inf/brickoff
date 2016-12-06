controlText = {
	pauseDrawn: false,
	soundFader: undefined
};

controlText.update = function () {
	if (this.soundFader) {
		if (this.soundFader.mode == 'active') this.soundFader.update();
		else if (this.soundFader.mode == 'done') this.soundFader = undefined;
	} 
};

controlText.draw = function () {
	if ((gameState.paused && !this.pauseDrawn) || this.soundFader || (!gameState.paused && this.pauseDrawn)) {
		controlCtx.clearRect(0,0,controlCanvas.width,controlCanvas.height); // clear whole thing
		this.pauseDrawn = false;
	}
	if (gameState.paused && !this.pauseDrawn) {
		controlCtx.strokeStyle = 'rgb(237,237,237)';
		controlCtx.fillStyle = 'rgba(0,0,0,0.5)';
		controlCtx.lineWidth = 2;
		controlCtx.font = '120px serif';
		var pausedWidth = controlCtx.measureText('PAUSED').width;
		controlCtx.fillRect(controlCanvas.width/2 - pausedWidth/2 - 32, 147, pausedWidth + 64, 146);
		controlCtx.strokeRect(controlCanvas.width/2 - pausedWidth/2 - 32, 147, pausedWidth + 64, 146);
		controlCtx.fillStyle = 'rgb(237,237,237)';
		controlCtx.fillText('PAUSED', controlCanvas.width/2 - pausedWidth/2, 261);
		this.pauseDrawn = true;
	}
	if (this.soundFader) {
		controlCtx.strokeStyle = 'rgba(237,237,237,' + this.soundFader.fadeParameter + ')';
		controlCtx.fillStyle = 'rgba(0,0,0,' + 0.5 * this.soundFader.fadeParameter + ')';
		controlCtx.lineWidth = 2;
		controlCtx.font = '24px serif';
		var soundText = gameState.soundOn ? 'Sound On' : 'Sound Off';
		var soundWidth = controlCtx.measureText(soundText).width;
		controlCtx.fillRect(controlCanvas.width - 32 - soundWidth, controlCanvas.height - 48, soundWidth + 16, 32);
		controlCtx.strokeRect(controlCanvas.width - 32 - soundWidth, controlCanvas.height - 48, soundWidth + 16, 32);
		controlCtx.fillStyle = 'rgba(237,237,237,' + this.soundFader.fadeParameter + ')';
		controlCtx.fillText(soundText, controlCanvas.width - 24 - soundWidth, controlCanvas.height - 24);
	}
};

controlText.soundToggle = function () {
	this.soundFader = new Fader(0.0, 1.0, 1.5);
	this.soundFader.start();
};