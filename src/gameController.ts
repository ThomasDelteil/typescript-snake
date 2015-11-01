/// <reference path='snake.ts'/>
class GameController {
	
	private snake: Snake;
	
	public constructor(snake: Snake) {
		this.snake = snake;
		this.initializeListeners();
	}
	
	public initializeListeners() {
		
		var mapping = {
			38 : Snake.N,
			39 : Snake.E,
			40 : Snake.S,
			37 : Snake.W
		};
				
		document.onkeydown = (e => {
			console.log(e);
    		var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    		if (charCode && mapping[charCode]) {
        		this.snake.setDirection(mapping[charCode]);
			}
		});
	}
	
	
	
}