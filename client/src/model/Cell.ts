import { IBoard } from "./Board";
import { Colors } from "./colors.enum";
import { FigureTypes, IFigure } from "./figures/figures.interface";
import { IKing } from "./figures/King";
import { IRook } from "./figures/Rook";

export interface ICell {
    readonly x: number;
    readonly y: number;
    color: Colors;
    prevFigure: IFigure | null;
    figure: IFigure | null;
    isAvailable: boolean
    isEmpty: () => boolean;
    isEnemy: (figure: IFigure | null) => boolean;
    isSafeCell: (target: ICell, board: IBoard) => boolean;
    moveFigure: (target: ICell, board: IBoard, isFake?: boolean, isCastling?: boolean) => void;
    isUnderAttack: (target: ICell, board: IBoard) => boolean;
    canMoveFigure: (target: ICell, board: IBoard) => boolean;
    isCastlingMove: (target: ICell, board: IBoard) => boolean;
    isUncheckingMove: (target: ICell, board: IBoard) => boolean;
    handleAddMove: (target: ICell, board: IBoard, isCastling: boolean) => void;
    handlePromotion: (figureToPromote: FigureTypes, board: IBoard) => void;
    isEnPassant: (target: ICell) => boolean;
    isTargetDiagonal: (target: ICell) => boolean;
}

interface ICellInit extends Pick<ICell, 'x' | 'y' | 'color' | 'figure'> { };

export class Cell implements ICell {
    readonly x: number;
    readonly y: number;
    prevFigure: IFigure | null = null;
    color: Colors;
    figure: IFigure | null;
    isAvailable = false;


    constructor({ x, y, color, figure }: ICellInit) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = figure
    }

    isEmpty(): boolean {
        return this.figure === null;
    }

    isSafeCell(target: ICell, board: IBoard): boolean {

        let isValidMove = false;
        this.moveFigure(target, board, true);
        board.updateEnemyLegalMoves();
        board.isKingChecked();
        if (!board.states.isCheck) {
            isValidMove = true;
        }
        target.moveFigure(this, board, true);
        target.figure = target.prevFigure;
        return isValidMove
    }

    isUnderAttack(target: ICell, board: IBoard) {
        return board.figures.some(figure => {
            return figure.legalMoves.some(move => move === target && figure.color !== board.states.currentPlayer);
        })
    }

    isEnemy(figure: IFigure | null): boolean {
        if (!figure) return false;
        if (!this.figure) return false;
        return this.figure.color !== figure.color;
    }

    canMoveFigure(target: ICell, board: IBoard) {

        if (target.figure?.type === FigureTypes.KING) return false;
        if (this.figure?.color !== board.states.currentPlayer) return false;
        if (this.isCastlingMove(target)) return (this.figure as IKing).canPerformCastle(target, board);

        const move = this.figure?.legalMoves.find(cell => cell.x === target.x && cell.y === target.y)
        return !!move;
    }

    isEnPassant(target: ICell) {
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);
        const isDiagonal = absX === absY;
        if ((this.figure?.type !== FigureTypes.PAWN && !isDiagonal) && !target.isEmpty()) return false;
        return true;

    }

    isTargetDiagonal(target: ICell) {
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);
        return absX === absY;
    }

    isUncheckingMove(target: ICell, board: IBoard) {
        // run a fake move to check if a king is checked after the move then undo
        const copyBoard = board.getCopyBoard();
        copyBoard.states.isCheck = false;

        if (this.canMoveFigure(target, copyBoard)) {
            return this.isSafeCell(target, copyBoard);
        } else {
            return false
        }

    }

    isCastlingMove(target: ICell) {
        if ((this.figure?.type === FigureTypes.KING && target.figure?.type === FigureTypes.ROOK)
            && this.figure.color === target.figure.color) return true;
        return false
    }

    performCastle(target: ICell, board: IBoard) {
        (this.figure as IKing).performCastle(target, board);
        (target.figure as IRook).performCastle(board);
    }


    moveFigure(target: ICell, board: IBoard, isFake: boolean = false, isCastling: boolean = false) {
        if (this.isCastlingMove(target)) return this.performCastle(target, board);
        if (!isFake) this.handleAddMove(target, board, isCastling);

        this.figure!.moveFigure(target, board, isFake);
        target.prevFigure = target.figure;
        target.figure = this.figure;
        this.figure = null;
    }

    handleAddMove(target: ICell, board: IBoard, isCastling: boolean) {
        if (target.figure) {
            board.addMove({ ...this.figure!, x: target.x, y: target.y, figureTaken: { ...target.figure } });
            board.addLostFigure({ ...target.figure, takenBy: { ...this.figure! } });
            board.popFigure(target.figure);
            return;
        }
        board.addMove({ ...this.figure!, x: target.x, y: target.y, isCastling: isCastling })
    }

    handlePromotion(figureToPromote: FigureTypes, board: IBoard) {
        if (!this.figure) return;

        const type = this.figure.color === Colors.WHITE ? figureToPromote.toUpperCase() : figureToPromote;
        board.popFigure(this.figure);
        this.figure = board.createFigure(type, this.x, this.y);
        board.figures.push(this.figure!);

    }
}