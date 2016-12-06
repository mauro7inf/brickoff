// all it does is keep track of sequences
sequencer = {
	sequences: []
};

sequencer.update = function () { // play sequences at the update rate
	for (var i = 0; i < this.sequences.length; i++) {
		if (this.sequences[i].mode == 'active') this.sequences[i].update();
		else if (this.sequences[i].mode == 'done') {
			this.sequences.splice(i,1);
			i--;
		}
	}
};

sequencer.pauseToggle = function () {
	for (var i = 0; i < this.sequences.length; i++) gameState.paused ? this.sequences[i].pause() : this.sequences[i].unpause();
};