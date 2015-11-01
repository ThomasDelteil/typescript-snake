var Board = (function () {
    function Board(sizeProperties) {
        this.sizeProperties = sizeProperties;
        this.updateTreat(true);
    }
    Board.prototype.updateTreat = function (force) {
        var manathan = (this.sizeProperties.height + this.sizeProperties.width);
        if (force || Math.floor(Math.random() * manathan * 1.5) == 1) {
            this.treat = {
                x: Math.floor(Math.random() * this.sizeProperties.height),
                y: Math.floor(Math.random() * this.sizeProperties.width),
                size: Math.floor(Math.random() * 10) == 1 ? 5 : 1
            };
        }
    };
    Board.prototype.getSizeProperties = function () {
        return this.sizeProperties;
    };
    Board.prototype.getTreat = function () {
        return this.treat;
    };
    return Board;
})();
/// <reference path='board.ts'/>
var Snake = (function () {
    function Snake(xInit, yInit, size, directionInit) {
        this.elements = [];
        this.elements.push({ x: xInit, y: yInit });
        this.direction = directionInit;
        this.size = size;
        this.elongation = 0;
        this.alreadySet = false;
    }
    Snake.prototype.move = function () {
        var lastElement = this.elements[this.elements.length - 1];
        // Reinitialise the alreadySet variable
        this.alreadySet = false;
        // Elongate or just move
        if (this.elongation) {
            this.elongation--;
        }
        else {
            this.elements = this.elements.slice(1); // pop the last one	
        }
        // get the direction move
        switch (this.direction) {
            case Snake.N:
                var newElement = { x: lastElement.x - 1, y: lastElement.y };
                break;
            case Snake.S:
                var newElement = { x: lastElement.x + 1, y: lastElement.y };
                break;
            case Snake.W:
                var newElement = { x: lastElement.x, y: lastElement.y - 1 };
                break;
            case Snake.E:
                var newElement = { x: lastElement.x, y: lastElement.y + 1 };
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
    };
    Snake.prototype.isLastMoveValid = function () {
        var lastElement = this.elements[this.elements.length - 1];
        var isValid = true;
        this.elements.forEach(function (element) {
            if (element != lastElement && element.x == lastElement.x && element.y == lastElement.y) {
                isValid = false;
            }
        });
        return isValid;
    };
    Snake.prototype.setDirection = function (direction) {
        if (this.alreadySet || this.getOpposite(direction) === this.direction) {
        }
        else {
            this.direction = direction;
            this.alreadySet = true;
        }
    };
    Snake.prototype.getDirection = function () {
        return this.direction;
    };
    Snake.prototype.getOpposite = function (direction) {
        switch (direction) {
            case Snake.N:
                return Snake.S;
            case Snake.S:
                return Snake.N;
            case Snake.E:
                return Snake.W;
            case Snake.W:
                return Snake.E;
        }
    };
    Snake.prototype.getSnakeParts = function () {
        return this.elements;
    };
    Snake.prototype.elongate = function (size) {
        this.elongation = this.elongation + size;
    };
    Snake.N = "N";
    Snake.S = "S";
    Snake.W = "W";
    Snake.E = "E";
    return Snake;
})();
/// <reference path='board.ts'/>
/// <reference path='snake.ts'/>
var Renderer = (function () {
    function Renderer(snake, board, p) {
        this.snake = snake;
        this.board = board;
        this.p = p;
        this.M = this.board.getSizeProperties().height;
        this.N = this.board.getSizeProperties().width;
        this.initialize();
    }
    Renderer.prototype.initialize = function () {
        this.gameElement = document.getElementById(this.p.gameId);
        while (this.gameElement.firstChild) {
            this.gameElement.removeChild(this.gameElement.firstChild);
        } // empty the potential children
        this.gameElement.style.width = this.p.cellW * this.M + "px";
        this.gameElement.style.height = this.p.cellH * this.N + "px";
        this.cells = new Array(this.M);
        for (var i = 0; i < this.M; i++) {
            this.cells[i] = new Array(this.N);
            for (var j = 0; j < this.N; j++) {
                this.cells[i][j] = document.createElement('div');
                this.gameElement.appendChild(this.cells[i][j]);
            }
        }
    };
    Renderer.prototype.paint = function () {
        this.paintGrid();
    };
    Renderer.prototype.paintGrid = function () {
        // Paint the snake		
        var snakeParts = this.snake.getSnakeParts();
        var head = snakeParts[snakeParts.length - 1];
        var snakeFastLookUp = {};
        snakeParts.forEach(function (element) {
            snakeFastLookUp[element.x + "-" + element.y] = true;
        });
        snakeFastLookUp[head.x + "-" + head.y] = false; // set the head to false;
        for (var i = 0; i < this.M; i++) {
            for (var j = 0; j < this.N; j++) {
                var newClass = snakeFastLookUp[i + "-" + j] ? "cell snake" : "cell empty";
                if (this.cells[i][j].className != newClass) {
                    this.cells[i][j].className = newClass;
                }
            }
        }
        // Paint the treat
        var treat = this.board.getTreat();
        this.cells[treat.x][treat.y].className = "cell treat-" + treat.size;
        // Paint the head
        this.cells[head.x][head.y].className = "cell snake-head snake-head-" + this.snake.getDirection();
    };
    return Renderer;
})();
/// <reference path='snake.ts'/>
var GameController = (function () {
    function GameController(snake) {
        this.snake = snake;
        this.initializeListeners();
    }
    GameController.prototype.initializeListeners = function () {
        var _this = this;
        var mapping = {
            38: Snake.N,
            39: Snake.E,
            40: Snake.S,
            37: Snake.W
        };
        document.onkeydown = (function (e) {
            console.log(e);
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            if (charCode && mapping[charCode]) {
                _this.snake.setDirection(mapping[charCode]);
            }
        });
    };
    return GameController;
})();
/// <reference path='board.ts'/>
/// <reference path='snake.ts'/>
/// <reference path='renderer.ts'/>
/// <reference path='gameController.ts'/>
var Game = (function () {
    function Game(sizeProperties, rendererProperties) {
        this.init();
    }
    Game.prototype.init = function () {
        // Initialize the game
        // -- models
        this.board = new Board(sizeProperties);
        this.snake = new Snake(sizeProperties.height / 2, sizeProperties.width / 2, sizeProperties, Snake.E);
        // -- renderer
        this.renderer = new Renderer(this.snake, this.board, rendererProperties);
        // -- controller
        this.controller = new GameController(this.snake);
    };
    Game.prototype.start = function () {
        // start the game loop
        this.speed = 200;
        this.renderer.paint();
        this.gameLoop(this);
    };
    Game.prototype.gameLoop = function (that) {
        that.board.updateTreat(false);
        that.dealWithTreat();
        that.snake.move();
        that.renderer.paint();
        if (that.snake.isLastMoveValid()) {
            that.speed = Math.max(100, that.speed - 1);
            window.setTimeout(that.gameLoop, that.speed, that);
        }
        else {
            alert("You lost mate");
            that.init();
            that.start();
        }
    };
    Game.prototype.dealWithTreat = function () {
        var _this = this;
        var treat = this.board.getTreat();
        this.snake.getSnakeParts().forEach(function (element) {
            if (element.x == treat.x && element.y == treat.y) {
                _this.snake.elongate(treat.size);
                _this.board.updateTreat(true);
                _this.dealWithTreat();
            }
        });
    };
    return Game;
})();
/// <reference path='board.ts'/>
/// <reference path='renderer.ts'/>
/// <reference path='game.ts'/>
var rendererProperties = {
    cellW: 20,
    cellH: 20,
    gameId: "snake"
};
var sizeProperties = {
    width: 26,
    height: 26
};
document.addEventListener("DOMContentLoaded", function (event) {
    var game = new Game(sizeProperties, rendererProperties);
    game.start();
});
