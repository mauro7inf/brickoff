// point walls are immobile and invisible
// they're also 0-dimensional
function PointWall(x, y) {
	// basics
	this.type = "PointWall";
	
	// definition
	this.x = x;
	this.y = y;
	
	// game aspects
	this.passable = {}; // what types this wall has no collisions with
}
PointWall.prototype = new GameObject();