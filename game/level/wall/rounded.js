levelScreen.drawGameWallRounded = function (gStroke, gFill) {
	// width of outside game wall border
	var edgeWidth = this.edgeWidth;
	gameCtx.lineWidth = 2.0;
	gameCtx.strokeStyle = gStroke;
	gameCtx.fillStyle = gFill;

	// width of border between game wall and canvas wall
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;

	// wall dimensions
	var vMiddle = 0.5*(gameCanvas.height + tb - bb);
	var centerLine = vMiddle + this.centerLineOffset;
	var top = tb;
	var bottom = gameCanvas.height - bb;
	var left = lb;
	var right = gameCanvas.width - rb;
	var r = this.cornerRadius - gameCtx.lineWidth/2.0;

	// goal dimensions
	var bottomEdge = gameCanvas.height - edgeWidth;
	var hMiddle = 0.5*(gameCanvas.width + lb - rb);
	var goalWidth = this.goalWidth;
	var goalLeft = hMiddle - 0.5*goalWidth; // where left edge of goal starts on bottom wall
	var goalRight = hMiddle + 0.5*goalWidth;
	var rg = this.goalRadius - gameCtx.lineWidth/2.0; // radius of circle; note that the wall is the outer edge of the line
	var b = bb - edgeWidth; // actual width of bottom buffer

	var goalBottom = bottomEdge; // bottom y of goal circles
	var goalLeftEdge = goalLeft + rg; // x of inner edge on left corner of goal; left edge is at (goalLeftEdge, goalBottom)
	var goalRightEdge = goalRight - rg;
	var theta = 0;
	if (rg > b) { // quarter circle is incomplete
		var Rcos = Math.sqrt(2*b*rg - b*b);
		goalLeftEdge = goalLeft + Rcos;
		goalRightEdge = goalRight - Rcos;
		theta = Math.acos(Rcos/rg);
	} else if (rg < b) { // quarter circle is complete and there's still some goal left to make using straight lines
		goalBottom = bottom + rg;
	}
	var goalCenter = bottom + rg; // y of center of goal circles

	// middle line
	gameCtx.beginPath();
	gameCtx.moveTo(left, centerLine);
	gameCtx.lineTo(right, centerLine);
	gameCtx.stroke();

	// bottom line
	gameCtx.beginPath();
	gameCtx.moveTo(goalLeft, bottom);
	gameCtx.lineTo(goalRight, bottom);
	gameCtx.stroke();

	// note that y is flipped from standard math, so pi/2, usually the +y axis, is actually *down*, not up
	// start with bottom left, from the goal, and go around the board to the other side of the goal
	gameCtx.beginPath();
	gameCtx.moveTo(goalLeftEdge, bottomEdge);
	if (rg < b) gameCtx.lineTo(goalLeftEdge, goalBottom);
	gameCtx.arc(goalLeft, goalCenter, rg, 2*Math.PI - theta, 1.5*Math.PI, true);
	gameCtx.lineTo(left + r, bottom);
	gameCtx.arc(left + r, bottom - r, r, 0.5*Math.PI, Math.PI, false);
	gameCtx.lineTo(left, top + r);
	gameCtx.arc(left + r, top + r, r, Math.PI, 1.5*Math.PI, false);
	gameCtx.lineTo(right - r, top);
	gameCtx.arc(right - r, top + r, r, 1.5*Math.PI, 0, false);
	gameCtx.lineTo(right, bottom - r);
	gameCtx.arc(right - r, bottom - r, r, 0, 0.5*Math.PI, false);
	gameCtx.lineTo(goalRight, bottom);
	gameCtx.arc(goalRight, goalCenter, rg, 1.5*Math.PI, Math.PI + theta, true);
	if (rg < b) gameCtx.lineTo(goalRightEdge, bottomEdge);
	gameCtx.stroke();

	// outer edge
	gameCtx.lineTo(gameCanvas.width - edgeWidth, bottomEdge);
	gameCtx.lineTo(gameCanvas.width - edgeWidth, edgeWidth);
	gameCtx.lineTo(edgeWidth, edgeWidth);
	gameCtx.lineTo(edgeWidth, gameCanvas.height - edgeWidth);
	gameCtx.lineTo(goalLeftEdge, bottomEdge);
	gameCtx.fill();
}

levelScreen.initWallsRounded = function () {
	// build up walls
	var goalLeft = (gameCanvas.width + this.lb - this.rb - this.goalWidth)*0.5;
	var goalRight = (gameCanvas.width + this.lb - this.rb + this.goalWidth)*0.5;

	// create wall objects for collisions
	// walls actually extend into the rounded corners
	// left wall
	var wallL = new Wall(this.lb, this.tb, this.lb, gameCanvas.height - this.bb);
	// right wall
	var wallR = new Wall(gameCanvas.width - this.rb, this.tb, gameCanvas.width - this.rb, gameCanvas.height - this.bb);
	// top wall
	var wallT = new Wall(this.lb, this.tb, gameCanvas.width - this.rb, this.tb);
	// bottom wall left of the goal
	var wallLB = new Wall(this.lb, gameCanvas.height - this.bb, goalLeft, gameCanvas.height - this.bb);
	// bottom wall right of the goal
	var wallRB = new Wall(goalRight, gameCanvas.height - this.bb, gameCanvas.width - this.rb, gameCanvas.height - this.bb);
	// goal line (ball can pass, paddle cannot)
	var wallG = new Wall(goalLeft, gameCanvas.height - this.bb, goalRight, gameCanvas.height - this.bb);
	wallG.passable = {CueBall: true};
	// middle line (ball can pass, paddle cannot)
	var wallS = new Wall(this.lb, 0.5*(gameCanvas.height + this.tb - this.bb) + this.centerLineOffset,
		gameCanvas.width - this.rb, 0.5*(gameCanvas.height + this.tb - this.bb) + this.centerLineOffset);
	wallS.passable = {CueBall: true};
	// circular corners
	// top left corner
	var wallTL = new ArcWall(this.lb + this.cornerRadius, this.tb + this.cornerRadius, this.cornerRadius,
		1.5*Math.PI, Math.PI, true);
	// top right corner
	var wallTR = new ArcWall(gameCanvas.width - this.rb - this.cornerRadius, this.tb + this.cornerRadius, this.cornerRadius,
		0, 1.5*Math.PI, true);
	// bottom right corner
	var wallBR = new ArcWall(gameCanvas.width - this.rb - this.cornerRadius, gameCanvas.height - this.bb - this.cornerRadius,
		this.cornerRadius, 0.5*Math.PI, 0, true);
	// bottom left corner
	var wallBL = new ArcWall(this.lb + this.cornerRadius, gameCanvas.height - this.bb - this.cornerRadius, this.cornerRadius,
		Math.PI, 0.5*Math.PI, true);
	var wallGL, wallGR, wallHL, wallHR, wallEL, wallER;
	if (this.goalRadius <= this.bb) {
		// left corner of goal
		wallGL = new ArcWall(goalLeft, gameCanvas.height - this.bb + this.goalRadius, this.goalRadius, 0, 1.5*Math.PI, true);
		// right corner of goal
		wallGR = new ArcWall(goalRight, gameCanvas.height - this.bb + this.goalRadius, this.goalRadius, 1.5*Math.PI, Math.PI, true);
		// left and right sides of goal corridor -- out of view but necessary to prevent glitches
		wallHL = new Wall(goalLeft + this.goalRadius, gameCanvas.height - this.bb + this.goalRadius, goalLeft + this.goalRadius, gameCanvas.height + 500);
		wallHR = new Wall(goalRight - this.goalRadius, gameCanvas.height - this.bb + this.goalRadius, goalRight - this.goalRadius, gameCanvas.height + 500);
		wallEL = undefined;
		wallER = undefined;
	} else {
		// the goal circles are too big for the buffer, so they have to be partial circles, but then they have to smoothly connect to the verticals
		var Rcos = Math.sqrt(2*this.bb*this.goalRadius - this.bb*this.bb);
		var rcos = Rcos*this.extraRadius/this.goalRadius;
		var theta = Math.acos(Rcos/this.goalRadius);
		var rsin = this.extraRadius*(this.goalRadius - this.bb)/(this.goalRadius);
		// left corner of goal
		wallGL = new ArcWall(goalLeft, gameCanvas.height - this.bb + this.goalRadius, this.goalRadius, 2*Math.PI - theta, 1.5*Math.PI, true);
		// right corner of goal
		wallGR = new ArcWall(goalRight, gameCanvas.height - this.bb + this.goalRadius, this.goalRadius, 1.5*Math.PI, Math.PI - theta, true);
		// these circles don't go from horizontal to vertical, so we're going to add small circles with this.extraRadius to get there smoothly
		wallEL = new ArcWall(goalLeft + Rcos - rcos, gameCanvas.height + rsin, this.extraRadius, 0, 2*Math.PI - theta, true);
		wallER = new ArcWall(goalRight - Rcos + rcos, gameCanvas.height + rsin, this.extraRadius, Math.PI - theta, Math.PI, true);
		wallHL = new Wall(goalLeft + Rcos - rcos + this.extraRadius, gameCanvas.height + rsin, goalLeft + Rcos - rcos + this.extraRadius, gameCanvas.height + 500);
		wallHR = new Wall(goalRight - Rcos + rcos - this.extraRadius, gameCanvas.height + rsin, goalRight - Rcos + rcos - this.extraRadius, gameCanvas.height + 500);
	}
	// add walls to list for collisions
	this.walls = [wallL, wallR, wallT, wallLB, wallRB, wallS, wallG, wallTL, wallTR, wallBR, wallBL, wallGL, wallGR, wallHL, wallHR];
	if (wallEL !== undefined) this.walls.push(wallEL);
	if (wallER !== undefined) this.walls.push(wallER);
}