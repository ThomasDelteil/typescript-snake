/// <reference path='board.ts'/>
/// <reference path='renderer.ts'/>
/// <reference path='game.ts'/>

var rendererProperties = {
	cellW : 20,
	cellH : 20,
	gameId: "snake"
};

var sizeProperties = {
	width: 26,
	height: 26
};

document.addEventListener("DOMContentLoaded", function(event) { 
	var game = new Game(sizeProperties, rendererProperties);
	game.start();
});
