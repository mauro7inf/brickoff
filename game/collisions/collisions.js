// performs a collision of two GameObjects
function collide(obj1, obj2) {
	if (collisions[obj1.type] == undefined || collisions[obj1.type][obj2.type] == undefined) return;
	if (obj1.locked || obj2.locked) return; // don't collide locked objects
	collisions[obj1.type][obj2.type](obj1, obj2);
}

collisions = {
	Wall: {
		Wall: function (wall1, wall2) {}, // no collisions between walls
		PurpleBall: function (wall, ball) {
			if (!ball.isIn || wall.passable[ball.type]) return; // no wall collision until the ball is in or if wall is permeable
			var collData = wallBallCollision(wall, ball);
			if (collData) ball.damage(Math.abs(2*collData.vnf*ball.mass));
		},
		PlayerPaddle: function (wall, paddle) {
			if (wall.passable[paddle.type]) return;
			var collData = lineCircleKinematics(wall, paddle);
			if (!collData) return;
			if (collData.type == 'center on line') { // shouldn't happen
				paddle.x++;
				paddle.y++;
				return;
			} else if (collData.type == 'near collision') return;
			paddle.vx += collData.vnf*collData.u.x; // zero out normal velocity
			paddle.vy += collData.vnf*collData.u.y;
			paddle.x += collData.compression*collData.u.x;
			paddle.y += collData.compression*collData.u.y;
		},
		CueBall: function (wall, ball) {
			if (wall.passable[ball.type]) return;
			var collData = wallBallCollision(wall, ball);
			if (collData) soundBank.wallClunk(collData.dp/100000000.0);
		},
		Bomb: function (wall, ball) {
			if (wall.passable[ball.type]) return;
			var collData = wallBallCollision(wall, ball);
			if (collData) {
				ball.damage(Math.abs(2*collData.vnf*ball.mass/7));
				soundBank.bombWallClunk(collData.dp/100000000.0);
			}
		}
	},
	PurpleBall: {
		Wall: function (ball, wall) {
			collisions['Wall']['PurpleBall'](wall, ball);
		},
		PurpleBall: function (ball1, ball2) {
			var collData = ballBallCollision(ball1, ball2);
			if (!collData) return;
			ball1.damage(ball1.mass*(collData.v1 - collData.v1f));
			ball2.damage(ball2.mass*(collData.v2f - collData.v2));
		},
		PlayerPaddle: function (ball, paddle) {
			var collData = ballPaddleCollision(ball, paddle);
		}
	},
	PlayerPaddle: {
		Wall: function (paddle, wall) {
			collisions['Wall']['PlayerPaddle'](wall, paddle);
		},
		PurpleBall: function (paddle, ball) {
			collisions['PurpleBall']['PlayerPaddle'](ball, paddle);
		},
		CueBall: function (paddle, ball) {
			if (paddle.lifted || (paddle.capturing && ball.captured == paddle)) return;
			var collData = ballPaddleCollision(ball, paddle);
			if (collData) {
				ball.lastTouched = 0;
				ball.expired = false;
				soundBank.paddleTouch(collData.dp/100000000.0);
			}
		},
		ArcWall: function (paddle, arc) {
			collisions['ArcWall']['PlayerPaddle'](arc, paddle);
		}
	},
	CueBall: {
		Wall: function (ball, wall) {
			collisions['Wall']['CueBall'](wall, ball);
		},
		PlayerPaddle: function (ball, paddle) {
			collisions['PlayerPaddle']['CueBall'](paddle, ball);
		},
		SimpleBrick: function (ball, brick) {
			var collData = circleRectangleKinematics(ball, brick);
			if (!collData) return;
			ball.x += collData.compression*collData.u.x;
			ball.y += collData.compression*collData.u.y;
			if (collData.vn > 0) return;
			ball.vx += 2*collData.vnf*collData.u.x;
			ball.vy += 2*collData.vnf*collData.u.y;
			var dp = 2*collData.vnf*ball.mass  // change in momentum of ball
			brick.damage(dp);
			if (brick.type == 'SimpleBrick') {
				brick.dying ? soundBank.brickDestroy(dp/100000000.0, brick.frequency) : soundBank.brickClunk(dp/100000000.0, brick.frequency);
			} else if (brick.type == 'HealingBrick') {
				brick.dying ? soundBank.healingDestroy(dp/100000000.0, brick.frequency) : soundBank.healingClunk(dp/100000000.0, brick.frequency);
			}
		},
		HealingBrick: function (ball, brick) {
			collisions['CueBall']['SimpleBrick'](ball, brick);
		},
		ArcWall: function (ball, arc) {
			collisions['ArcWall']['CueBall'](arc, ball);
		},
		PolygonBrick: function (ball, brick) {
			var collData = polygonBallCollision(brick, ball);
			if (!collData) return;
			brick.damage(collData.dp);
			brick.dying ? soundBank.polygonDestroy(collData.dp/100000000.0, brick.frequency1, brick.frequency2, brick.frequency3) : soundBank.polygonClunk(collData.dp/100000000.0, brick.frequency1, brick.frequency2, brick.frequency3);
		},
		Bomb: function (cue, bomb) {
			var collData = ballBallCollision(cue, bomb);
			if (!collData) return;
			bomb.damage(bomb.mass*(collData.v2f - collData.v2));
			soundBank.bombClunk(Math.abs(collData.dp/100000000.0), bomb.frequency);
			if (bomb.cueBallBounce) {
				cue.vx -= bomb.cueBallBounce*collData.u.x;
				cue.vy -= bomb.cueBallBounce*collData.u.y;
			}
		},
		Explosion: function (ball, explosion) {
			explosionBallCollision(explosion, ball);
		}
	},
	SimpleBrick: {
		CueBall: function (brick, ball) {
			collisions['CueBall']['SimpleBrick'](ball, brick);
		}
	},
	ArcWall: {
		CueBall: function (arc, ball) {
			if (arc.passable[ball.type]) return;
			var collData = arcCircleKinematics(arc, ball, 1.0);
			if (!collData) return;
			arcBallCompression(arc, ball, collData);
			if (collData.type == "near collision") {
				ball.nearCollision = true;
			} else if (collData.type == "center on arc") {
				ball.vx *= -1;
				ball.vy *= -1; // this should never actually happen
			} else if (collData.u && collData.vn < 0) {
				ball.rigidCollision++;
				ball.rigidVector.push({x: collData.u.x, y: collData.u.y});
				ball.vx += 2*collData.vnf*collData.u.x;
				ball.vy += 2*collData.vnf*collData.u.y;
			}
			if (collData && collData.type != "near collision") {
				var dp = ball.mass*2*collData.vnf;
				soundBank.wallClunk(dp/100000000.0);
			}
		},
		PlayerPaddle: function (arc, paddle) {
			if (arc.passable[paddle.type]) return;
			var collData = arcCircleKinematics(arc, paddle, 1.0);
			arcBallCompression(arc, paddle, collData);
			if (collData && collData.u) {
				paddle.vx += collData.vnf*collData.u.x; // zero out normal velocity
				paddle.vy += collData.vnf*collData.u.y;
			}
		},
		Bomb: function (arc, ball) {
			if (arc.passable[ball.type]) return;
			var collData = arcCircleKinematics(arc, ball, 1.0);
			if (!collData) return;
			arcBallCompression(arc, ball, collData);
			if (collData.type == "near collision") {
				ball.nearCollision = true;
			} else if (collData.type == "center on arc") {
				ball.vx *= -1;
				ball.vy *= -1; // this should never actually happen
			} else if (collData.u && collData.vn < 0) {
				ball.rigidCollision++;
				ball.rigidVector.push({x: collData.u.x, y: collData.u.y});
				ball.vx += 2*collData.vnf*collData.u.x;
				ball.vy += 2*collData.vnf*collData.u.y;
			}
			if (collData && collData.type != "near collision") {
				var dp = ball.mass*2*collData.vnf;
				ball.damage(Math.abs(2*collData.vnf*ball.mass/7));
				soundBank.bombWallClunk(dp/100000000.0);
			}
		}
	},
	HealingBrick: {
		CueBall: function (brick, ball) {
			collisions['CueBall']['SimpleBrick'](ball, brick);
		}
	},
	PolygonBrick: {
		CueBall: function (brick, ball) {
			collisions['CueBall']['PolygonBrick'](ball, brick);
		}
	},
	Bomb: {
		Wall: function (ball, wall) {
			collisions['Wall']['Bomb'](wall, ball);
		},
		CueBall: function (bomb, cue) {
			collisions['CueBall']['Bomb'](cue, bomb);
		},
		ArcWall: function (ball, arc) {
			collisions['ArcWall']['Bomb'](arc, ball);
		},
		Bomb: function (bomb1, bomb2) {
			var collData = ballBallCollision(bomb1, bomb2);
			if (!collData) return;
			bomb1.damage(bomb1.mass*(collData.v1 - collData.v1f)/5);
			bomb2.damage(bomb2.mass*(collData.v2f - collData.v2)/5);
			if (collData && collData.type != "near collision") {
				soundBank.bombBombClink(Math.abs(collData.dp)/100000000.0);
			}
		},
		Explosion: function (bomb, explosion) {
			explosionBallCollision(explosion, bomb);
		}
	},
	Explosion: {
		CueBall: function (explosion, ball) {
			collisions['CueBall']['Explosion'](ball, explosion);
		},
		Bomb: function (explosion, bomb) {
			collisions['Bomb']['Explosion'](bomb, explosion);
		}
	}
};