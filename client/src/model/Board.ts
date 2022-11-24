import { Cell } from "./Cell";
import { ICell } from "./Cell"
import { Colors } from "./colors.enum";
import { Bishop } from "./figures/Bishop";
import { ISpritesObj } from "./figures/Figures";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";

export interface IBoard {
    cells: ICell[][]
    createBoard: () => void;
    startNewGame: () => void;
    initFigures: (clientColor: Colors, opponentColor: Colors, spritePack: ISpritesObj) => void;
    showAvailable: (selected: ICell, board:IBoard) => void;
    receiveMove: (currentCell: ICell ,targetCell: ICell) => void;
}



export class Board implements IBoard {
    cells: ICell[][] = []

    createBoard() {
        for (let i = 0; i < 8; i++) {
            const row: ICell[] = [];
            for (let j = 0; j < 8; j++) {
                if ((i + j) % 2 !== 0) {
                    row.push(new Cell({ x: j, y: i, color: Colors.BLACK, figure: null }))
                } else {
                    row.push(new Cell({ x: j, y: i, color: Colors.WHITE, figure: null }))
                }
            }
            this.cells.push(row);
        }

    }

    initPawns(clientColor: Colors, opponentColor: Colors, spritePack?: ISpritesObj) {
        this.cells[1].forEach((cell, x) => {

            cell.figure = new Pawn(x, 1, opponentColor, spritePack);
        })
        this.cells[6].forEach((cell, x) => {

            cell.figure = new Pawn(x, 6, clientColor, spritePack);
        })
    }

    initKnights(clientColor: Colors, opponentColor: Colors, spritePack?: ISpritesObj) {

        this.cells[0][1].figure = new Knight(1, 0, opponentColor, spritePack);
        this.cells[0][6].figure = new Knight(6, 0, opponentColor, spritePack);
        this.cells[7][1].figure = new Knight(1, 7, clientColor, spritePack);
        this.cells[7][6].figure = new Knight(6, 7, clientColor, spritePack);

    }
    initBishops(clientColor: Colors, opponentColor: Colors, spritePack?: ISpritesObj) {
        this.cells[0][2].figure = new Bishop(2, 0, opponentColor, spritePack);
        this.cells[0][5].figure = new Bishop(5, 0, opponentColor, spritePack);
        this.cells[7][2].figure = new Bishop(2, 7, clientColor, spritePack);
        this.cells[7][5].figure = new Bishop(5, 7, clientColor, spritePack);

    }
    initQueens(clientColor: Colors, opponentColor: Colors, spritePack?: ISpritesObj) {
        this.cells[0][3].figure = new Queen(3, 0, opponentColor, spritePack);
        this.cells[7][3].figure = new Queen(3, 7, clientColor, spritePack);

    }
    initRooks(clientColor: Colors, opponentColor: Colors, spritePack?: ISpritesObj) {
        this.cells[0][0].figure = new Rook(0, 0, opponentColor, spritePack);
        this.cells[0][7].figure = new Rook(7, 0, opponentColor, spritePack);
        this.cells[7][0].figure = new Rook(0, 7, clientColor, spritePack);
        this.cells[7][7].figure = new Rook(7, 7, clientColor, spritePack);

    }
    initKings(clientColor: Colors, opponentColor: Colors, spritePack?: ISpritesObj) {
        this.cells[0][4].figure = new King(4, 0, opponentColor, spritePack);
        this.cells[7][4].figure = new King(4, 7, clientColor, spritePack);
    }



    initFigures(clientColor = Colors.WHITE, opponentColor = Colors.BLACK, spritePack?: ISpritesObj) {
        this.initPawns(clientColor, opponentColor, spritePack);
        this.initKings(clientColor, opponentColor, spritePack);
        this.initQueens(clientColor, opponentColor, spritePack);
        this.initKnights(clientColor, opponentColor, spritePack);
        this.initRooks(clientColor, opponentColor, spritePack);
        this.initBishops(clientColor, opponentColor, spritePack);
    }

    showAvailable(selected: ICell, board:IBoard) {
        if (!selected.figure) return;

        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 8; j++) {
                this.cells[i][j].isAvailable = selected.figure?.canMove(this.cells[i][j], board)
            }
        }
    }


    startNewGame() {
        this.createBoard();
    }

    receiveMove(currentCell: ICell, targetCell:ICell) {
        this.cells[targetCell.y][targetCell.x].figure = targetCell.figure;
        this.cells[currentCell.y][currentCell.x].figure = currentCell.figure;
    }



}