levelScreen.initFieldsNone = function () {
	this.fields = [];
};

levelScreen.initFields6 = function () {
	var field = new RectangularGravityField(0, 0, 800, 800, 0, 750);
	this.fields = [field];
};