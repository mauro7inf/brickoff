levelScreen.gradients1 = function (f) {
	gameCtx.lineWidth = 2;

	// width of border between game wall and canvas wall
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;

	// stroke gradient
	var gStroke = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gStroke.addColorStop(0,'rgba(128,0,0,' + f + ')');
	gStroke.addColorStop(0.5,'rgba(128,0,0,' + f + ')');
	gStroke.addColorStop(1,'rgba(128,0,0,' + f + ')');
	// fill gradient
	var gFill = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gFill.addColorStop(0,'rgba(144,0,0,' + f*0.5 + ')');
	gFill.addColorStop(0.5,'rgba(0,0,0,' + f*0.5 + ')');
	gFill.addColorStop(1,'rgba(144,0,0,' + f*0.5 + ')');
	return {
		stroke: gStroke,
		fill: gFill
	}
};

levelScreen.gradients2 = function (f) {
	gameCtx.lineWidth = 2;

	// width of border between game wall and canvas wall
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;

	// stroke gradient
	var gStroke = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gStroke.addColorStop(0,'rgba(140,32,32,' + f + ')');
	gStroke.addColorStop(0.5, 'rgba(172,172,64,' + f + ')');
	gStroke.addColorStop(1,'rgba(32,140,32,' + f + ')');
	// fill gradient
	var gFill = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gFill.addColorStop(0,'rgba(140,32,32,' + f*0.5 + ')');
	gFill.addColorStop(0.5, 'rgba(172,172,64,' + f*0.5 + ')');
	gFill.addColorStop(1,'rgba(32,140,32,' + f*0.5 + ')');
	return {
		stroke: gStroke,
		fill: gFill
	}
};

levelScreen.gradients3 = function (f) {
	gameCtx.lineWidth = 2;

	// width of border between game wall and canvas wall
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;

	var centerLine = 0.5*(gameCanvas.height + tb - bb) + this.centerLineOffset;
	var centerLineRatio = (centerLine - (tb - 0.5))/(gameCanvas.height - bb - tb);

	// stroke gradient
	var gStroke = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gStroke.addColorStop(0,'rgba(255,255,0,' + f + ')');
	gStroke.addColorStop(centerLineRatio, 'rgba(192,192,176,' + f + ')');
	gStroke.addColorStop(1,'rgba(255,255,0,' + f + ')');
	// fill gradient
	var gFill = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gFill.addColorStop(0,'rgba(255,255,0,' + f*0.5 + ')');
	gFill.addColorStop(centerLineRatio, 'rgba(192,192,176,' + f*0.5 + ')');
	gFill.addColorStop(1,'rgba(255,255,0,' + f*0.5 + ')');
	return {
		stroke: gStroke,
		fill: gFill
	}
};

levelScreen.gradients4 = function (f) {
	gameCtx.lineWidth = 2;

	// width of border between game wall and canvas wall
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;

	// stroke gradient
	var gStroke = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gStroke.addColorStop(0,'rgba(255,255,64,' + f + ')');
	gStroke.addColorStop(0.5, 'rgba(160,255,64,' + f + ')');
	gStroke.addColorStop(1,'rgba(64,255,160,' + f + ')');
	// fill gradient
	var gFill = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gFill.addColorStop(0,'rgba(255,255,64,' + f*0.5 + ')');
	gFill.addColorStop(0.5, 'rgba(160,255,64,' + f*0.5 + ')');
	gFill.addColorStop(1,'rgba(64,255,160,' + f*0.5 + ')');
	return {
		stroke: gStroke,
		fill: gFill
	}
};

levelScreen.gradients5 = function (f) {
	gameCtx.lineWidth = 2;

	// width of border between game wall and canvas wall
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;

	var centerLine = 0.5*(gameCanvas.height + tb - bb) + this.centerLineOffset;
	var centerLineRatio = (centerLine - (tb - 0.5))/(gameCanvas.height - bb - tb);

	// stroke gradient
	var gStroke = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gStroke.addColorStop(0,'rgba(0,96,0,' + f + ')');
	gStroke.addColorStop(centerLineRatio, 'rgba(0,127,0,' + f + ')');
	gStroke.addColorStop(1,'rgba(0,48,0,' + f + ')');
	// fill gradient
	var gFill = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gFill.addColorStop(0,'rgba(8,64,8,' + f*0.5 + ')');
	gFill.addColorStop(centerLineRatio, 'rgba(16,96,16,' + f*0.5 + ')');
	gFill.addColorStop(1,'rgba(8,32,8,' + f*0.5 + ')');
	return {
		stroke: gStroke,
		fill: gFill
	}
};

levelScreen.gradients6 = function (f) {
	gameCtx.lineWidth = 2;

	// width of border between game wall and canvas wall
	var tb = this.tb - gameCtx.lineWidth/2.0;
	var bb = this.bb - gameCtx.lineWidth/2.0;
	var lb = this.lb - gameCtx.lineWidth/2.0;
	var rb = this.rb - gameCtx.lineWidth/2.0;

	var centerLine = 0.5*(gameCanvas.height + tb - bb) + this.centerLineOffset;
	var centerLineRatio = (centerLine - (tb - 0.5))/(gameCanvas.height - bb - tb);

	// stroke gradient
	var gStroke = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gStroke.addColorStop(0,'rgba(64,160,255,' + f + ')');
	gStroke.addColorStop(centerLineRatio, 'rgba(255,160,255,' + f + ')');
	gStroke.addColorStop(1,'rgba(64,255,160,' + f + ')');
	// fill gradient
	var gFill = gameCtx.createLinearGradient(0.5*(gameCanvas.width + this.lb - this.rb), tb - 0.5,
		0.5*(gameCanvas.width + this.lb - this.rb), gameCanvas.height - (bb - 0.5));
	gFill.addColorStop(0,'rgba(64,255,160,' + f*0.5 + ')');
	gFill.addColorStop(0.5/19,'rgba(64,255,160,' + f*0.5 + ')');
	gFill.addColorStop(1.5/19,'rgba(160,160,160,' + f*0.5 + ')');
	gFill.addColorStop(2.5/19,'rgba(160,160,160,' + f*0.5 + ')');
	gFill.addColorStop(3.5/19,'rgba(0,160,255,' + f*0.5 + ')');
	gFill.addColorStop(4/19,'rgba(0,160,255,' + f + ')');
	gFill.addColorStop(4.5/19,'rgba(0,160,255,' + f*0.5 + ')');
	gFill.addColorStop(5.5/19,'rgba(160,160,160,' + f*0.5 + ')');
	gFill.addColorStop(6.5/19,'rgba(160,160,160,' + f*0.5 + ')');
	gFill.addColorStop(7.5/19,'rgba(64,255,160,' + f*0.5 + ')');
	gFill.addColorStop(8.5/19,'rgba(64,255,160,' + f*0.5 + ')');
	gFill.addColorStop(9.5/19,'rgba(255,160,255,' + f + ')');
	gFill.addColorStop(10.5/19,'rgba(64,255,160,' + f*0.5 + ')');
	gFill.addColorStop(11.5/19,'rgba(64,255,160,' + f*0.5 + ')');
	gFill.addColorStop(12.5/19,'rgba(160,160,160,' + f*0.5 + ')');
	gFill.addColorStop(13.5/19,'rgba(160,160,160,' + f*0.5 + ')');
	gFill.addColorStop(14.5/19,'rgba(0,160,255,' + f*0.5 + ')');
	gFill.addColorStop(15/19,'rgba(0,160,255,' + f + ')');
	gFill.addColorStop(15.5/19,'rgba(0,160,255,' + f*0.5 + ')');
	gFill.addColorStop(16.5/19,'rgba(160,160,160,' + f*0.5 + ')');
	gFill.addColorStop(17.5/19,'rgba(160,160,160,' + f*0.5 + ')');
	gFill.addColorStop(18.5/19,'rgba(64,255,160,' + f*0.5 + ')');
	gFill.addColorStop(1,'rgba(64,255,160,' + f*0.5 + ')');
	return {
		stroke: gStroke,
		fill: gFill
	}
}