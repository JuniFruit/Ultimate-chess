import { IMove, IMoveOptions } from "../constants/socketIO/ClientEvents.interface";
import { Cell, ICellInfo } from "./Cell";
import { ICell } from "./Cell"
import { Colors } from "./colors.enum";
import { Bishop } from "./figures/Bishop";
import { FigureTypes, IFigure, IFigureInfo, ILostFigure, IMovedFigure, ISpritesObj } from "./figures/figures.interface";
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
    convertToFEN: () => string;
    undo: () => void;
    incrementMoveCount: () => void;
    moveFigure: (from: ICell, to: ICell, options: IMoveOptions) => void;
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
        this._getFigures();
    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }
    public swapPlayer() {
        this.states.currentPlayer = this.states.currentPlayer === Colors.WHITE ? Colors.BLACK : Colors.WHITE;
    }
    private _getFigures() {
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
        this.figures.forEach(figure => figure.getLegalMoves(this));

    }

    public updateEnemyLegalMoves() {
        this.figures.forEach(figure => {
            if (figure.color !== this.states.currentPlayer)
                figure.getLegalMoves(this)
        });

    }


    public isKingChecked() {
        this.states.isCheck = this.cells.some(rows => {
            return rows.some(cell => {
                return cell.figure?.legalMoves.some(move => move.figure?.type === FigureTypes.KING && move.figure.color !== cell.figure?.color)
            })
        })

        return this.states.isCheck;
    }

    public isCheckMate() {
        return !this.figures.some(figure => figure.color === this.states.currentPlayer && figure.legalMoves.length);

    }

    private _isStalemate() {
        if (this.states.isCheck) return false;
        return !this.figures.some(figure => {
            return figure.color === this.states.currentPlayer && figure.legalMoves.length
        })
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
        if (this.figures.length > 5) return false;
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


    private _initCells(fen: string) {

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

    public moveFigure (from: ICell, to: ICell, options: IMoveOptions) {
        // const start = this.getCell(from.x, from.y);
        // const target = this.getCell(to.x, to.y);
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

    public incrementMoveCount() {
        this.states.globalMovesCount++;
    }

}