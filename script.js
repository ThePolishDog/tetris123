var BLOCK_SIDE_LENGTH = 30;
var ROWS = 20;
var COLS = 10;
var SCORE_WORTH = 10;
var GAME_CLOCK = 1000;
var SHAPES = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ], [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
    ], [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
    ], [
        [4, 4],
        [4, 4]
    ], [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
    ], [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
    ], [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
    ],
];
var GameModel = /** @class */ (function () {
    function GameModel(ctx) {
        this.ctx = ctx;
        this.fallingPiece = null;
        this.grid = this.makeStartingGrid();
    }
    GameModel.prototype.makeStartingGrid = function () {
        var grid = [];
        for (var i = 0; i < ROWS; i++) {
            grid.push([]);
            for (var j = 0; j < COLS; j++) {
                grid[grid.length - 1].push(0);
            }
        }
        return grid;
    };
    GameModel.prototype.collision = function (x, y) {
        var shape = this.fallingPiece.shape;
        var n = shape.length;
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (shape[i][j] > 0) {
                    var p = x + j;
                    var q = y + i;
                    if (p >= 0 && p < COLS && q < ROWS) {
                        if (this.grid[q][p] > 0) {
                            return true;
                        }
                    }
                    else {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    GameModel.prototype.renderGameState = function () {
        for (var i = 0; i < this.grid.length; i++) {
            for (var j = 0; j < this.grid[i].length; j++) {
                var cell = this.grid[i][j];
                this.ctx.fillStyle = 'green';
                this.ctx.fillRect(j, i, 1, 1);
            }
        }
        if (this.fallingPiece !== null) {
            this.fallingPiece.renderPiece();
        }
    };
    GameModel.prototype.moveDown = function () {
        var _this = this;
        if (this.fallingPiece === null) {
            this.renderGameState();
            return;
        }
        else if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)) {
            var shape_1 = this.fallingPiece.shape;
            var x_1 = this.fallingPiece.x;
            var y_1 = this.fallingPiece.y;
            shape_1.map(function (row, i) {
                row.map(function (cell, j) {
                    var p = x_1 + j;
                    var q = y_1 + 1;
                    if (p >= 0 && p < COLS && q < ROWS && cell > 0) {
                        _this.grid[p][q] == shape_1[i][j];
                    }
                });
            });
            if (this.fallingPiece.y === 0) {
                alert("game over");
                this.grid = this.makeStartingGrid();
            }
            this.fallingPiece = null;
        }
        else {
            this.fallingPiece.y += 1;
        }
        this.renderGameState();
    };
    return GameModel;
}());
var Piece = /** @class */ (function () {
    function Piece(shape, ctx) {
        this.shape = shape;
        this.ctx = ctx;
        this.y = 0;
        this.x = Math.floor(COLS / 2);
    }
    Piece.prototype.renderPiece = function () {
        var _this = this;
        this.shape.map(function (row, i) {
            row.map(function (cell, j) {
                if (cell > 0) {
                    _this.ctx.fillStyle = 'red';
                    _this.ctx.fillRect(_this.x + j, _this.y + i, 1, 1);
                }
            });
        });
    };
    return Piece;
}());
var canvas = document.getElementById('game');
var scoreboard = document.getElementById('scoreboard');
var ctx = canvas.getContext('2d');
ctx.scale(BLOCK_SIDE_LENGTH, BLOCK_SIDE_LENGTH);
var model = new GameModel(ctx);
var score = 0;
setInterval(function () {
    newGameState();
}, GAME_CLOCK);
var newGameState = function () {
    fullSend();
    if (model.fallingPiece === null) {
        var rand = Math.round(Math.random() * 6) + 1;
        var newPiece = new Piece(SHAPES[rand], ctx);
        model.fallingPiece = newPiece;
        model.moveDown();
    }
    else {
        model.moveDown();
    }
};
var fullSend = function () {
    var allFilled = function (row) {
        for (var _i = 0, row_1 = row; _i < row_1.length; _i++) {
            var x = row_1[_i];
            if (x === 0) {
                return false;
            }
        }
        return true;
    };
    for (var i = 0; i < model.grid.length; i++) {
        if (allFilled(model.grid[i])) {
            score += SCORE_WORTH;
            model.grid.splice(i, 1);
            model.grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }
    scoreboard.innerHTML = "Score: " + String(score);
};