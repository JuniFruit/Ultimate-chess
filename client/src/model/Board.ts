import { Cell } from "./Cell";
import { ICell } from "./Cell"
import { Colors } from "./colors.enum";
import { Bishop } from "./figures/Bishop";
import { FigureTypes } from "./figures/Figures";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";

export interface IBoard {
    cells: ICell[][]
    createBoard: () => void;
    startNewGame: () => void;
    initFigures: (clientColor: Colors, opponentColor: Colors) => void;
    showAvailable: (selected: ICell) => void;
}



export class Board implements IBoard {
    cells: ICell[][] = []

     createBoard() {
        for (let i=0; i< 8; i++) {
            const row: ICell[] = [];
            for (let j=0; j<8; j++) {
                if ((i+j) % 2 !== 0) {
                    row.push(new Cell({x: j, y: i, color: Colors.BLACK, figure: null, board: this}))
                } else {
                    row.push(new Cell({x: j, y: i, color: Colors.WHITE, figure: null, board: this}))
                }
            }
            this.cells.push(row);
        }

    }

     initPawns(clientColor: Colors , opponentColor:Colors) {
        this.cells[1].forEach(cell=> {
            
            cell.figure = new Pawn(opponentColor, cell);
        })
        this.cells[6].forEach(cell=> {
            
            cell.figure = new Pawn(clientColor, cell);
        })
    }

     initKnights(clientColor: Colors , opponentColor:Colors) {
        
        this.cells[0][1].figure = new Knight(opponentColor, this.cells[0][1]);
        this.cells[0][6].figure = new Knight(opponentColor, this.cells[0][6]);
        this.cells[7][1].figure = new Knight(clientColor, this.cells[7][1]);
        this.cells[7][6].figure = new Knight(clientColor, this.cells[7][6]);

    }
     initBishops(clientColor: Colors , opponentColor:Colors) {
        this.cells[0][2].figure = new Bishop(opponentColor, this.cells[0][2]);
        this.cells[0][5].figure = new Bishop(opponentColor, this.cells[0][5]);
        this.cells[7][2].figure = new Bishop(clientColor, this.cells[7][2]);
        this.cells[7][5].figure = new Bishop(clientColor, this.cells[7][5]);

    }
     initQueens(clientColor: Colors , opponentColor:Colors) {
        this.cells[0][3].figure = new Queen(opponentColor, this.cells[0][3]);
        this.cells[7][3].figure = new Queen(clientColor, this.cells[7][3]);

    }
     initRooks(clientColor: Colors , opponentColor:Colors) {
        this.cells[0][0].figure = new Rook(opponentColor, this.cells[0][0]);
        this.cells[0][7].figure = new Rook(opponentColor, this.cells[0][7]);
        this.cells[7][0].figure = new Rook(clientColor, this.cells[7][0]);
        this.cells[7][7].figure = new Rook(clientColor, this.cells[7][7]);

    }
     initKings(clientColor: Colors , opponentColor:Colors) {
        this.cells[0][4].figure = new King(opponentColor, this.cells[0][4]);
        this.cells[7][4].figure = new King(clientColor, this.cells[7][4]);
    }

    

     initFigures(clientColor = Colors.WHITE, opponentColor = Colors.BLACK) {
        this.initPawns(clientColor, opponentColor);
        this.initKings(clientColor, opponentColor);
        this.initQueens(clientColor, opponentColor);
        this.initKnights(clientColor, opponentColor);
        this.initRooks(clientColor, opponentColor);
        this.initBishops(clientColor, opponentColor);
    }

    showAvailable(selected:ICell) {
        if (!selected.figure) return;
        
        for (let i=0; i<8; i++) {

            for(let j=0; j<8;j++) {
                this.cells[i][j].isAvailable = selected.figure?.canMove(this.cells[i][j])
            }
        }
    }
    

    startNewGame() {
        this.createBoard();
    }



}