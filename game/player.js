player = {
	lives: undefined,
	powerups: undefined,
	score: undefined
}

player.initPlayer = function () {
	this.lives = 0;
	this.score = 0; // not sure if we want to implement score...
	this.powerups = {}; // none of these yet
}

player.die = function () {
	this.lives--;
	if (this.lives < 0 && gameState.level) levelScreen.gameOver();
}