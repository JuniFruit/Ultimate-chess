import { IBoard } from "./Board";
import { Colors } from "./colors.enum";
import { FigureTypes, IFigure } from "./figures/Figures";
import { IKing } from "./figures/King";
import { IRook } from "./figures/Rook";

export interface ICell {
    readonly x: number;
    readonly y: number;
    color: Colors;
    prevFigure: IFigure | null;
    figure: IFigure | null;
    isAvailable: boolean;
    isEmpty: () => boolean;
    isEnemy: (figure: IFigure | null) => boolean;
    isSafeCell: (target: ICell, board: IBoard) => boolean;
    moveFigure: (target: ICell, board: IBoard, isFake?: boolean) => void;
    canMoveFigure: (target: ICell, board: IBoard) => boolean;    
    isCastlingMove: (target: ICell, board: IBoard) => boolean;
    isUncheckingMove: (target: ICell, board: IBoard) => boolean;
    canPerformCastle: (target: ICell, board: IBoard) => boolean;
}

interface ICellInit extends Pick<ICell, 'x' | 'y' | 'color' | 'figure'> { };

export class Cell implements ICell {
    readonly x: number;
    readonly y: number;
    prevFigure: IFigure | null = null;
    color: Colors;
    figure: IFigure | null;
    isAvailable: boolean;


    constructor({ x, y, color, figure }: ICellInit) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = figure
        this.isAvailable = false;
    }

    isEmpty(): boolean {
        return this.figure === null;
    }

    isSafeCell(target: ICell, board: IBoard): boolean {

        let isValidMove = false;
        this.moveFigure(target, board, true);
        board.updateEnemyLegalMoves();
        board.isKingChecked();
        if (!board.isCheck) {
            isValidMove = true;
        }
        target.moveFigure(this, board, true);
        target.figure = target.prevFigure;
        return isValidMove
    }

    isEnemy(figure: IFigure | null): boolean {
        if (!figure) return false;
        if (!this.figure) return false;
        return this.figure.color !== figure.color;
    }    

    canMoveFigure(target: ICell, board: IBoard) {

        if (target.figure?.type === FigureTypes.KING) return false;
        if (this.figure?.color !== board.currentPlayer) return false;
        if (this.isCastlingMove(target)) return this.canPerformCastle(target, board);

        const move = this.figure?.legalMoves.find(cell => cell.x === target.x && cell.y === target.y)
        return !!move;
    }

    isUncheckingMove(target: ICell, board: IBoard) {
        // run a fake move to check if a king is checked after the move then undo
        const copyBoard = board.getCopyBoard();
        copyBoard.isCheck = false;

        if (this.canMoveFigure(target, copyBoard)) {
            return this.isSafeCell(target, copyBoard);
        } else {
            return false
        }

    }

    isCastlingMove(target: ICell) {
        if (this.figure?.type === FigureTypes.KING && target.figure?.type === FigureTypes.ROOK) return true;
        return false
    }

    canPerformCastle(target: ICell, board: IBoard) {
        // check if none of the pieces moved and they are on the same row
        if (!(this.figure as IKing).isCastlingAvailable || target.figure?.type !== FigureTypes.ROOK) return false;
        if (this.figure!.color !== target.figure.color) return false;
        if (board.isCheck) return false;
        if (this.y !== target.y) return false;
        if (!(target.figure as IRook).isFirstMove) return false;

        // check if no pieces between
        const range = Math.abs(target.x - this.x);
        const dir = target.x < this.x ? -1 : 1;

        for (let i = 1; i < range; i++) {
            if (!board.getCell(this.x + i * dir, this.y).isEmpty()) return false;
        }

        if (!this.isSafeCell(board.getCell(target.x + dir * (-1), this.y), board)) return false;

        return true;
    }

    performCastle(target: ICell, board: IBoard) {
        const dir = target.x < this.x ? 1 : -1;
        const targetForKing = board.getCell(target.x + dir, this.y);
        const targetForRook = board.getCell(target.x + 2 * dir, this.y);

        this.moveFigure(targetForKing, board);
        target.moveFigure(targetForRook, board);
    }


    moveFigure(target: ICell, board: IBoard, isFake: boolean = false) {
        if (this.isCastlingMove(target)) return this.performCastle(target, board);

        this.figure!.moveFigure(target, isFake);
        target.prevFigure = target.figure;
        target.figure = this.figure;
        this.figure = null;
        this.isAvailable = false;
    }
}