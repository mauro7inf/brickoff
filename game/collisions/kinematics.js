// returns an object of useful information regarding a circle-circle collision
// null if they don't collide
// ball1 and ball2 have properties x, y, vx, vy, radius, mass
// cR is the coefficient of restitution, 1.0 for elastic and 0.0 for inelastic
function circleCircleKinematics(ball1, ball2, cR) {
	var ds = distance(ball1.x, ball1.y, ball2.x, ball2.y);
	if (ds > ball1.radius + ball2.radius) return null; // no collision
	if (ds == 0) return {type: "concentric"};
	var compLength = ball1.radius + ball2.radius - ds;
	var compression = {
		total: compLength,
		1: compLength*ball2.radius/(ball1.radius + ball2.radius),
		2: compLength*ball1.radius/(ball1.radius + ball2.radius)
	};
	var dx = ball2.x - ball1.x;
	var dy = ball2.y - ball1.y;
	var ux = dx/ds;
	var uy = dy/ds;
	var v1 = ball1.vx*ux + ball1.vy*uy; // projection along axis of collision;
	var v2 = ball2.vx*ux + ball2.vy*uy; // v1 - v2 should be positive
	var v1f = v1; // no change if v1 - v2 is negative
	var v2f = v2;
	if (v1 - v2 > 0) {
		if (!isNaN(ball1.mass) && !isNaN(ball2.mass)) {
			v1f = (cR*ball2.mass*(v2 - v1) + ball1.mass*v1 + ball2.mass*v2)/(ball1.mass + ball2.mass);
			v2f = (cR*ball1.mass*(v1 - v2) + ball1.mass*v1 + ball2.mass*v2)/(ball1.mass + ball2.mass);
		} else if (isNaN(ball1.mass) && isNaN(ball2.mass)) {
			// no collision
		} else if (isNaN(ball1.mass)) {
			v2f = cR*(v1 - v2) + v1;
		} else {
			v1f = cR*(v2 - v1) + v2;
		}
	}
	return {
		type: "normal",
		compression: compression, // how much each ball is compressed due to discrete frames
		v1: v1, // velocity of ball 1 prior to impact along the axis of collision
		v2: v2,
		v1f: v1f, // velocity of ball 1 after impact along the axis of collision
		v2f: v2f,
		u: { // unit vector pointing from the center of ball 1 towards the center of ball 2
			x: ux,
			y: uy,
		}
	};
}

// returns an object of useful information regarding a circle-line segment collision
// null if they don't collide
function lineCircleKinematics(wall, ball) {
	var centerToLine = Math.abs((wall.A*ball.x + wall.B*ball.y + wall.C)/wall.D);
	if (centerToLine > 2*ball.radius) {
		return null;
	}
	var xColl = (wall.B*(wall.B*ball.x - wall.A*ball.y) - wall.A*wall.C)/(wall.A*wall.A + wall.B*wall.B);
	var yColl = (wall.A*(wall.A*ball.y - wall.B*ball.x) - wall.B*wall.C)/(wall.A*wall.A + wall.B*wall.B);
	if (wall.B) { // not vertical wall
		if (wall.x1 < xColl && xColl < wall.x2) { // hits the wall
		} else if (wall.open) {
			return null
		} else if (xColl <= wall.x1) {
			if (distance(wall.x1, wall.y1, ball.x, ball.y) <= 2*ball.radius) { // corner hit
				xColl = wall.x1;
				yColl = wall.y1;
			} else return null;
		} else if (wall.x2 <= xColl) {
			if (distance(wall.x2, wall.y2, ball.x, ball.y) <= 2*ball.radius) {
				xColl = wall.x2;
				yColl = wall.y2;
			} else return null;
		} else return null;
	} else { // vertical
		var ys = (wall.y1 < wall.y2) ? wall.y1 : wall.y2;
		var yl = (wall.y1 < wall.y2) ? wall.y2 : wall.y1;
		if (ys < yColl && yColl < yl) { // hits the wall
		} else if (wall.open) {
			return null;
		} else if (yColl <= ys) {
			if (distance(wall.x1, ys, ball.x, ball.y) <= 2*ball.radius) { // corner hit
				yColl = ys;
			} else return null;
		} else if (yl <= yColl) {
			if (distance(wall.x1, yl, ball.x, ball.y) <= 2*ball.radius) { // corner hit
				yColl = yl;
			} else return null;
		} else return null;
	}
	var dx = ball.x - xColl;
	var dy = ball.y - yColl;
	var ds = distance(xColl, yColl, ball.x, ball.y);
	var compression;
	var ux;
	var uy;
	if (ds == 0) {
		// normal from wall: (A/D, B/D)
		dx = ball.lastPosition.x - xColl;
		dy = ball.lastPosition.y - yColl;
		if (dx*wall.A/wall.D + dy*wall.B/wall.D >= 0) {
			ux = wall.A/wall.D;
			uy = wall.B/wall.D;
		} else {
			ux = -wall.A/wall.D;
			uy = -wall.A/wall.D;
		}
		compression = ball.radius;
	} else {
		if ((ball.lastPosition.x - xColl)*dx + (ball.lastPosition.y - yColl)*dy < 0) {
			ds *= -1;
		}
		ux = dx/ds; // unit vector from point of collision to center of ball
		uy = dy/ds;
		compression = ball.radius - ds;
	}
	var vn = ball.vx*ux + ball.vy*uy; // projection of ball's velocity onto the unit vector
	if (ds > ball.radius/* && vn < 0*/) {
		return {type: "near collision"};
	}
	return {
		type: "normal",
		compression: compression,
		vn: vn,
		vnf: -vn, // the ball bounces back at the same normal velocity
		u: {
			x: ux,
			y: uy
		}
	};
}

// can be stacked for a polygon
// line here, assumed stationary (for now), needs the following form:
/*
	{
		p1: {
			x: (...),
			y: (...),
		},
		p2: {
			x: (...),
			y: (...)
		}
	}
*/
// circle, assumed moving, needs the following form:
/*
	{
		x: (...),
		y: (...),
		vx: (...),
		vy: (...),
		radius: (...)
	}
*/
// line segment is OPEN, meaning that no collisions will take place involving the endpoints.
// this is important, because it means that endpoints WILL need to be handled, but separately
function segmentCircleKinematics(line, circle) {
	var directionVector = {
		x: line.p2.x - line.p1.x,
		y: line.p2.y - line.p1.y
	}; // p, from p1 to p2, such that p1 + directionVector = p2
	var pp = directionVector.x*directionVector.x + directionVector.y*directionVector.y; // |p|^2
	var bVector = {
		x: circle.x - line.p1.x,
		y: circle.y - line.p1.y
	}; // b, from p1 to the center of the circle
	var t = (directionVector.x*bVector.x + directionVector.y*bVector.y)/pp; // if the line from p1 to p2 is parametrized from t = 0 to t = 1, this would be the value of t at which b is closest to the line
	if (t <= 0 || t >= 1) return null; // collision is not with the line
	var scVector = {
		x: bVector.x - t*directionVector.x,
		y: bVector.y - t*directionVector.y
	}; // vector from closest point on segment to center of circle
	var ds = distance(0, 0, scVector.x, scVector.y); // distance from segment to circle
	if (ds > 2*circle.radius) return null;
	if (ds > circle.radius) return {type: 'near collision'};
	if (ds == 0) return {type: 'center on line'};
	var compression = circle.radius - ds;
	var u = {
		x: scVector.x/ds,
		y: scVector.y/ds
	}; // unit normal vector
	var vn = circle.vx*u.x + circle.vy*u.y; // normal velocity
	if (vn >= 0) return null; // if the circle is already heading away from the line, there's nothing to do here
	return {
		type: "normal",
		compression: compression,
		vn: vn,
		vnf: -vn, // the ball bounces back at the same normal velocity, for now
		u: u,
		ds: ds
	};
}

// point assumed stationary; has x and y
// circle like segmentCircleKinematics
function pointCircleKinematics(point, circle) {
	var ds = distance(point.x, point.y, circle.x, circle.y);
	if (ds > 2*circle.radius) return null;
	if (ds > circle.radius) return {type: 'near collision'};
	if (ds == 0) return {type: 'center on point'};
	var compression = circle.radius - ds;
	var u = {
		x: (circle.x - point.x)/ds,
		y: (circle.y - point.y)/ds
	};
	var vn = circle.vx*u.x + circle.vy*u.y; // normal velocity
	if (vn >= 0) return null; // if the circle is already heading away from the point, there's nothing to do here
	return {
		type: "normal",
		compression: compression,
		vn: vn,
		vnf: -vn, // the ball bounces back at the same normal velocity, for now
		u: u,
		ds: ds
	};
}

function circleRectangleKinematics(ball, brick) {
	// we'll assume stationary rectangle for the nonce
	// assume the rectangle is aligned with the axes too; we'll change this eventually
	if (distance(brick.center.x, brick.center.y, ball.x, ball.y) > brick.radius + ball.radius) {
		return null;
	}
	var collData = {};
	var tCollData = {u: {}};
	var tBall = {x: ball.x, y: ball.y}; // coordinate transformations would go here
	var tBrick = {tl: brick.tl, tr: brick.tr, br: brick.br, bl: brick.bl};
	// we'll want to do coordinate transformations
	// eight regions this ball could be in with respect to the brick
	if (tBall.y >= tBrick.br.y) { // bottom region
		if (tBrick.bl.x <= tBall.x && tBall.x <= tBrick.br.x) { // bottom side
			var ds = tBall.y - tBrick.br.y;
			if (ds > ball.radius) return null;
			tCollData.xColl = tBall.x;
			tCollData.yColl = tBrick.br.y;
			tCollData.u.x = 0.0;
			tCollData.u.y = 1.0;
			collData.compression = ball.radius - ds;
		} else if (tBall.x < tBrick.bl.x) { // bl corner
			var ds = distance(tBall.x, tBall.y, tBrick.bl.x, tBrick.bl.y);
			if (ds > ball.radius) return null;
			tCollData.xColl = tBrick.bl.x;
			tCollData.yColl = tBrick.bl.y;
			tCollData.u.x = (tBall.x - tBrick.bl.x)/ds;
			tCollData.u.y = (tBall.y - tBrick.bl.y)/ds;
			collData.compression = ball.radius - ds;
		} else if (tBall.x > tBrick.br.x) { // br corner
			var ds = distance(tBall.x, tBall.y, tBrick.br.x, tBrick.br.y);
			if (ds > ball.radius) return null;
			tCollData.xColl = tBrick.br.x;
			tCollData.yColl = tBrick.br.y;
			tCollData.u.x = (tBall.x - tBrick.br.x)/ds;
			tCollData.u.y = (tBall.y - tBrick.br.y)/ds;
			collData.compression = ball.radius - ds;
		} else return null;
	} else if (tBall.y <= tBrick.tr.y) { // top region
		if (tBrick.tl.x <= tBall.x && tBall.x <= tBrick.tr.x) { // top side
			var ds = tBrick.tr.y - tBall.y;
			if (ds > ball.radius) return null;
			tCollData.xColl = tBall.x;
			tCollData.yColl = tBrick.tr.y;
			tCollData.u.x = 0.0;
			tCollData.u.y = -1.0;
			collData.compression = ball.radius - ds;
		} else if (tBall.x < tBrick.tl.x) { // tl corner
			var ds = distance(tBall.x, tBall.y, tBrick.tl.x, tBrick.tl.y);
			if (ds > ball.radius) return null;
			tCollData.xColl = tBrick.tl.x;
			tCollData.yColl = tBrick.tl.y;
			tCollData.u.x = (tBall.x - tBrick.tl.x)/ds;
			tCollData.u.y = (tBall.y - tBrick.tl.y)/ds;
			collData.compression = ball.radius - ds;
		} else if (tBall.x > tBrick.tr.x) { // tr corner
			var ds = distance(tBall.x, tBall.y, tBrick.tr.x, tBrick.tr.y);
			if (ds > ball.radius) return null;
			tCollData.xColl = tBrick.tr.x;
			tCollData.yColl = tBrick.tr.y;
			tCollData.u.x = (tBall.x - tBrick.tr.x)/ds;
			tCollData.u.y = (tBall.y - tBrick.tr.y)/ds;
			collData.compression = ball.radius - ds;
		} else return null;
	} else if (tBall.x <= tBrick.tl.x) { // left side
		var ds = tBrick.tl.x - tBall.x;
		if (ds > ball.radius) return null;
		tCollData.xColl = tBrick.tl.x;
		tCollData.yColl = tBall.y;
		tCollData.u.x = -1.0;
		tCollData.u.y = 0.0;
		collData.compression = ball.radius - ds;
	} else if (tBall.x >= tBrick.tr.x) { // right side
		var ds = tBall.x - tBrick.tr.x;
		if (ds > ball.radius) return null;
		tCollData.xColl = tBrick.tr.x;
		tCollData.yColl = tBall.y;
		tCollData.u.x = 1.0;
		tCollData.u.y = 0.0;
		collData.compression = ball.radius - ds;
	} else return null;
	collData.xColl = tCollData.xColl; // transform the coordinates back
	collData.yColl = tCollData.yColl;
	collData.u = tCollData.u;
	collData.vn = (ball.vx*collData.u.x + ball.vy*collData.u.y);
	collData.vnf = -collData.vn;
	return collData;
}

function arcCircleKinematics(arc, ball, cR) { // yay polar coordinates
	var centerDistance = distance(arc.x, arc.y, ball.x, ball.y);
	if (centerDistance > arc.radius + 2*ball.radius) return null;
	if (centerDistance < arc.radius - 2*ball.radius) return null;
	var ballAngle = Math.atan2(ball.y - arc.y, ball.x - arc.x);
	var prevBallAngle = Math.atan2(ball.lastPosition.y - arc.y, ball.lastPosition.x - arc.x);
	var prevDistance = distance(arc.x, arc.y, ball.lastPosition.x, ball.lastPosition.y);
	var flipPassed = 1; // -1 if the ball crossed the arc
	var inRange = angleInRange(ballAngle, arc.t1, arc.t2);
	if (centerDistance == arc.radius && inRange) {
		if (angleInRange(prevBallAngle, arc.t1, arc.t2)) {
			if (prevDistance < centerDistance) centerDistance -= 0.1; // just provide the ball with a direction
			else if (prevDistance > centerDistance) centerDistance += 0.1;
		} else {
			var prevOrientation = Math.atan2(ball.lastPosition.y - ball.y, ball.lastPosition.x - ball.x);
			if (angleInRange(prevOrientation, ballAngle + 0.5*Math.PI, ballAngle + 1.5*Math.PI)) {
				centerDistance -= 0.1;
			} else centerDistance += 0.1;
		}
	}
	var xColl, yColl, ux, uy, compression;
	var type = "normal";
	var x1, x2, y1, y2; // arc endpoints; will be left undefined unless they're necessary
	if (inRange && !(centerDistance < arc.radius && ball.radius > arc.radius)) { // ball inside the sector
		if (angleInRange(prevBallAngle, arc.t1, arc.t2)) {
			if ((prevDistance > arc.radius && centerDistance < arc.radius) ||
				(prevDistance < arc.radius && centerDistance > arc.radius)) flipPassed = -1;
		}
		if (centerDistance > arc.radius) { // ball is outside arc
			if (centerDistance <= arc.radius + ball.radius) {
				xColl = arc.radius*Math.cos(ballAngle) + arc.x;
				yColl = arc.radius*Math.sin(ballAngle) + arc.y;
				ux = flipPassed*Math.cos(ballAngle);
				uy = flipPassed*Math.sin(ballAngle);
				compression = arc.radius + ball.radius - centerDistance;
				if (flipPassed == -1) compression = centerDistance - arc.radius + ball.radius;
			} else return {type: "near collision"};
		} else if (centerDistance < arc.radius) { // ball is inside arc
			if (centerDistance >= arc.radius - ball.radius) { // ball is never bigger than arc
				xColl = arc.radius*Math.cos(ballAngle) + arc.x;
				yColl = arc.radius*Math.sin(ballAngle) + arc.y;
				ux = -flipPassed*Math.cos(ballAngle);
				uy = -flipPassed*Math.sin(ballAngle);
				compression = centerDistance - arc.radius + ball.radius;
				if (flipPassed == -1) compression = arc.radius + ball.radius - centerDistance;
			} else return {type: "near collision"};
		} else return {type: "center on arc"}; // this would have happened already
	} else { // ball outside the sector or inside sector but bigger than arc
		var x1 = arc.radius*Math.cos(arc.t1) + arc.x;
		var y1 = arc.radius*Math.sin(arc.t1) + arc.y;
		var x2 = arc.radius*Math.cos(arc.t2) + arc.x;
		var y2 = arc.radius*Math.sin(arc.t2) + arc.y;
		var ds1 = distance(x1, y1, ball.x, ball.y);
		var ds2 = distance(x2, y2, ball.x, ball.y);
		if (ds1 == 0 || ds2 == 0) return {type: "center on arc"};
		if (ball.radius >= arc.radius) {
			type = "larger ball";
		} else if (arc.open) {
			return null; // no collision with endpoints if endpoints aren't included
		}
		//if (ds1 > ball.radius && ds2 <= ball.radius) { // close to point 1
		if (ds1 <= ball.radius && ds1 < ds2) { // don't recenter except in cases of equality
			xColl = x1;
			yColl = y1;
			ux = (ball.x - x1)/ds1;
			uy = (ball.y - y1)/ds1;
			compression = ds1 - ball.radius;
		//} else if (ds1 <= ball.radius && ds2 > ball.radius) { // close to point 2
		} else if (ds2 <= ball.radius && ds2 < ds1) { // don't recenter except in cases of equality
			xColl = x2;
			yColl = y2;
			ux = (ball.x - x2)/ds1;
			uy = (ball.y - y2)/ds1;
			compression = ds1 - ball.radius;
		} else if (ds1 <= ball.radius && ds2 <= ball.radius) { // close to both (equally)
			type = "recenter";
			xColl = arc.radius*Math.cos(0.5*(arc.t1 + arc.t2)) + arc.x;
			yColl = arc.radius*Math.sin(0.5*(arc.t1 + arc.t2)) + arc.y;
			ux = -Math.cos(0.5*(arc.t1 + arc.t2));
			uy = -Math.sin(0.5*(arc.t1 + arc.t2));
			// compression will be measured from xColl and yColl
			var halfAngle = 0.5*(arc.t2 - arc.t1);
			var rcost = Math.cos(halfAngle)*arc.radius;
			compression = Math.sqrt(rcost*rcost + ball.radius*ball.radius - arc.radius*arc.radius) - rcost;
		} else if (ds1 > 2*ball.radius && ds2 > 2*ball.radius) { // far from both
			return null; // no collision
		} else { // one of the distances is not a collision but close to one
			return {type: "near collision"};
		}
	}
	var vn = ball.vx*ux + ball.vy*uy;
	return {
		type: type,
		xColl: xColl,
		yColl: yColl,
		compression: compression,
		u: {x: ux, y: uy},
		vn: vn,
		vnf: -vn,
		x1: x1,
		y1: y1,
		x2: x2,
		y2: y2
	};
}

// explosions act at a distance; fC is the force constant (F = fC/d^2)
// since it's a force, ball needs to have mass
function explosionCircleKinematics(explosion, ball, fC) {
	var ds = distance(explosion.x, explosion.y, ball.x, ball.y);
	var force = fC/(ds*ds);
	var dx = ball.x - explosion.x;
	var dy = ball.y - explosion.y;
	var u = {x: dx/ds, y: dy/ds};
	var vn = ball.vx*u.x + ball.vy*u.y; // normal velocity
	var vnf = vn + (force/ball.mass)*globalOptions.mspf; // F = ma
	return {
		type: "explosion",
		u: u,
		vn: vn,
		vnf: vnf
	};
}

// returns area of overlap; rectangle should have tl; {x:..., y...}, tr, bl, and br; circle should have x, y, and radius
function rectangleCircleOverlap(rect, ball) {
	if (rect.tl.x - ball.radius >= ball.x ||
		rect.tl.y - ball.radius >= ball.y ||
		rect.br.x + ball.radius <= ball.x ||
		rect.br.y + ball.radius <= ball.y) {
		// circle is outside the rectangle -- no intersection
		return 0;
	}
	if (rect.tl.x + ball.radius <= ball.x &&
		rect.tl.y + ball.radius <= ball.y &&
		rect.br.x - ball.radius >= ball.x &&
		rect.br.y - ball.radius >= ball.y) {
		// circle is inside the rectangle -- intersection is circle
		return Math.PI*ball.radius*ball.radius;
	}
	var dtl = distance(rect.tl.x, rect.tl.y, ball.x, ball.y); // distance of top left corner of rectangle from center of circle
	var dtr = distance(rect.tr.x, rect.tr.y, ball.x, ball.y);
	var dbl = distance(rect.bl.x, rect.bl.y, ball.x, ball.y);
	var dbr = distance(rect.br.x, rect.br.y, ball.x, ball.y);
	if (dtl <= ball.radius && dtr <= ball.radius && dbl <= ball.radius && dbr <= ball.radius) {
		// all four corners of rectangle are inside the circle -- intersection is rectangle
		return (rect.br.x - rect.tl.x)*(rect.br.y - rect.tl.y);
	}
	/*if (dtl >= ball.radius && dtr >= ball.radius && dbl >= ball.radius && dbr >= ball.radius) {
		// none of the four corners is inside the circle
		// we've already excluded the cases where there's no intersection or when the circle is completely inside,
		// so this must mean that the circle is incompletely inside
		// this is a hard problem and not one that actually comes up so far, so...
	}*/
	// ...just don't actually intersect!  Small ball, big field.  It's OK.
	return 0;
}