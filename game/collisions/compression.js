// deals with compression for an arc collision
function arcBallCompression(arc, ball, collData) { // also works on a paddle
	if (!collData || !collData.u) return; // collData from arcCircleKinematics
	var xn = ball.x + collData.compression*collData.u.x; // new location
	var yn = ball.y + collData.compression*collData.u.y;
	if (distance(xn,yn,collData.x1,collData.y1) < ball.radius || distance(xn,yn,collData.x2,collData.y2) < ball.radius) {
		if (ball.radius == arc.radius) {
			ball.x = arc.x;
			ball.y = arc.y;
		} else if (ball.radius > arc.radius) {
			var to2 = 0.5*(arc.t2 - arc.t1);
			var s = ball.radius*Math.sqrt(1 - ((arc.radius*arc.radius)/(ball.radius*ball.radius))*Math.pow(Math.sin(to2),2)) -
				arc.radius*Math.cos(to2);
			var px = -Math.cos(0.5*(arc.t1 + arc.t2));
			var py = -Math.sin(0.5*(arc.t1 + arc.t2));
			ball.x = arc.x + s*px;
			ball.y = arc.y + s*py;
		} else { // other case is never going to happen but we might as well be careful
			ball.x = xn;
			ball.y = yn;
		}
	} else {
		ball.x = xn;
		ball.y = yn;
	}
	if (debug) {
		ball.collData = collData; // so we can inspect issues here
		if (ball.x == 740 && ball.y == 740) console.log('wall');
	}
}