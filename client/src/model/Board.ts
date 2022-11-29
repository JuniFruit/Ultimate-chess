import e from "express";
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
import { flipFEN, returnColorCell } from "./helpers";

export interface IBoard {
    cells: ICell[][];
    currentPlayer: Colors;
    moves: ICell[];
    isCheck: boolean;
    startNewGame: (fen: string, mySprites?: ISpritesObj, enemySprites?: ISpritesObj) => void;
    showAvailable: (selected: ICell) => void;
    receiveMove: (move: IMove) => void;
    getCell: (x: number, y: number) => ICell;
    getCopyBoard: () => IBoard;
    isKingChecked: () => boolean;
    updateAllLegalMoves: () => void;
    swapPlayer: () => void;
    undo: () => void;
    addMove: (move: ICell) => void
    isCheckMate: () => boolean;
}



export class Board implements IBoard {
    cells: ICell[][] = []
    currentPlayer: Colors = Colors.WHITE;
    moves: ICell[] = [];
    isCheck: boolean = false;

    showAvailable(selected: ICell) {
        if (!selected.figure) return;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.cells[i][j].figure?.type !== FigureTypes.KING) {
                    this.cells[i][j].isAvailable = selected.figure.legalMoves.some(cell => cell.x === j && cell.y === i);

                } else {
                    this.cells[i][j].isAvailable = false;
                }
            }
        }
    }


    startNewGame(fen: string, mySprites?: ISpritesObj, enemySprites?: ISpritesObj) {
        this.initCells(fen, mySprites, enemySprites);
        this.updateAllLegalMoves();
    }

    getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    receiveMove({ currentCell, targetCell }: IMove) {
        const start = this.getCell(currentCell.x, currentCell.y);
        const target = this.getCell(targetCell.x, targetCell.y);
        start.moveFigure(target, this);
        this.addMove(target);
    }

    swapPlayer() {
        this.currentPlayer = this.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
    }

    getCopyBoard() {
        const newBoard = new Board();
        newBoard.cells = this.cells.slice();
        newBoard.currentPlayer = this.currentPlayer;
        newBoard.moves = this.moves;
        newBoard.isCheck = this.isCheck;
        return newBoard;
    }

    updateAllLegalMoves() {
        this.cells.forEach(row => {
            row.forEach(cell => cell.figure?.getLegalMoves(this));
        })

    }


    isKingChecked() {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const current = this.cells[i][j];
                if (!current.figure) continue;
                if (current.figure!.legalMoves.some(cell => cell.figure?.type === FigureTypes.KING)) {
                    this.isCheck = true;
                    return true;
                }
            }
        }
        this.isCheck = false;
        return false;

    }

    isCheckMate() {

        // let isOver = true;

        // for (let i = 0; i < this.cells.length; i++) {
        //     for (let j = 0; j < this.cells[i].length; j++) {
        //         let current = this.cells[i][j];
        //         if (!isOver) return false;
        //         if (current.figure?.color === this.currentPlayer) {
        //             current.figure.legalMoves.forEach(move => {
        //                 if (!move) return;
        //                 const thisFigure = move.figure;
        //                 current.moveFigure(move, this);
        //                 this.updateAllLegalMoves();
        //                 this.isKingChecked();
        //                 if (!this.isCheck) {
        //                     isOver = false
        //                     move.moveFigure(move.prevMove!, this);
        //                     move.figure = thisFigure;
        //                     this.updateAllLegalMoves();
        //                     return;
        //                 } else {
        //                     move.moveFigure(move.prevMove!, this);
        //                     move.figure = thisFigure;
        //                     this.updateAllLegalMoves();
        //                 }
        //             })

        //         } else{
        //             continue
        //         }
        //     }
        // }
        // return isOver;
        this.updateAllLegalMoves();
        return this.cells.some(row => row.some(cell => cell.figure?.legalMoves.length !== 0))

    }

    undo() {
        if (!this.moves.length) return;
        const lastMove = this.moves.pop();

        lastMove?.moveFigure(lastMove.prevMove!, this);

    }

    addMove(move: ICell) {
        this.moves.push(move);
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
                        .map((spot, ind) => new Cell({
                            x: currentCol + ind,
                            y: currentRow, color: returnColorCell(currentRow, currentCol + ind), figure: null
                        }))

                    row.push(...blankCells);
                    currentCol += +currentPos;
                }
            }
            currentInd++;
        }
        this.cells.push(row);
        this.currentPlayer = currentPlayer === Colors.BLACK ? Colors.BLACK : Colors.WHITE;


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