// walls are immobile and invisible; they're drawn as part of the background
// they're also 1-dimensional
// breaks if it has size 0, for now
function Wall(x1, y1, x2, y2) {
	// basics
	this.type = "Wall";
	this.open = false; // set to true for no collisions on the endpoints
	
	// definition
	if (x1 < x2 || (x1 == x2 && y1 < y2)) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	} else {
		this.x1 = x2;
		this.y1 = y2;
		this.x2 = x1;
		this.y2 = y1;
	}
	
	// equation of the line Ax + By + C = 0
	this.A = y2 - y1;
	this.B = x1 - x2;
	this.C = x2*y1 - x1*y2;
	this.D = Math.sqrt(this.A*this.A + this.B*this.B); // used in point-line distance
	
	// game aspects
	this.passable = {}; // what types this wall has no collisions with
}
Wall.prototype = new GameObject();