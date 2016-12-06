levelScreen.levelData = {
	1: {
		title: 'In C',
		newLives: 5,
		geometry: {
			cornerRadius: 100,
			tb: 50,
			bb: 50,
			lb: 50,
			rb: 50,
			goalWidth: 250,
			goalRadius: 45
		},
		initWalls: 'initWallsRounded',
		initBricks: 'initBricks1',
		initPaddleAndBall: 'initPaddleAndBallA',
		drawGameWall: 'drawGameWallRounded',
		gradients: 'gradients1',
		outlineFill: {
			r: 30,
			g: 0,
			b: 0
		},
		outlineStroke: {
			r: 255,
			g: 64,
			b: 64
		}
	},
	2: {
		title: 'Many Colors',
		newLives: 1,
		geometry: {
			cornerRadius: 25,
			tb: 50,
			bb: 50,
			lb: 50,
			rb: 50,
			goalWidth: 250,
			goalRadius: 25
		},
		initWalls: 'initWallsRounded',
		initBricks: 'initBricks2',
		initPaddleAndBall: 'initPaddleAndBallA',
		drawGameWall: 'drawGameWallRounded',
		gradients: 'gradients2',
		outlineFill: {
			r: 30,
			g: 15,
			b: 0
		},
		outlineStroke: {
			r: 255,
			g: 160,
			b: 64
		}
	},
	3: {
		title: 'They Heal',
		newLives: 1,
		geometry: {
			cornerRadius: 1,
			tb: 50,
			bb: 50,
			lb: 50,
			rb: 50,
			goalWidth: 150,
			goalRadius: 1,
			centerLineOffset: 52
		},
		initWalls: 'initWallsClipped',
		initBricks: 'initBricks3',
		initPaddleAndBall: 'initPaddleAndBallA',
		drawGameWall: 'drawGameWallClipped',
		gradients: 'gradients3',
		outlineFill: {
			r: 30,
			g: 30,
			b: 0
		},
		outlineStroke: {
			r: 255,
			g: 255,
			b: 64
		}
	},
	4: {
		title: 'The Brick Road',
		newLives: 1,
		geometry: {
			cornerRadius: 102,
			tb: 50,
			bb: 50,
			lb: 50,
			rb: 50,
			goalWidth: 200,
			goalRadius: 50
		},
		initWalls: 'initWallsClipped',
		initBricks: 'initBricks4',
		initPaddleAndBall: 'initPaddleAndBallA',
		drawGameWall: 'drawGameWallClipped',
		gradients: 'gradients4',
		outlineFill: {
			r: 15,
			g: 30,
			b: 0
		},
		outlineStroke: {
			r: 160,
			g: 255,
			b: 64
		}
	},
	5: {
		title: 'Boom',
		newLives: 1,
		geometry: {
			cornerRadius: 190,
			tb: 50,
			bb: 25,
			lb: 50,
			rb: 50,
			goalWidth: 300,
			goalRadius: 20,
			centerLineOffset: 72
		},
		initWalls: 'initWallsRounded',
		initBricks: 'initBricks5',
		initPaddleAndBall: 'initPaddleAndBallA',
		drawGameWall: 'drawGameWallRounded',
		gradients: 'gradients5',
		outlineFill: {
			r: 0,
			g: 30,
			b: 0
		},
		outlineStroke: {
			r: 64,
			g: 255,
			b: 64
		}
	}
};