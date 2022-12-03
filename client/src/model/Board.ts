import { IMove } from "../constants/socketIO/ClientEvents.interface";
import { Cell } from "./Cell";
import { ICell } from "./Cell"
import { Colors } from "./colors.enum";
import { Bishop } from "./figures/Bishop";
import { FigureTypes, IFigure, ISpritesObj } from "./figures/Figures";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";
import { returnColorCell } from "./helpers";

export interface IBoard {
    cells: ICell[][];
    currentPlayer: Colors;
    moves: ICell[];
    figures: IFigure[];
    isCheck: boolean;
    startNewGame: (fen: string) => void;
    showAvailable: (selected: ICell) => void;
    receiveMove: (move: IMove) => void;
    getCell: (x: number, y: number) => ICell;
    getCopyBoard: () => IBoard;
    getFigures: () => void;
    isKingChecked: () => boolean;
    isStalemate: () => boolean;
    isSufficientMaterial: (player:Colors) => boolean; 
    isDraw: () => boolean;
    updateAllLegalMoves: () => void;
    updateEnemyLegalMoves: () => void;
    createFigure: (char: string, x: number, y: number) => IFigure | null;
    swapPlayer: () => void;
    clearBoard: () => void;
    addMove: (move: ICell) => void
    isCheckMate: () => boolean;
}



export class Board implements IBoard {
    cells: ICell[][] = []
    currentPlayer: Colors = Colors.WHITE;
    moves: ICell[] = [];
    figures: IFigure[] = [];
    isCheck: boolean = false;
    mySprites?: ISpritesObj;
    enemySprites?: ISpritesObj;

    constructor(mySprites?: ISpritesObj, enemySprites?: ISpritesObj) {
        this.mySprites = mySprites;
        this.enemySprites = enemySprites
    }

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


    startNewGame(fen: string) {
        this.initCells(fen);
        this.getFigures();
    }

    getCell(x: number, y: number) {
        return this.cells[y][x];
    }
    swapPlayer() {
        this.currentPlayer = this.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
    }
    getFigures() {
        this.cells.forEach(row => row.forEach(cell => {
            if (cell.figure) {
                this.figures.push(cell.figure);
            }
        }))
    }

    getCopyBoard() {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.currentPlayer = this.currentPlayer;
        newBoard.moves = this.moves;
        newBoard.isCheck = this.isCheck;
        newBoard.mySprites = this.mySprites;
        newBoard.enemySprites = this.enemySprites;
        newBoard.figures = this.figures;
        return newBoard;
    }

    updateAllLegalMoves() {
        this.figures.forEach(figure => figure.getLegalMoves(this));

    }

    updateEnemyLegalMoves() {
        this.figures.forEach(figure => {
            if (figure.color !== this.currentPlayer)
            figure.getLegalMoves(this)
        });

    }


    isKingChecked() {
        this.isCheck = this.cells.some(rows => {
            return rows.some(cell => {
                return cell.figure?.legalMoves.some(move => move.figure?.type === FigureTypes.KING && move.figure.color !== cell.figure?.color)
            })
        })
        
        return this.isCheck;
        

    }

    isCheckMate() {
        return !this.figures.some(figure => figure.color === this.currentPlayer && figure.legalMoves.length);

    }

    isStalemate() {
        return !this.figures.some(figure => {
            return figure.color === this.currentPlayer && figure.legalMoves.length && !this.isCheck
        })
    }

    isSufficientMaterial(player:Colors) {
        const playerMaterial = this.figures.filter(figure => figure.color === player);

        if (playerMaterial.every(figure => figure.type === FigureTypes.KING)) return false;
        if (playerMaterial.length === 2 
            && playerMaterial.every(figure => figure.type === FigureTypes.KING || figure.type === FigureTypes.BISHOP)) return false;
        if (playerMaterial.length === 2 
            && playerMaterial.every(figure => figure.type === FigureTypes.KING || figure.type === FigureTypes.KNIGHT)) return false;

        return true;

    }



    isDraw() {
        if (this.figures.length > 5) return false;
        if (this.isStalemate()) return true
        if (!this.isSufficientMaterial(this.currentPlayer) 
        && !this.isSufficientMaterial(this.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE)) return true;
        return false;
    }

    addMove(move: ICell) {
        this.moves.push(move);
    }

    clearBoard() {
        this.cells = [];
        this.moves = [];
        this.figures = [];
        this.isCheck = false;
    }


    initCells(fen: string) {

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

                    const figure = this.createFigure(currentPos, currentCol, currentRow);
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

    createFigure(char: string, x: number, y: number) {

        const type = char.toLowerCase()
        const isEnemy = char === char.toLowerCase();

        switch (type) {
            case FigureTypes.BISHOP:
                return new Bishop(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? this.enemySprites : this.mySprites)

            case FigureTypes.KING:
                return new King(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? this.enemySprites : this.mySprites,);

            case FigureTypes.PAWN:
                return new Pawn(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? this.enemySprites : this.mySprites);

            case FigureTypes.KNIGHT:
                return new Knight(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? this.enemySprites : this.mySprites);

            case FigureTypes.QUEEN:
                return new Queen(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? this.enemySprites : this.mySprites);

            case FigureTypes.ROOK:
                return new Rook(x, y, isEnemy ? Colors.BLACK : Colors.WHITE, isEnemy ? this.enemySprites : this.mySprites);
            default:
                return null;
        }

    }



    receiveMove({ currentCell, targetCell, options }: IMove) {
        const start = this.getCell(currentCell.x, currentCell.y);
        const target = this.getCell(targetCell.x, targetCell.y);

        if (!start || !target) return;

        if (options?.isPromotion) {
            start.figure = this.createFigure(options.figureToPromote!, start.x, start.y);
        }

        start.moveFigure(target, this);
        this.addMove(target);
    }

}