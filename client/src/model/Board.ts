import { IMove, IMoveOptions } from "../constants/socketIO/ClientEvents.interface";
import { IBoardData } from "../constants/socketIO/ServerEvents.interface";
import { Cell, ICell, ICellData } from "./Cell";
import { Colors } from "./colors.enum";
import { Bishop } from "./figures/Bishop";
import { FigureTypes, IFigure, IFigureInfo, ILostFigure, IMovedFigure, ISpritesObj } from "./figures/figures.interface";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";
import { convertToChar, returnColorCell } from "./helpers";
import { BoardUlt } from "./ultimate/BoardUlt";
import { ICellUlt } from "./ultimate/CellUlt";

export interface IBoard {
    cells: ICell[][];
    figures: IFigure[];
    states: IBoardStates;
    startNewGame: (fen: string) => void;
    receiveMove: (move: IMove) => void;
    getCell: (x: number, y: number) => ICell;
    getCopyBoard: () => Board | BoardUlt;
    isKingChecked: () => boolean;
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
    getFigures: () => void;
    convertToFEN: () => string;
    undo: () => void;
    incrementMoveCount: () => void;
    moveFigure: (from: ICell, to: ICell, options: IMoveOptions) => void;
    mergeBoardData: (boardData: IBoardData) => void;
    decrementMoveCount: () => void;
    filterUncheckingMoves: () => void;
    getBoardData: () => IBoardData;

}

export interface IBoardStates {
    currentPlayer: Colors;
    lostFigures: ILostFigure[];
    isCheck: boolean;
    isFirstMove: boolean;
    isGameOver: boolean;
    whiteKillCount: number;
    blackKillCount: number;
    lostFiguresCount: number;
    whiteTime: number;
    blackTime: number;
    moves: IMovedFigure[];
    lastMoveTime?: number;
    globalMovesCount: number;
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
        globalMovesCount: 0,
        whiteKillCount: 0,
        blackKillCount: 0,
        lostFiguresCount: 0,
        whiteTime: 300,
        blackTime: 300,

    }

    constructor(whiteTeamSprites?: ISpritesObj, blackTeamSprites?: ISpritesObj) {
        this.states.whiteTeamSprites = whiteTeamSprites;
        this.states.blackTeamSprites = blackTeamSprites;
    }

    public startNewGame(fen: string) {
        this._initCells(fen);
    }

    public getCell(x: number, y: number) {
        return this.cells[Math.floor(y)][Math.floor(x)];
    }
    public swapPlayer() {
        this.states.currentPlayer = this.states.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
    }
    public getFigures() {
        this.cells.forEach(row => row.forEach(cell => {
            if (cell.figure) {
                this.figures.push(cell.figure);
            }
        }))
    }

    public getCopyBoard() {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.figures = this.figures;
        newBoard.states = this.states;
        newBoard.states.blackTeamSprites = this.states.blackTeamSprites;
        newBoard.states.whiteTeamSprites = this.states.whiteTeamSprites;
        return newBoard;
    }

    public updateAllLegalMoves() {
        this.figures.forEach(figure => {
            figure.getLegalMoves(this);
        });
        this.filterUncheckingMoves();

    }

    public updateEnemyLegalMoves() {
        this.figures.forEach(figure => {
            if (figure.color !== this.states.currentPlayer)
                figure.getLegalMoves(this)
        });

    }

    public filterUncheckingMoves() {
        this.figures.forEach(figure => figure.filterUncheckingMoves(this))
    }

    public isKingChecked() {
        this.states.isCheck = this.cells.some(rows => {
            return rows.some(cell => {
                return cell.figure?.legalMoves.some(move =>
                    move.figure?.type === FigureTypes.KING && move.figure.color !== cell.figure?.color)
            })
        })

        return this.states.isCheck;
    }
    public isCheckMate() {
        return !this.figures.some(figure => figure.color === this.states.currentPlayer && figure.legalMoves.length);

    }   

    public isSufficientMaterial(player: Colors) {
        const playerMaterial = this.figures.filter(figure => figure.color === player);
        if (playerMaterial.length === 1 && playerMaterial.every(figure => figure.type === FigureTypes.KING)) return false;
        if (playerMaterial.length === 2
            && playerMaterial.every(figure => figure.type === FigureTypes.KING || figure.type === FigureTypes.BISHOP)) return false;
        if (playerMaterial.length === 2
            && playerMaterial.every(figure => figure.type === FigureTypes.KING || figure.type === FigureTypes.KNIGHT)) return false;

        return true;

    }



    public isDraw() {
        if (this._isStalemate()) return true
        if (!this.isSufficientMaterial(this.states.currentPlayer)
            && !this.isSufficientMaterial(this.states.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE)) return true;
        return false;
    }

    public addMove(movedFigure: IMovedFigure) {

        this.states.moves.push(movedFigure);
    }

    public addLostFigure(figure: ILostFigure) {
        this.popFigure(figure);
        figure.color === Colors.WHITE ? this.states.blackKillCount++ : this.states.whiteKillCount++;
        this.states.lostFiguresCount++;
        this.states.lostFigures.push(figure);
    }

    public popFigure(figure: IFigure | IFigureInfo) {
        const ind = this.figures.findIndex(piece => piece.pos === figure.pos);
        this.figures.splice(ind, 1);
    }

    public clearBoard() {
        this.cells = [];
        this.figures = [];
        this.states.isCheck = false;
    }
   

    public createFigure(char: string, x: number, y: number) {

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

    public moveFigure(from: ICell, to: ICell, options: IMoveOptions) {
        from.moveFigure(to, this, options);
    }

    public convertToFEN() {

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



    public receiveMove({ from, to, options }: IMove) {
        const start = this.getCell(from.x, from.y);
        const target = this.getCell(to.x, to.y);

        if (!start || !target) return;
        this.incrementMoveCount(); // it's important to update move count before moving figure 
        start.moveFigure(target, this, { isFake: false, ...options });

    }

    public undo() {
        const lastMove = this.states.moves.pop();
        if (!lastMove) return;
        const currentCell = this.getCell(lastMove.to.x, lastMove.to.y);
        const initialCell = this.getCell(lastMove.from.x, lastMove.from.y);
        currentCell.undo();
        initialCell.undo();

        if (lastMove.options.isEnPassant) {
            const takenCell = this.getCell(lastMove.figureTaken?.x!, lastMove.figureTaken?.y!);
            takenCell.undo();
        }
    }

    public mergeBoardData(boardData: IBoardData) {

        this.cells.forEach((row, y) => {
            row.forEach((cell, x) => {
                const currentBoardDataCell = boardData.cells[y][x];
                if (currentBoardDataCell.states) (cell as ICellUlt).states = { ...currentBoardDataCell.states! }
                if (cell.figure) {
                    cell.figure.states = { ...currentBoardDataCell.figure?.states! }
                    cell.figure.ultimateStates = { ...currentBoardDataCell.figure?.ultimateStates! }
                    cell.figure.legalMoves = [...currentBoardDataCell.figure?.legalMoves!]
                }
            })
        })
    }

    public getBoardData() {
        const resultCells: ICellData[][] = [];
        this.cells.forEach(row => {
            const cellsRow: ICellData[] = [];
            row.forEach(cell => {
                const cellData: ICellData = {
                    states: (cell as ICellUlt).states && {...(cell as ICellUlt).states},
                    figure: cell.figure ? {
                        states: {...cell.figure!.states},
                        ultimateStates: {...cell.figure!.ultimateStates},
                        legalMoves: [...cell.figure!.legalMoves]
                    } : undefined
                    
                };
                cellsRow.push(cellData)
            })
            resultCells.push(cellsRow);

        })
        return {
            FEN: this.convertToFEN(),
            cells: resultCells,
            states: this.states
        }
    }

    public incrementMoveCount() {
        this.states.globalMovesCount++;
    }

    public decrementMoveCount() {
        this.states.globalMovesCount--;
    }

    private _initCells(fen: string) {

        const splited = fen.split(' ');
        const [positions, currentPlayer] = splited;

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

    private _isStalemate() {
        if (this.states.isCheck) return false;
        return !this.figures.some(figure => {
            return figure.color === this.states.currentPlayer && figure.legalMoves.length
        })
    }
}