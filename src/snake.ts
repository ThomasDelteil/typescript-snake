/// <reference path='board.ts'/>

class Snake {
	private direction: string;
	private size: SizeProperties;
	private elements: SnakeParts[];
	private elongation : number;
	private alreadySet :  boolean;
	
	public static N = "N";
	public static S = "S";
	public static W = "W";
	public static E = "E";
	
	public constructor(
		xInit : number, 
		yInit : number, 
		size: SizeProperties,
		directionInit: string) 
	{
		this.elements = [];
		this.elements.push({x : xInit, y : yInit});
		this.direction = directionInit;
		this.size = size;
		this.elongation = 0;	
		this.alreadySet = false;
	}
	
	public move() {
		var lastElement = this.elements[this.elements.length-1];
		
		// Reinitialise the alreadySet variable
		this.alreadySet = false;
		
		// Elongate or just move
		if (this.elongation) {
			this.elongation--;
		} else {
			this.elements = this.elements.slice(1); // pop the last one	
		}
		
		// get the direction move
		switch(this.direction) {
			case Snake.N :
				var newElement = {x: lastElement.x - 1, y: lastElement.y};
				break;
			case Snake.S :
				var newElement = {x: lastElement.x + 1, y: lastElement.y};
				break;
			case Snake.W :
				var newElement = {x: lastElement.x, y: lastElement.y - 1};
				break;
			case Snake.E :
				var newElement = {x: lastElement.x, y: lastElement.y + 1};
				break;
			default:
				throw new Error("Unknown direction " + this.direction);
		}
		
		// got to the other side
		if (newElement.x < 0) {
			newElement.x += this.size.width; 
		}
		if (newElement.x >= this.size.width) {
			newElement.x -= this.size.width;
		}
		if (newElement.y < 0) {
			newElement.y += this.size.height;
		}
		if (newElement.y >= this.size.height) {
			newElement.y -= this.size.height;
		}
		
		this.elements.push(newElement);
	}
	
	public isLastMoveValid() : boolean {		
		var lastElement = this.elements[this.elements.length-1];
		var isValid = true;
		this.elements.forEach(element => {
			if (element != lastElement && element.x == lastElement.x && element.y == lastElement.y) {
				isValid = false;
			}
		});
		return isValid;
	}
	
	public setDirection(direction: string){
		if (this.alreadySet || this.getOpposite(direction) === this.direction) {
			// do nothing
		} else {
			this.direction = direction;
			this.alreadySet = true;
		}
	}
	
	public getDirection() : string {
		return this.direction;
	}
	
	protected getOpposite(direction: string) {
		switch(direction) {
			case Snake.N : 
				return Snake.S;
			case Snake.S :
				return Snake.N;
			case Snake.E :
				return Snake.W;
			case Snake.W : 
				return Snake.E
		}
	}
	
	public getSnakeParts() {
		return this.elements;
	}
	
	public elongate(size: number) {
		this.elongation = this.elongation + size;
	}
}

interface SnakeParts {
	x : number;
	y : number;
}


