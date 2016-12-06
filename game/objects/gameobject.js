// useless prototype at the moment, but it prevents some generic function calls from crashing
function GameObject() {
	this.type = "GameObject";
	this.remove = false;
}

GameObject.prototype.update = function () {};

GameObject.prototype.draw = function () {};

GameObject.prototype.death = function () {};