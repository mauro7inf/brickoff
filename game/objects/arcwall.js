// walls in the shape of circular arcs; also invisible and need to be drawn separately, 1D
// center at (x, y), from angle t1 to t2 clockwise or counterclockwise if cc is true
// 0 is +x, pi/2 is +y, which is *down*
function ArcWall(x, y, radius, t1, t2, cc) {
	// basics
	this.type = "ArcWall";
	this.open = false; // set to true for no collisions on the endpoints
	
	// definition
	this.x = x;
	this.y = y;
	this.radius = radius;
	// the arc is always clockwise, so we'll adjust t1 and t2 if not
	if (!cc) {
		this.t1 = t1;
		this.t2 = t2;
	} else {
		this.t1 = t2;
		this.t2 = t1;
	}
	while (this.t1 < 0) this.t1 += 2*Math.PI
	while (this.t1 >= 2*Math.PI) this.t1 -= 2*Math.PI;
	while (this.t2 > this.t1) this.t2 -= 2*Math.PI;
	while (this.t2 <= this.t1) this.t2 += 2*Math.PI;
	
	// game data
	this.passable = {};
}
ArcWall.prototype = new GameObject();

/*ArcWall.prototype.draw = function () {
	gameCtx.strokeStyle = "white";
	gameCtx.beginPath();
	gameCtx.arc(this.x, this.y, this.radius, this.t1, this.t2, false);
	gameCtx.stroke();
}*/