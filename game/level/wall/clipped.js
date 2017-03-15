levelScreen.drawGameWallClipped = function (gStroke, gFill) {
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
	var r = this.cornerRadius - gameCtx.lineWidth/2.0; // not actually a radius, but it fulfills the same purpose

	// goal dimensions
	var bottomEdge = gameCanvas.height - edgeWidth;
	var hMiddle = 0.5*(gameCanvas.width + lb - rb);
	var goalWidth = this.goalWidth;
	var goalLeft = hMiddle - 0.5*goalWidth; // where left edge of goal starts on bottom wall
	var goalRight = hMiddle + 0.5*goalWidth;
	var rg = this.goalRadius - gameCtx.lineWidth/2.0; // radius of circle; note that the wall is the outer edge of the line
	var b = bb - edgeWidth; // actual width of bottom buffer

	var goalBottom = bottomEdge; // bottom y of goal lines
	var goalLeftEdge = goalLeft + rg; // x of inner edge on left corner of goal; left edge is at (goalLeftEdge, goalBottom)
	var goalRightEdge = goalRight - rg;
	if (rg > b) {
		goalLeftEdge = goalLeft + b;
		goalRightEdge = goalRight - b;
	} else if (rg < b) {
		goalBottom = bottom + rg;
	}

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

	// start with bottom left, from the goal, and go around the board to the other side of the goal
	gameCtx.beginPath();
	gameCtx.moveTo(goalLeftEdge, bottomEdge);
	if (rg < b) gameCtx.lineTo(goalLeftEdge, goalBottom);
	gameCtx.lineTo(goalLeft, bottom);
	gameCtx.lineTo(left + r, bottom);
	gameCtx.lineTo(left, bottom - r);
	gameCtx.lineTo(left, top + r);
	gameCtx.lineTo(left + r, top);
	gameCtx.lineTo(right - r, top);
	gameCtx.lineTo(right, top + r);
	gameCtx.lineTo(right, bottom - r);
	gameCtx.lineTo(right - r, bottom);
	gameCtx.lineTo(goalRight, bottom);
	gameCtx.lineTo(goalRightEdge, goalBottom);
	if (rg < b) gameCtx.lineTo(goalRightEdge, bottomEdge);
	gameCtx.stroke();

	// outer edge
	gameCtx.lineTo(gameCanvas.width - edgeWidth, bottomEdge);
	gameCtx.lineTo(gameCanvas.width - edgeWidth, edgeWidth);
	gameCtx.lineTo(edgeWidth, edgeWidth);
	gameCtx.lineTo(edgeWidth, gameCanvas.height - edgeWidth);
	gameCtx.lineTo(goalLeftEdge, bottomEdge);
	gameCtx.fill();
};

levelScreen.clipGameWallClipped = function () {
	// width of outside game wall border
	var edgeWidth = this.edgeWidth;
	var lineOverlap = 1.0; // don't clip exactly on the line to prevent bad anti-aliasing

	// width of border between game wall and canvas wall
	var tb = this.tb - lineOverlap;
	var bb = this.bb - lineOverlap;
	var lb = this.lb - lineOverlap;
	var rb = this.rb - lineOverlap;

	// wall dimensions
	var top = tb;
	var bottom = gameCanvas.height - bb;
	var left = lb;
	var right = gameCanvas.width - rb;
	var r = this.cornerRadius - lineOverlap; // not actually a radius, but it fulfills the same purpose

	// goal dimensions
	var bottomEdge = gameCanvas.height - edgeWidth;
	var hMiddle = 0.5*(gameCanvas.width + lb - rb);
	var goalWidth = this.goalWidth;
	var goalLeft = hMiddle - 0.5*goalWidth; // where left edge of goal starts on bottom wall
	var goalRight = hMiddle + 0.5*goalWidth;
	var rg = this.goalRadius - lineOverlap; // radius of circle; note that the wall is the outer edge of the line
	var b = bb - edgeWidth; // actual width of bottom buffer

	var goalBottom = bottomEdge; // bottom y of goal lines
	var goalLeftEdge = goalLeft + rg; // x of inner edge on left corner of goal; left edge is at (goalLeftEdge, goalBottom)
	var goalRightEdge = goalRight - rg;
	if (rg > b) {
		goalLeftEdge = goalLeft + b;
		goalRightEdge = goalRight - b;
	} else if (rg < b) {
		goalBottom = bottom + rg;
	}

	// start with bottom left, from the goal, and go around the board to the other side of the goal
	gameCtx.beginPath();
	gameCtx.moveTo(goalLeftEdge, bottomEdge);
	if (rg < b) gameCtx.lineTo(goalLeftEdge, goalBottom);
	gameCtx.lineTo(goalLeft, bottom);
	gameCtx.lineTo(left + r, bottom);
	gameCtx.lineTo(left, bottom - r);
	gameCtx.lineTo(left, top + r);
	gameCtx.lineTo(left + r, top);
	gameCtx.lineTo(right - r, top);
	gameCtx.lineTo(right, top + r);
	gameCtx.lineTo(right, bottom - r);
	gameCtx.lineTo(right - r, bottom);
	gameCtx.lineTo(goalRight, bottom);
	gameCtx.lineTo(goalRightEdge, goalBottom);
	if (rg < b) gameCtx.lineTo(goalRightEdge, bottomEdge);
	gameCtx.clip();
};

levelScreen.initWallsClipped = function () {
	// build up walls
	var goalLeft = (gameCanvas.width + this.lb - this.rb - this.goalWidth)*0.5;
	var goalRight = (gameCanvas.width + this.lb - this.rb + this.goalWidth)*0.5;

	// create wall objects for collisions
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
	// clipped corners
	var wallTL = new Wall(this.lb, this.tb + this.cornerRadius, this.lb + this.cornerRadius, this.tb);
	var wallTR = new Wall(gameCanvas.width - this.rb, this.tb + this.cornerRadius, gameCanvas.width - this.rb - this.cornerRadius, this.tb);
	var wallBL = new Wall(this.lb, gameCanvas.height - this.bb - this.cornerRadius, this.lb + this.cornerRadius, gameCanvas.height - this.bb);
	var wallBR = new Wall(gameCanvas.width - this.rb, gameCanvas.height - this.bb - this.cornerRadius, gameCanvas.width - this.rb - this.cornerRadius, gameCanvas.height - this.bb);

	// goal walls
	var rEff = this.goalRadius;
	if (this.goalRadius > this.bb) rEff = this.bb;
	var wallGL = new Wall(goalLeft, gameCanvas.height - this.bb, goalLeft + rEff, gameCanvas.height - this.bb + rEff);
	wallGL.open = false; // collisions on the corners
	var wallGR = new Wall(goalRight, gameCanvas.height - this.bb, goalRight - rEff, gameCanvas.height - this.bb + rEff);
	wallGL.open = false;
	var wallHL = new Wall(goalLeft + rEff, gameCanvas.height - this.bb + rEff, goalLeft + rEff, gameCanvas.height + 500);
	var wallHR = new Wall(goalRight - rEff, gameCanvas.height - this.bb + rEff, goalRight - rEff, gameCanvas.height + 500);
	var pointGL = new PointWall(goalLeft, gameCanvas.height - this.bb);
	var pointGR = new PointWall(goalRight, gameCanvas.height - this.bb);
	var pointHL = new PointWall(goalLeft + rEff, gameCanvas.height - this.bb + rEff);
	var pointHR = new PointWall(goalRight - rEff, gameCanvas.height - this.bb + rEff);

	// add walls to list for collisions
	this.walls = [pointGL, pointGR, pointHL, pointHR, wallL, wallR, wallT, wallLB, wallRB, wallS, wallG, wallTL, wallTR, wallBR, wallBL, wallGL, wallGR, wallHL, wallHR];
	for (var w = 0; w < this.walls.length; w++) {
		if (this.walls[w].type !== 'PointWall') this.walls[w].open = true;
	}
};