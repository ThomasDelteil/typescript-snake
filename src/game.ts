/// <reference path='board.ts'/>
/// <reference path='snake.ts'/>
/// <reference path='renderer.ts'/>
/// <reference path='gameController.ts'/>

class Game {
	
	private board : Board;
	private snake : Snake;
	private renderer : Renderer;
	private controller : GameController;
	private speed: number;
	
	public constructor(
		sizeProperties: SizeProperties,
		rendererProperties: RendererProperties
	) {
		this.init();
	}
	
	public init() {
		// Initialize the game
		// -- models
		this.board = new Board(sizeProperties);
		this.snake = new Snake(
			sizeProperties.height/2, 
			sizeProperties.width/2,
			sizeProperties,
			Snake.E);
		
		// -- renderer
		this.renderer = new Renderer(this.snake, this.board, rendererProperties);
		
		// -- controller
		this.controller = new GameController(this.snake);		
	}
	
	public start() {
		// start the game loop
		this.speed = 200;
		this.renderer.paint();
		this.gameLoop(this);
	}
	
	private gameLoop(that) {
		that.board.updateTreat(false);
		that.dealWithTreat();
		that.snake.move();
    	that.renderer.paint();
		if (that.snake.isLastMoveValid()) {
			that.speed = Math.max(100, that.speed-1);
			window.setTimeout(that.gameLoop, that.speed, that);
		} else {
			alert("You lost mate");
			that.init();
			that.start();	
		}
		
	}
	
	private dealWithTreat() {
		var treat = this.board.getTreat()
		this.snake.getSnakeParts().forEach(element => {
			if (element.x == treat.x && element.y == treat.y) {
				this.snake.elongate(treat.size);
				this.board.updateTreat(true);
				this.dealWithTreat();
			}
		});
	}
}