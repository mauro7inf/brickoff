// takes an array of objects that look like this: {action: ..., time: ...}
// action is a function with no arguments; time is the time after the start that the action should run, in ms
// this can be used for audio sequences, for example
function Sequence(actions) {
	this.actions = actions.sort(function (a, b) {return a.time - b.time});
	this.mode = 'inactive';
	this.startTime = undefined;
	this.pauseTime = undefined;
	this.currentAction = 0;
}

Sequence.prototype.update = function () {
	if (this.mode == 'active') {
		var timeElapsed = Date.now() - this.startTime;
		while (this.currentAction < this.actions.length && this.actions[this.currentAction]['time'] <= timeElapsed) {
			this.actions[this.currentAction]['action'](); // perform the action
			this.currentAction++;
		}
		if (this.currentAction >= this.actions.length) this.mode = 'done';
	}
};

Sequence.prototype.start = function () {
	this.mode = 'active';
	this.startTime = Date.now();
	this.pauseTime = Date.now();
	this.currentAction = 0;
	sequencer.sequences.push(this);
};

Sequence.prototype.stop = function () {
	this.mode = 'done';
};

Sequence.prototype.pause = function () {
	this.mode = 'inactive';
	this.pauseTime = Date.now();
};

Sequence.prototype.unpause = function () {
	this.mode = 'active';
	this.startTime = Date.now() - (this.pauseTime - this.startTime); // clever, huh?
}