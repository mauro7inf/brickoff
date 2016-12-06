// may not be necessary to have a unified player where all sound is queued
audioPlayer = {
	notes: []
};

audioPlayer.initAudio = function () {
	this.scriptNode = audioCtx.createScriptProcessor(1024, 0, 1); // mono sound, no input buffer
	this.scriptNode.connect(audioCtx.destination);
	this.scriptNode.onaudioprocess = this.audioCallback;
}

audioPlayer.audioCallback = function (e) {
	var outputData = e.outputBuffer.getChannelData(0);
	for (var sample = 0; sample < e.outputBuffer.length; sample++) {
		outputData[sample] = 0;
		for (var i = 0; i < audioPlayer.notes.length; i++) {
			if (audioPlayer.notes[i] && audioPlayer.notes[i].isPlaying) outputData[sample] += audioPlayer.notes[i].generate();
		}
		if (!gameState.soundOn) outputData[sample] = 0; // we want to still generate and update the notes
	}
	for (var i = 0; i < audioPlayer.notes.length; i++) { // get rid of notes that are done
		if (!(audioPlayer.notes[i].isPlaying)) {
			audioPlayer.notes.splice(i,1);
			i--;
		}
	}
}