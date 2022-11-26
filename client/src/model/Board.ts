import { IMove } from "../constants/socketIO/ClientEvents.interface";
import { Cell } from "./Cell";
import { ICell } from "./Cell"
import { Colors } from "./colors.enum";
import { Bishop } from "./figures/Bishop";
import { FigureTypes, ISpritesObj } from "./figures/Figures";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";
import { returnColorCell } from "./helpers";

export interface IBoard {
    cells: ICell[][]   
    startNewGame: (fen:string,mySprites?:ISpritesObj, enemySprites?:ISpritesObj) => void;    
    showAvailable: (selected: ICell) => void;
    receiveMove: (move: IMove) => void;
    getCell: (x: number, y: number) => ICell;
    getCopyBoard: () => IBoard;
    isKingChecked: () => boolean;
}



export class Board implements IBoard {
    cells: ICell[][] = []
   

    //opponent is always at the top

    initPawns(clientColor: Colors, opponentColor: Colors, spritePack?: ISpritesObj) {
        this.cells[1].forEach((cell) => {

            cell.figure = new Pawn(cell.x, cell.y, opponentColor, spritePack);
        })
        this.cells[6].forEach((cell) => {

            cell.figure = new Pawn(cell.x, cell.y, clientColor, spritePack);
        })
    }

    showAvailable(selected: ICell) {
        if (!selected.figure) return;

        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 8; j++) {
                // if (selected.figure?.canMove(this.cells[i][j], this)) {
                //     this.cells[i][j].isAvailable = true;
                //     selected.figure.legalMoves.push(this.cells[i][j]);
                // }
                this.cells[i][j].isAvailable = selected.figure.canMove(this.cells[i][j], this);
            }
        }
    }


    startNewGame(fen:string, mySprites?:ISpritesObj, enemySprites?:ISpritesObj) {
        this.initCells(fen, mySprites, enemySprites);
    }

    getCell(x: number, y: number) {        
        return this.cells[y][x];
    }

    receiveMove({ currentCell, targetCell }: IMove) {
        const start = this.getCell(currentCell.x, currentCell.y);
        const target = this.getCell(targetCell.x, targetCell.y);
        start!.moveFigure(target!);
    }

    getCopyBoard() {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        return newBoard;
    }

    updateAllLegalMoves() {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                const current = this.cells[i][j];
                this.showAvailable(current)
                return current.figure!.legalMoves.some(cell => cell.figure?.type === FigureTypes.KING)
            }
        }
    }


    isKingChecked() {

        for (let i = 0; i < this.cells.length; i++) {
            for (let j = 0; j < this.cells[i].length; j++) {
                const current = this.cells[i][j];
                if (!current.figure) continue;
                this.showAvailable(current)
                return current.figure!.legalMoves.some(cell => cell.figure?.type === FigureTypes.KING)
            }
        }
        return false;

    }


    initCells(fen: string, mySprites?: ISpritesObj, enemySprites?: ISpritesObj) {

        const splited = fen.split(' ');
        const [positions, currentPlayer, castleRules, enPassant] = splited;

        let currentRow = 0; // current y
        let currentCol = 0; // current x
        let currentInd = 0;
        let row: ICell[] = [];

        while (currentInd < positions.length) {
            const currentPos = positions[currentInd]; //current char
            currentCol = currentCol > 7 ? 0 : currentCol;
            if (currentPos === '/') {
                this.cells.push(row);
                currentRow++;
                row = [];
            } else {
                if (isNaN(+currentPos)) {

                    const figure = this.createFigure(currentPos, currentCol, currentRow, mySprites, enemySprites);
                    const cell = new Cell({ x: currentCol, y: currentRow, color: returnColorCell(currentRow, currentCol), figure: figure });
                    row.push(cell);
                    currentCol++;
                } else {
                    const blankCells = new Array(+currentPos).fill(null)
                        .map((spot,ind) => new Cell({x: currentCol +ind, 
                            y:currentRow, color: returnColorCell(currentRow, currentCol + ind), figure:null}))

                    row.push(...blankCells);
                    currentCol+= +currentPos;
                }
            }
            currentInd++;
        }
        this.cells.push(row);


    }

    createFigure(char: string, x: number, y: number, mySprites?: ISpritesObj, enemySprites?: ISpritesObj) {

        const type = char.toLowerCase()
        const isEnemy = char === char.toLowerCase();

        switch (type) {
            case FigureTypes.BISHOP:
                return new Bishop(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? enemySprites : mySprites)

            case FigureTypes.KING:
                return new King(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? enemySprites : mySprites);

            case FigureTypes.PAWN:
                return new Pawn(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? enemySprites : mySprites);

            case FigureTypes.KNIGHT:
                return new Knight(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? enemySprites : mySprites);

            case FigureTypes.QUEEN:
                return new Queen(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? enemySprites : mySprites);

            case FigureTypes.ROOK:
                return new Rook(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? enemySprites : mySprites);
            default:
                return null;
        }

    }





}