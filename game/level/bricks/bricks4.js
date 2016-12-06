levelScreen.initBricks4 = function () {
	var self = this;
	var gs = 698/28.0; // grid size
	var bs = 2*Math.sqrt(2); // brick spacing; it's actually twice this, but this is the distance from the grid lines
	var ls = 2; // linear brick spacing

	function createPolygonBrick(vertices) {
		var correctedVertices = [];
		var nv = vertices.length;
		for (var i = 0; i < nv; i++) {
			var prevVector = {
				x: vertices[(i + nv - 1) % nv].x - vertices[i].x,
				y: vertices[(i + nv - 1) % nv].y - vertices[i].y
			};
			var dpv = distance(0, 0, prevVector.x, prevVector.y);
			var nextVector = {
				x: vertices[(i + 1) % nv].x - vertices[i].x,
				y: vertices[(i + 1) % nv].y - vertices[i].y
			};
			var dnv = distance(0, 0, nextVector.x, nextVector.y);
			var resVector = {
				x: prevVector.x/dpv + nextVector.x/dnv,
				y: prevVector.y/dpv + nextVector.y/dnv
			};
			var drv = distance(0, 0, resVector.x, resVector.y); // this will cause an error if three consecutive vertices are collinear
			var u = {
				x: resVector.x/drv,
				y: resVector.y/drv
			};
			var correctedVertex = {
				x: vertices[i].x*gs + self.lb + 1,
				y: vertices[i].y*gs + self.tb + 1
			};
			var scalingFactor = dpv/(u.x*prevVector.y - u.y*prevVector.x);
			correctedVertex.x += u.x*ls*scalingFactor;
			correctedVertex.y += u.y*ls*scalingFactor;
			correctedVertices.push(correctedVertex);
		}
		var brick = new PolygonBrick(correctedVertices, 6000);
		var c = randomColor();
		while (c.g < 156 || c.r < 64 || (c.r < 200 && c.g < 200 && c.b < 200) || c.r + c.g + c.b > 600) c = randomColor();
		brick.fillR = Math.floor(c.r/2.0);
		brick.fillG = Math.floor(c.g/2.0);
		brick.fillB = Math.floor(c.b/2.0);
		brick.strokeR = 2*brick.fillR;
		brick.strokeG = 2*brick.fillG;
		brick.strokeB = 2*brick.fillB;
		var brickNotes = Math.floor(Math.random()*6.0);
		if (brickNotes == 0) {
			brick.frequency1 = 24*C1;
			brick.frequency2 = 30*C1;
		} else if (brickNotes == 1) {
			brick.frequency1 = 28*C1;
			brick.frequency2 = 36*C1;
		} else if (brickNotes == 2) {
			brick.frequency1 = 32*C1;
			brick.frequency2 = 40*C1;
		} else if (brickNotes == 3) {
			brick.frequency1 = 36*C1;
			brick.frequency2 = 44*C1;
		} else if (brickNotes == 4) {
			brick.frequency1 = 40*C1;
			brick.frequency2 = 48*C1;
		} else if (brickNotes == 5) {
			brick.frequency1 = 44*C1;
			brick.frequency2 = 56*C1;
		}
		brick.frequency3 = 16*C1;
		self.bricks.push(brick);
	}

	// e is ignored; it has been worked around

	// 1
	createPolygonBrick([
		{x: 0, y: 12, e: 'leave'},
		{x: 0, y: 10, e: 'd'},
		{x: 2, y: 11},
		{x: 3, y: 12, e: 'l'}
	]);

	// 2
	createPolygonBrick([
		{x: 0, y: 10, e: 'u'},
		{x: 0, y: 9, e: 'd'},
		{x: 1, y: 8},
		{x: 2, y: 11}
	]);

	// 3
	createPolygonBrick([
		{x: 0, y: 9, e: 'u'},
		{x: 0, y: 6, e: 'd'},
		{x: 1, y: 7},
		{x: 1, y: 8}
	]);

	// 4
	createPolygonBrick([
		{x: 0, y: 6, e: 'u'},
		{x: 0, y: 4, e: 'leave'},
		{x: 2, y: 2, e: 'dl'},
		{x: 2, y: 4},
		{x: 1, y: 7}
	]);

	// 5
	createPolygonBrick([
		{x: 2, y: 4},
		{x: 2, y: 2, e: 'ur'},
		{x: 3, y: 1, e: 'dl'},
		{x: 4, y: 2},
		{x: 4, y: 3}
	]);

	// 6
	createPolygonBrick([
		{x: 4, y: 2},
		{x: 3, y: 1, e: 'ur'},
		{x: 4, y: 0, e: 'leave'},
		{x: 7, y: 0, e: 'l'},
		{x: 6, y: 1}
	]);

	// 7
	createPolygonBrick([
		{x: 3, y: 12, e: 'r'},
		{x: 2, y: 11},
		{x: 4, y: 10},
		{x: 4, y: 12, e: 'l'}
	]);

	// 8
	createPolygonBrick([
		{x: 2, y: 11},
		{x: 1, y: 8},
		{x: 2, y: 8},
		{x: 4, y: 10}
	]);

	// 9
	createPolygonBrick([
		{x: 1, y: 8},
		{x: 1, y: 7},
		{x: 3, y: 6},
		{x: 3, y: 7},
		{x: 2, y: 8}
	]);

	// 10
	createPolygonBrick([
		{x: 1, y: 7},
		{x: 2, y: 4},
		{x: 3, y: 6}
	]);

	// 11
	createPolygonBrick([
		{x: 3, y: 6},
		{x: 2, y: 4},
		{x: 4, y: 3},
		{x: 5, y: 3},
		{x: 4, y: 5}
	]);

	// 12
	createPolygonBrick([
		{x: 4, y: 3},
		{x: 4, y: 2},
		{x: 6, y: 1},
		{x: 6, y: 3}
	]);

	// 13
	createPolygonBrick([
		{x: 4, y: 10},
		{x: 2, y: 8},
		{x: 3, y: 7},
		{x: 4, y: 9}
	]);

	// 14
	createPolygonBrick([
		{x: 4, y: 9},
		{x: 3, y: 7},
		{x: 3, y: 6},
		{x: 4, y: 5},
		{x: 5, y: 6}
	]);

	// 15
	createPolygonBrick([
		{x: 5, y: 6},
		{x: 4, y: 5},
		{x: 5, y: 3},
		{x: 6, y: 5}
	]);

	// 16
	createPolygonBrick([
		{x: 6, y: 5},
		{x: 5, y: 3},
		{x: 7, y: 3},
		{x: 7, y: 4}
	]);

	// 17
	createPolygonBrick([
		{x: 6, y: 3},
		{x: 6, y: 1},
		{x: 8, y: 2},
		{x: 7, y: 3}
	]);

	// 18
	createPolygonBrick([
		{x: 6, y: 1},
		{x: 7, y: 0, e: 'r'},
		{x: 9, y: 0, e: 'l'},
		{x: 9, y: 1},
		{x: 8, y: 2}
	]);

	// 19
	createPolygonBrick([
		{x: 7, y: 4},
		{x: 7, y: 3},
		{x: 9, y: 1},
		{x: 10, y: 2}
	]);

	// 20
	createPolygonBrick([
		{x: 9, y: 1},
		{x: 9, y: 0, e: 'r'},
		{x: 11, y: 0, e: 'l'},
		{x: 10, y: 2}
	]);

	// 21
	createPolygonBrick([
		{x: 10, y: 2},
		{x: 11, y: 0},
		{x: 13, y: 1}
	]);

	// 22
	createPolygonBrick([
		{x: 13, y: 1},
		{x: 11, y: 0, e: 'r'},
		{x: 15, y: 0, e: 'l'},
		{x: 14, y: 1}
	]);

	// 23
	createPolygonBrick([
		{x: 14, y: 1},
		{x: 15, y: 0, e: 'r'},
		{x: 17, y: 0, e: 'l'},
		{x: 16, y: 1}
	]);

	// 24
	createPolygonBrick([
		{x: 16, y: 1},
		{x: 17, y: 0, e: 'r'},
		{x: 19, y: 0, e: 'l'},
		{x: 18, y: 2}
	]);

	// 25
	createPolygonBrick([
		{x: 18, y: 2},
		{x: 19, y: 0},
		{x: 19, y: 2}
	]);

	// 26
	createPolygonBrick([
		{x: 19, y: 2},
		{x: 19, y: 0, e: 'r'},
		{x: 20, y: 0, e: 'l'},
		{x: 21, y: 3}
	]);

	// 27
	createPolygonBrick([
		{x: 21, y: 3},
		{x: 20, y: 0, e: 'r'},
		{x: 21, y: 0, e: 'l'},
		{x: 22, y: 1}
	]);

	// 28
	createPolygonBrick([
		{x: 22, y: 1},
		{x: 21, y: 0, e: 'r'},
		{x: 24, y: 0, e: 'leave'},
		{x: 25, y: 1, e: 'ul'},
		{x: 24, y: 2}
	]);

	// 29
	createPolygonBrick([
		{x: 20, y: 4},
		{x: 18, y: 2},
		{x: 19, y: 2},
		{x: 21, y: 3}
	]);

	// 30
	createPolygonBrick([
		{x: 21, y: 6},
		{x: 20, y: 4},
		{x: 21, y: 3},
		{x: 22, y: 4},
		{x: 22, y: 5}
	]);

	// 31
	createPolygonBrick([
		{x: 21, y: 7},
		{x: 21, y: 6},
		{x: 22, y: 5},
		{x: 23, y: 6},
		{x: 23, y: 7}
	]);

	// 32
	createPolygonBrick([
		{x: 20, y: 9},
		{x: 21, y: 7},
		{x: 23, y: 7},
		{x: 22, y: 9},
		{x: 21, y: 10}
	]);

	// 33
	createPolygonBrick([
		{x: 21, y: 12},
		{x: 19, y: 11},
		{x: 18, y: 10},
		{x: 20, y: 9},
		{x: 21, y: 10}
	]);

	// 34
	createPolygonBrick([
		{x: 18, y: 12, e: 'r'},
		{x: 19, y: 11},
		{x: 21, y: 12, e: 'l'}
	]);

	// 35
	createPolygonBrick([
		{x: 17, y: 12, e: 'r'},
		{x: 18, y: 10},
		{x: 19, y: 11},
		{x: 18, y: 12, e: 'l'}
	]);

	// 36
	createPolygonBrick([
		{x: 17, y: 12},
		{x: 15, y: 11},
		{x: 18, y: 10}
	]);

	// 37
	createPolygonBrick([
		{x: 13, y: 12, e: 'r'},
		{x: 14, y: 11},
		{x: 15, y: 11},
		{x: 17, y: 12, e: 'l'}
	]);

	// 38
	createPolygonBrick([
		{x: 13, y: 12},
		{x: 12, y: 10},
		{x: 12, y: 9},
		{x: 14, y: 11}
	]);

	// 39
	createPolygonBrick([
		{x: 12, y: 10},
		{x: 11, y: 8},
		{x: 12, y: 8}
	]);

	// 40
	createPolygonBrick([
		{x: 11, y: 8},
		{x: 10, y: 7},
		{x: 12, y: 6},
		{x: 13, y: 6},
		{x: 12, y: 8}
	]);

	// 41
	createPolygonBrick([
		{x: 12, y: 6},
		{x: 13, y: 4},
		{x: 15, y: 4},
		{x: 15, y: 5},
		{x: 13, y: 6}
	]);

	// 42
	createPolygonBrick([
		{x: 15, y: 5},
		{x: 15, y: 4},
		{x: 18, y: 6},
		{x: 17, y: 6}
	]);

	// 43
	createPolygonBrick([
		{x: 16, y: 7},
		{x: 15, y: 5},
		{x: 17, y: 6}
	]);

	// 44
	createPolygonBrick([
		{x: 17, y: 8},
		{x: 16, y: 7},
		{x: 17, y: 6},
		{x: 18, y: 6}
	]);

	// 45
	createPolygonBrick([
		{x: 15, y: 9},
		{x: 16, y: 7},
		{x: 17, y: 8}
	]);

	// 46
	createPolygonBrick([
		{x: 11, y: 12, e: 'r'},
		{x: 11, y: 11},
		{x: 12, y: 10},
		{x: 13, y: 12, e: 'l'}
	]);

	// 47
	createPolygonBrick([
		{x: 11, y: 11},
		{x: 11, y: 10},
		{x: 12, y: 10}
	]);

	// 48
	createPolygonBrick([
		{x: 11, y: 10},
		{x: 9, y: 9},
		{x: 11, y: 8},
		{x: 12, y: 10}
	]);

	// 49
	createPolygonBrick([
		{x: 9, y: 9},
		{x: 8, y: 8},
		{x: 9, y: 7},
		{x: 10, y: 7},
		{x: 11, y: 8}
	]);

	// 50
	createPolygonBrick([
		{x: 9, y: 7},
		{x: 10, y: 6},
		{x: 13, y: 4},
		{x: 12, y: 6},
		{x: 10, y: 7}
	]);

	// 51
	createPolygonBrick([
		{x: 11, y: 12},
		{x: 10, y: 11},
		{x: 11, y: 10}
	]);

	// 52
	createPolygonBrick([
		{x: 10, y: 11},
		{x: 9, y: 10},
		{x: 9, y: 9},
		{x: 11, y: 10}
	]);

	// 53
	createPolygonBrick([
		{x: 8, y: 12, e: 'r'},
		{x: 8, y: 11},
		{x: 9, y: 10},
		{x: 11, y: 12, e: 'l'}
	]);

	// 54
	createPolygonBrick([
		{x: 8, y: 11},
		{x: 7, y: 10},
		{x: 8, y: 8},
		{x: 9, y: 9},
		{x: 9, y: 10}
	]);

	// 55
	createPolygonBrick([
		{x: 8, y: 12, e: 'l'},
		{x: 7, y: 10},
		{x: 8, y: 11}
	]);

	// 56
	createPolygonBrick([
		{x: 21, y: 12, e: 'r'},
		{x: 21, y: 11},
		{x: 23, y: 10},
		{x: 24, y: 12, e: 'l'}
	]);

	// 57
	createPolygonBrick([
		{x: 21, y: 11},
		{x: 21, y: 10},
		{x: 22, y: 9},
		{x: 23, y: 10}
	]);

	// 58
	createPolygonBrick([
		{x: 23, y: 10},
		{x: 22, y: 9},
		{x: 23, y: 7},
		{x: 25, y: 8},
		{x: 25, y: 9},
		{x: 24, y: 10}
	]);

	// 59
	createPolygonBrick([
		{x: 23, y: 7},
		{x: 23, y: 6},
		{x: 25, y: 5},
		{x: 27, y: 6},
		{x: 25, y: 8}
	]);

	// 60
	createPolygonBrick([
		{x: 23, y: 6},
		{x: 22, y: 5},
		{x: 22, y: 4},
		{x: 24, y: 3},
		{x: 25, y: 5}
	]);

	// 61
	createPolygonBrick([
		{x: 22, y: 4},
		{x: 21, y: 3},
		{x: 22, y: 1},
		{x: 24, y: 2},
		{x: 24, y: 3}
	]);

	// 62
	createPolygonBrick([
		{x: 24, y: 12, e: 'r'},
		{x: 23, y: 10},
		{x: 24, y: 10},
		{x: 25, y: 11},
		{x: 25, y: 12, e: 'l'}
	]);

	// 63
	createPolygonBrick([
		{x: 25, y: 11},
		{x: 24, y: 10},
		{x: 25, y: 9},
		{x: 26, y: 11}
	]);

	// 64
	createPolygonBrick([
		{x: 26, y: 11},
		{x: 25, y: 9},
		{x: 25, y: 8},
		{x: 26, y: 7},
		{x: 27, y: 8},
		{x: 27, y: 9}
	]);

	// 65
	createPolygonBrick([
		{x: 27, y: 8},
		{x: 26, y: 7},
		{x: 28, y: 5, e: 'd'},
		{x: 28, y: 7, e: 'u'}
	]);

	// 66
	createPolygonBrick([
		{x: 27, y: 6},
		{x: 25, y: 5},
		{x: 28, y: 5}
	]);

	// 67
	createPolygonBrick([
		{x: 25, y: 5},
		{x: 24, y: 3},
		{x: 26, y: 4},
		{x: 27, y: 5}
	]);

	// 68
	createPolygonBrick([
		{x: 27, y: 5},
		{x: 26, y: 4},
		{x: 26, y: 2, e: 'dr'},
		{x: 28, y: 4, e: 'leave'},
		{x: 28, y: 5, e: 'u'}
	]);

	// 69
	createPolygonBrick([
		{x: 24, y: 3},
		{x: 24, y: 2},
		{x: 25, y: 1, e: 'dr'},
		{x: 26, y: 2, e: 'ul'},
		{x: 26, y: 4}
	]);

	// 70
	createPolygonBrick([
		{x: 25, y: 12, e: 'r'},
		{x: 25, y: 11},
		{x: 26, y: 11},
		{x: 27, y: 12, e: 'l'}
	]);

	// 71
	createPolygonBrick([
		{x: 27, y: 12, e: 'r'},
		{x: 26, y: 11},
		{x: 27, y: 9},
		{x: 28, y: 10, e: 'd'},
		{x: 28, y: 12, e: 'leave'}
	]);

	// 72
	createPolygonBrick([
		{x: 28, y: 10, e: 'u'},
		{x: 27, y: 9},
		{x: 27, y: 8},
		{x: 28, y: 7, e: 'd'}
	]);
};