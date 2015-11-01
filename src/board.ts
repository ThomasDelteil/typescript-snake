class Board {
	
	private treat: Treat;
	
	public constructor(private sizeProperties: SizeProperties) {
		this.updateTreat(true);
	}
	
	public updateTreat(force: boolean) {
		var manathan = (this.sizeProperties.height+this.sizeProperties.width);
		if (force || Math.floor(Math.random() * manathan * 1.5) == 1) {
			this.treat = {
				x: Math.floor(Math.random()*this.sizeProperties.height),
				y: Math.floor(Math.random()*this.sizeProperties.width),
				size: Math.floor(Math.random()*10) == 1 ? 5 : 1 
			}
		} 
	}
	
	public getSizeProperties() : SizeProperties {
		return this.sizeProperties;
	}
	
	public getTreat() : Treat {
		return this.treat;
	} 
}

interface SizeProperties {
	width: number;
	height: number;
}

interface Treat {
	x: number;
	y: number;
	size: number;
}

