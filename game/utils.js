function clearCanvas() { // clears the canvas
	gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawOutline(fillColor, strokeColor) {
	gameCtx.strokeStyle = fillColor;
	gameCtx.lineWidth = 5;
	drawBorder(2.5);
	gameCtx.strokeStyle = strokeColor;
	gameCtx.lineWidth = 1;
	drawBorder(0.5);
	drawBorder(4.5);
}

function drawBorder(offset) { // draws a border at the given offset with current stroke style
	gameCtx.strokeRect(offset, offset, gameCanvas.width - 2*offset, gameCanvas.height - 2*offset);
}

function distance(x1, y1, x2, y2) { // distance between two points
	return Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
}

function rgba(r, g, b, a) { // make RGBA string
	// they need to be integers
	r = Math.floor(r + 0.5);
	g = Math.floor(g + 0.5);
	b = Math.floor(b + 0.5);
	// they also need to be in range
	if (r < 0) r = 0;
	if (r > 255) r = 255;
	if (g < 0) g = 0;
	if (g > 255) g = 255;
	if (b < 0) b = 0;
	if (b > 255) b = 255;
	if (a < 0) a = 0;
	if (a > 1.0) a = 1.0;
	return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

// UNTESTED
function hsla(h, s, l, a) { // make HSLA string
	// h is integer, s and l are integer percentages
	// s, l, and a should be from 0 to 1; h should be from 0 to 360
	h = Math.floor(r + 0.5);
	if (h < 0) h = 0;
	if (h > 359) h = 359;
	if (s < 0) s = 0;
	if (s > 1) s = 1;
	if (l < 0) l = 0;
	if (l > 1) l = 1;
	if (a < 0) a = 0;
	if (a > 1) a = 1;
	s = Math.floor(100*s);
	l = Math.floor(100*l);
	return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}

// generates r, g, b for a random color chosen uniformly from the HSV cone
function randomColor() {
	var h = Math.random()*6;
	var s = Math.pow(Math.random(), 1.0/2.0);
	var v = Math.pow(Math.random(), 1.0/3.0);
	while (v <= 0.2) v = Math.pow(Math.random(), 1.0/3.0); // let's not make it too dark
	var c = s*v;
	var color = {
		r: 0,
		g: 0,
		b: 0
	}; // this will be updated
	if (h < 1) {
		color.r = 1;
		color.g = h;
	} else if (h < 2) {
		color.r = 2 - h;
		color.g = 1;
	} else if (h < 3) {
		color.g = 1;
		color.b = h - 2;
	} else if (h < 4) {
		color.g = 4 - h;
		color.b = 1;
	} else if (h < 5) {
		color.r = h - 4;
		color.b = 1;
	} else if (h < 6) {
		color.r = 1;
		color.b = 6 - h;
	}
	color.r = 256*(c*(color.r) + v - c);
	color.g = 256*(c*(color.g) + v - c);
	color.b = 256*(c*(color.b) + v - c);
	return color;
}

// whether an angle is between t1 and t2, where t1 < t2
function angleInRange(angle, t1, t2) {
	while (angle >= t1) angle -= 2*Math.PI;
	while (angle < t1) angle += 2*Math.PI;
	if (t1 <= angle && angle <= t2) return true;
	return false;
}