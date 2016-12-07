function ballBallCollision(ball1, ball2) {
	var collData = circleCircleKinematics(ball1, ball2, 1.0);
	if (!collData) return null; // no collision
	if (collData.type == "concentric") { // same center, which is weird, but we'll just wait a frame
		// and hope nobody will notice
		ball1.vx++;
		ball2.vy--;
		return null; // collision is ignored for this frame
	}
	//if (!isNaN(ball1.vx)) console.log(collData);
	ball1.vx += (collData.v1f - collData.v1 /* - ball1.compressionReaction(collData.compression[1])*/)*collData.u.x;
	ball1.vy += (collData.v1f - collData.v1 /* - ball1.compressionReaction(collData.compression[1])*/)*collData.u.y;
	ball2.vx += (collData.v2f - collData.v2 /* + ball2.compressionReaction(collData.compression[2])*/)*collData.u.x;
	ball2.vy += (collData.v2f - collData.v2 /* + ball2.compressionReaction(collData.compression[2])*/)*collData.u.y;
	if (!ball1.rigidCollision && !ball2.rigidCollision) {
		// don't use elastic compression if the balls go too far in a frame; just decompress them as if it's rigid
		ball1.x -= collData.compression[1]*collData.u.x;
		ball1.y -= collData.compression[1]*collData.u.y;
		ball2.x += collData.compression[2]*collData.u.x;
		ball2.y += collData.compression[2]*collData.u.y;
	} else if (ball1.rigidCollision && ball2.rigidCollision) {
		// use elastic compression because there's not much more we can do without getting seriously complicated
		ball1.vx += (collData.v1f - collData.v1 - ball1.compressionReaction(collData.compression[1]))*collData.u.x;
		ball1.vy += (collData.v1f - collData.v1 - ball1.compressionReaction(collData.compression[1]))*collData.u.y;
		ball2.vx += (collData.v2f - collData.v2 + ball2.compressionReaction(collData.compression[2]))*collData.u.x;
		ball2.vy += (collData.v2f - collData.v2 + ball2.compressionReaction(collData.compression[2]))*collData.u.y;
	} else if (ball1.rigidCollision) {
		// ball 2 gets all the compression; it's not so realistic because ball 1 could slide along the compression
		// parallel vector, but it's just one frame; we can replace this if necessary
		ball2.x += collData.compression.total*collData.u.x;
		ball2.y += collData.compression.total*collData.u.y;
	} else if (ball2.rigidCollision) {
		// ball 1 gets all the compression
		ball1.x -= collData.compression.total*collData.u.x;
		ball1.y -= collData.compression.total*collData.u.y;
	}
	var dp = ball1.mass*(collData.v1f - collData.v1) + ball2.mass*(collData.v2 - collData.v2f);
	return {
		v1: collData.v1,
		v2: collData.v2,
		v1f: collData.v1f,
		v2f: collData.v2f,
		dp: dp,
		u: collData.u
	};
}

// returns whatever properties are necessary for game state
function wallBallCollision(wall, ball) {
	var collData = lineCircleKinematics(wall, ball);
	if (!collData) return null;
	if (collData.type == 'center on line') {
		ball.vx++;
		ball.vy++; // nudge the ball
		return null;
	} else if (collData.type == 'near collision') {
		ball.nearCollision = true;
		return null
	}
	//var vi = distance(0,0,ball.vx,ball.vy);
	ball.vx += 2*collData.vnf*collData.u.x;
	ball.vy += 2*collData.vnf*collData.u.y;
	if (ball.rigidCollision == 0 ||
			(ball.rigidCollision == 1 &&
			ball.rigidVector[0].x*collData.u.x + ball.rigidVector[0].y*collData.u.y >= 0)) {
		ball.x += collData.compression*collData.u.x;
		ball.y += collData.compression*collData.u.y;
		ball.rigidVector.push({x: collData.u.x, y: collData.u.y});
		ball.rigidCollision++;
	} else { // fudge
		var px = collData.u.x - (collData.u.x*ball.rigidVector[0].x +
			collData.u.y*ball.rigidVector[0].y)*ball.rigidVector[0].x;
		var py = collData.u.y - (collData.u.x*ball.rigidVector[0].x +
			collData.u.y*ball.rigidVector[0].y)*ball.rigidVector[0].y;
		var p = distance(0,0,px,py);
		var compression = collData.compression*p/(collData.u.x*px + collData.u.y*py);
		ball.x += compression*px/p;
		ball.y += compression*py/p;
	}
	return {vnf: collData.vnf, dp: ball.mass*Math.abs(collData.vn - collData.vnf)};
}

function ballPaddleCollision(ball, paddle) {
	var collData = circleCircleKinematics(ball, paddle, 1.0);
	if (!collData) {
		if (ball.vx == 0 && ball.vy == 0) {
			// ball might be stuck, so nudge it a little
			for (var c = 0; c < ball.rigidVector.length; c++) {
				ball.vx += 10*ball.rigidVector[c].x;
				ball.vy += 10*ball.rigidVector[c].y;
			}
			return null;
		} else {
			return null; // no collision
		}
	}
	if (collData == "concentric") { // same center, which could happen
		ball.vx++;
		return null;
	}
	var pn = ball.mass*collData.v1; // initial momentum of ball along axis of collision
	ball.vx += (collData.v1f - collData.v1)*collData.u.x;
	ball.vy += (collData.v1f - collData.v1)*collData.u.y;
	if (ball.rigidCollision) {
		// zero out the ball's velocity normal to the rigid collision
		for (var i = 0; i < ball.rigidVector.length; i++) {
			if (ball.vx*ball.rigidVector[i].x + ball.vy*ball.rigidVector[i].y < 0) {
				ball.vx -= (ball.vx*ball.rigidVector[i].x + ball.vy*ball.rigidVector[i].y)*ball.rigidVector[i].x;
				ball.vy -= (ball.vx*ball.rigidVector[i].x + ball.vy*ball.rigidVector[i].y)*ball.rigidVector[i].y;
			}
		}
		paddle.x += collData.compression.total*collData.u.x;
		paddle.y += collData.compression.total*collData.u.y;
	} else if (!ball.nearCollision) {
		ball.x -= collData.compression.total*collData.u.x;
		ball.y -= collData.compression.total*collData.u.y;
	}
	var pnf = ball.mass*(ball.vx*collData.u.x + ball.vy*collData.u.y); // final momentum of ball along axis of collision
	return {dp: Math.abs(pn - pnf)};
}

// polygon must have a vertices array, with the vertices as {x:, y:} objects in order
function polygonBallCollision(polygon, ball) {
	var normalCollisions = []; // collisions with each line or vertex
	var nearCollisions = [];
	var centerCollisions = [];
	var v = polygon.vertices.length;
	for (var i = 0; i < v; i++) {
		var line = {
			p1: {
				x: polygon.vertices[i].x,
				y: polygon.vertices[i].y
			},
			p2: {
				x: polygon.vertices[(i + 1) % v].x,
				y: polygon.vertices[(i + 1) % v].y
			}
		};
		var lColl = segmentCircleKinematics(line, ball);
		if (lColl !== null) {
			if (lColl.type == 'normal') normalCollisions.push(lColl);
			else if (lColl.type == 'near collision') nearCollisions.push(lColl);
			else if (lColl.type == 'center on line') centerCollisions.push(lColl);
		}
		var pColl = pointCircleKinematics(polygon.vertices[i], ball);
		if (pColl !== null) {
			if (pColl.type == 'normal') normalCollisions.push(pColl);
			else if (pColl.type == 'near collision') nearCollisions.push(pColl);
			else if (pColl.type == 'center on point') centerCollisions.push(pColl);
		}
	}
	if (normalCollisions.length === 0) {
		if (centerCollisions.length === 0) {
			if (nearCollisions.length === 0) return null;
			else {
				ball.nearCollision = true;
				return null
			}
		} else {
			ball.vx++;
			ball.vy++; // nudge the ball -- but this shouldn't ever actually happen anyway
			return null;
		}
	}
	// find minimum ds in normal collisions, the distance from center of ball to the thing it's hitting
	var minColl = normalCollisions[0];
	for (var i = 1; i < normalCollisions.length; i++) {
		if (normalCollisions[i].ds < minColl.ds) minColl = normalCollisions[i]; // we'll tweak if necessary; it probably won't be
	}
	// actually affect the ball now
	ball.vx += 2*minColl.vnf*minColl.u.x;
	ball.vy += 2*minColl.vnf*minColl.u.y;
	return {dp: ball.mass*2*minColl.vnf};
}

// not an actual collision, exactly...
function explosionBallCollision(explosion, ball) {
	var collData = explosionCircleKinematics(explosion, ball, explosion.explosionForceConstant);
	ball.vx += (collData.vnf - collData.vn)*collData.u.x;
	ball.vy += (collData.vnf - collData.vn)*collData.u.y;
}