import { IMove } from "../constants/socketIO/ClientEvents.interface";
import { Cell } from "./Cell";
import { ICell } from "./Cell"
import { Colors } from "./colors.enum";
import { Bishop } from "./figures/Bishop";
import { FigureTypes, IFigure, ILostFigure, IMovedFigure, ISpritesObj } from "./figures/figures.interface";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";
import { convertToChar, returnColorCell } from "./helpers";

export interface IBoard {
    cells: ICell[][];
    figures: IFigure[];
    states: IBoardStates;
    startNewGame: (fen: string) => void;
    receiveMove: (move: IMove) => void;
    getCell: (x: number, y: number) => ICell;
    getCopyBoard: () => IBoard;
    getFigures: () => void;
    isKingChecked: () => boolean;
    isStalemate: () => boolean;
    isSufficientMaterial: (player: Colors) => boolean;
    isDraw: () => boolean;
    isCheckMate: () => boolean;
    updateAllLegalMoves: () => void;
    updateEnemyLegalMoves: () => void;
    createFigure: (char: string, x: number, y: number) => IFigure | null;
    swapPlayer: () => void;
    clearBoard: () => void;
    addLostFigure: (figure: ILostFigure) => void;
    addMove: (movedFigure: IMovedFigure) => void;
    popFigure: (figure: IFigure) => void
    convertToFEN: () => string;
}

export interface IBoardStates {
    currentPlayer: Colors;
    lostFigures: ILostFigure[];
    isCheck: boolean;
    isFirstMove: boolean;
    isGameOver: boolean;
    whiteTime: number;
    blackTime: number;
    moves: IMovedFigure[];
    lastMoveTime?: number;
    whiteTeamSprites?: ISpritesObj;
    blackTeamSprites?: ISpritesObj
}



export class Board implements IBoard {
    cells: ICell[][] = []
    figures: IFigure[] = [];

    states: IBoardStates = {
        currentPlayer: Colors.WHITE,
        lostFigures: [],
        moves: [],
        isCheck: false,
        isGameOver: false,
        isFirstMove: true,
        whiteTime: 300,
        blackTime: 300,         

    }   

    constructor(whiteTeamSprites?: ISpritesObj, blackTeamSprites?: ISpritesObj) {
        this.states.whiteTeamSprites = whiteTeamSprites;
        this.states.blackTeamSprites = blackTeamSprites;
    }

    startNewGame(fen: string) {
        this.initCells(fen);
        this.getFigures();
    }

    getCell(x: number, y: number) {
        return this.cells[y][x];
    }
    swapPlayer() {
        this.states.currentPlayer = this.states.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
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
        newBoard.figures = this.figures;      
        newBoard.states = this.states;
        newBoard.states.blackTeamSprites = this.states.blackTeamSprites;
        newBoard.states.whiteTeamSprites = this.states.whiteTeamSprites;
        return newBoard;
    }

    updateAllLegalMoves() {
        this.figures.forEach(figure => figure.getLegalMoves(this));

    }

    updateEnemyLegalMoves() {
        this.figures.forEach(figure => {
            if (figure.color !== this.states.currentPlayer)
                figure.getLegalMoves(this)
        });

    }


    isKingChecked() {
        this.states.isCheck = this.cells.some(rows => {
            return rows.some(cell => {
                return cell.figure?.legalMoves.some(move => move.figure?.type === FigureTypes.KING && move.figure.color !== cell.figure?.color)
            })
        })

        return this.states.isCheck;
    }

    isCheckMate() {
        return !this.figures.some(figure => figure.color === this.states.currentPlayer && figure.legalMoves.length);

    }

    isStalemate() {
        if (this.states.isCheck) return false;
        return !this.figures.some(figure => {
            console.log(figure)
            return figure.color === this.states.currentPlayer && figure.legalMoves.length
        })
    }

    isSufficientMaterial(player: Colors) {
        const playerMaterial = this.figures.filter(figure => figure.color === player);
        if (playerMaterial.length === 1 && playerMaterial.every(figure => figure.type === FigureTypes.KING)) return false;
        if (playerMaterial.length === 2
            && playerMaterial.every(figure => figure.type === FigureTypes.KING || figure.type === FigureTypes.BISHOP)) return false;
        if (playerMaterial.length === 2
            && playerMaterial.every(figure => figure.type === FigureTypes.KING || figure.type === FigureTypes.KNIGHT)) return false;

        return true;

    }



    isDraw() {
        if (this.figures.length > 5) return false;
        if (this.isStalemate()) return true
        if (!this.isSufficientMaterial(this.states.currentPlayer)
            && !this.isSufficientMaterial(this.states.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE)) return true;
        return false;
    }

    addMove(movedFigure: IMovedFigure) {

        this.states.moves.push({
            type: movedFigure.type,
            color: movedFigure.color,
            x: movedFigure.x,
            y: movedFigure.y,
            sprite: movedFigure.sprite,
            isCastling: movedFigure.isCastling,
            figureTaken: movedFigure.figureTaken

        });
    }

    addLostFigure(figure: ILostFigure) {
        // this.popFigure(figure);
        this.states.lostFigures.push({
            color: figure.color,
            type: figure.type,
            sprite: figure.sprite,
            takenBy: figure.takenBy
        });
    }

    popFigure(figure: IFigure) {
        const ind = this.figures.findIndex(piece => piece === figure);
        this.figures.splice(ind, 1);
    }

    clearBoard() {
        this.cells = [];
        this.figures = [];
        this.states.isCheck = false;
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
        this.states.currentPlayer = currentPlayer === Colors.BLACK ? Colors.BLACK : Colors.WHITE;

    }

    createFigure(char: string, x: number, y: number) {

        const type = char.toLowerCase()
        const isBlack = char === char.toLowerCase();

        switch (type) {
            case FigureTypes.BISHOP:
                return new Bishop(x, y, 
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites)

            case FigureTypes.KING:
                return new King(x, y, 
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);

            case FigureTypes.PAWN:
                return new Pawn(x, y, 
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);

            case FigureTypes.KNIGHT:
                return new Knight(x, y, 
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);

            case FigureTypes.QUEEN:
                return new Queen(x, y, 
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);

            case FigureTypes.ROOK:
                return new Rook(x, y, 
                    isBlack ? Colors.BLACK : Colors.WHITE, isBlack ? this.states.blackTeamSprites : this.states.whiteTeamSprites);
            default:
                return null;
        }

    }

    convertToFEN() {

        const FEN = [];
        for (let i = 0; i < this.cells.length; i++) {
            let blankCells = 0;

            for (let j = 0; j < this.cells[i].length; j++) {
                let currentCell = this.cells[i][j];
                if (currentCell.figure) {
                    if (blankCells !== 0) {
                        FEN.push(blankCells.toString());
                        blankCells = 0;
                    }

                    FEN.push(convertToChar(currentCell.figure));
                } else if (!currentCell.figure) {
                    blankCells++;
                }

            }
            if (blankCells !== 0) FEN.push(blankCells.toString());
            FEN.push('/');
        }
        const finalFEN = FEN.join('');
        return finalFEN + ' ' + this.states.currentPlayer
    }



    receiveMove({ currentCell, targetCell, options }: IMove) {
        const start = this.getCell(currentCell.x, currentCell.y);
        const target = this.getCell(targetCell.x, targetCell.y);

        if (!start || !target) return;

        start.moveFigure(target, this);    

        if (options?.isPromotion) {          
            target.handlePromotion(options.figureToPromote!, this)
        }
    }

}