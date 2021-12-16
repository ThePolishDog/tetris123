const BLOCK_SIDE_LENGTH = 30
const ROWS = 20
const COLS = 10
const SCORE_WORTH = 40
const GAME_CLOCK = 500

const SHAPES = [
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


]


const COLORS = [
    '#000000',
    '#FF0000',
    '#0000FF',
    '#0000FF',
    '#FFFF00',
    '#00FFFF',
    '#10FF01',
    '#F000FF'
]

class GameModel {
    ctx: any;
    fallingPiece: any;
    grid: any;
    constructor(ctx: any) {
        this.ctx = ctx
        this.fallingPiece = null;
        this.grid = this.makeStartingGrid()
    }
    makeStartingGrid() {
        let grid: any = []
        for (let i = 0; i < ROWS; i++) {
            grid.push([])
            for (let j = 0; j < COLS; j++) {
                grid[grid.length - 1].push(0)
            }
        }
        return grid;
    }
    collision(x: any, y: any) {
        const shape = this.fallingPiece.shape
        const n = shape.length
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (shape[i][j] > 0) {
                    let p = x + j
                    let q = y + i
                    if (p >= 0 && p < COLS && q < ROWS) {
                        if (this.grid[q][p] > 0) {
                            return true
                        }
                    } else {
                        return true
                    }
                }
            }
        }
        return false
    }
    renderGameState() {
        //this.ctx.canvas.height = 20 * 300
        //this.ctx.canvas.width = 10 * 300
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                let cell = this.grid[i][j]
                this.ctx.fillStyle = COLORS[cell]
                this.ctx.fillRect(j, i, 1, 1)
            }
        }

        if (this.fallingPiece !== null) {
            this.fallingPiece.renderPiece()
        }
    }
    moveDown() {
        if (this.fallingPiece === null) {
            this.renderGameState()
            return
        }
        else if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)) {
            const shape = this.fallingPiece.shape
            const x = this.fallingPiece.x
            const y = this.fallingPiece.y
            shape.map((row: any, i: any) => {
                row.map((cell: any, j: any) => {
                    let p = x + j
                    let q = y + i
                    if (p >= 0 && p < COLS && q < ROWS && cell > 0) {
                        this.grid[q][p] = shape[i][j]
                    }
                })
            })
            if (this.fallingPiece.y === 0) {
                alert("game over")
                this.grid = this.makeStartingGrid()
            }
            this.fallingPiece = null
        } else {
            this.fallingPiece.y += 1
        }
        this.renderGameState()
    }
    move(right: any) {
        if (this.fallingPiece === null) {
            return
        }
        let x = this.fallingPiece.x
        let y = this.fallingPiece.y
        if (right) {
            if (!this.collision(x + 1, y)) {
                this.fallingPiece.x += 1
            }
        }
        else {
            if (!this.collision(x - 1, y)) {
                this.fallingPiece.x -= 1
            }
        }
        this.renderGameState()
    }
    rotate() {
        if (this.fallingPiece !== null) {
            let shape = this.fallingPiece.shape
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < y; x++) {
                    [this.fallingPiece.shape[x][y], this.fallingPiece.shape[y][x]] =
                        [this.fallingPiece.shape[y][x], this.fallingPiece.shape[x][y]]
                }
            }
            this.fallingPiece.shape.forEach(((row: any) => row.reverse()))
        }
        this.renderGameState()
    }
}


class Piece {
    shape: any;
    ctx: any;
    y: any;
    x: any;
    constructor(shape: any, ctx: any) {
        this.shape = shape
        this.ctx = ctx
        this.y = 0;
        this.x = Math.floor(COLS / 2)
    }
    renderPiece() {
        this.shape.map((row: any, i: any) => {
            row.map((cell: any, j: any) => {
                if (cell > 0) {
                    this.ctx.fillStyle = COLORS[cell]
                    this.ctx.fillRect(this.x + j, this.y + i, 1, 1)
                }
            })
        })
    }
}

let canvas: any = document.getElementById('game')
let scoreboard: any = document.getElementById('scoreboard')
let ctx: any = canvas.getContext('2d')
ctx.scale(BLOCK_SIDE_LENGTH, BLOCK_SIDE_LENGTH)
let model = new GameModel(ctx)
let score = 0

setInterval(() => {
    newGameState()
}, GAME_CLOCK)

let newGameState = () => {
    fullSend()
    if (model.fallingPiece === null) {
        const rand = Math.floor(Math.random() * 7)
        const newPiece = new Piece(SHAPES[rand], ctx)
        model.fallingPiece = newPiece
        model.moveDown()
    } else {
        model.moveDown()
    }

}

const fullSend = () => {
    const allFilled = (row: any) => {
        for (let x of row) {
            if (x === 0) {
                return false
            }
        }
        return true
    }

    for (let i = 0; i < model.grid.length; i++) {
        if (allFilled(model.grid[i])) {
            score += SCORE_WORTH
            model.grid.splice(i, 1)
            model.grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        }
    }
    scoreboard.innerHTML = "Score: " + String(score)
}

document.addEventListener('keydown', (e) => {
    e.preventDefault()
    switch (e.key) {
        case 'w':
            model.rotate()
            break
        case 'd':
            model.move(true)
            break
        case 'a':
            model.move(false)
            break
        case 's':
            model.moveDown()
            break
        case 'ArrowUp':
            model.rotate()
            break
        case 'ArrowRight':
            model.move(true)
            break
        case 'ArrowLeft':
            model.move(false)
            break
        case 'ArrowDown':
            model.moveDown()
            break
    }
})
