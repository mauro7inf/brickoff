// globals (probably could use a global object and not clutter up the namespace.  Probably)
var debug = false;
var gameCanvas;
var controlCanvas;
var gameCtx;
var controlCtx;
var audioCtx = window.AudioContext ? new AudioContext() : new webkitAudioContext;
var audioPlayer;
var sequencer;
var soundBank;
var music;
var titleScreen;
var levelScreen;
var endingScreen;
var controlText;
var player;
var collisions;

var globalOptions = {
	mspf: 1000.0/180.0, // ms per frame, opposite of fps
	drawFrames: 3, // how many update frames for every draw frame
	mspa: 1000.0/audioCtx.sampleRate // ms per audio frame, opposite of sample rate
};

var gameState = {
	title: true,
	level: false,
	ending: false,
	paused: false,
	soundOn: true
};

// constants
var C1 = 440.0/Math.pow(2, 45.0/12.0); // frequency of C1
var startingLevel = 1;
var endingLevel = 5;