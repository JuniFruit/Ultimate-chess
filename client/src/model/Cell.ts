import { is } from "immer/dist/internal";
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
    moveFigure: (target: ICell, board: IBoard, isFake?: boolean, isCastling?:boolean) => void;
    isUnderAttack: (target: ICell, board:IBoard) => boolean;
    canMoveFigure: (target: ICell, board: IBoard) => boolean;    
    isCastlingMove: (target: ICell, board: IBoard) => boolean;
    isUncheckingMove: (target: ICell, board: IBoard) => boolean;
    canPerformCastle: (target: ICell, board: IBoard) => boolean;
    handleAddMove: (target:ICell, board:IBoard, isCastling: boolean) => void;
    handlePromotion: (figureToPromote: FigureTypes, board: IBoard) => void;
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

    isUnderAttack(target: ICell, board:IBoard) {
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
        if (this.isCastlingMove(target)) return this.canPerformCastle(target, board);

        const move = this.figure?.legalMoves.find(cell => cell.x === target.x && cell.y === target.y)
        return !!move;
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

    canPerformCastle(target: ICell, board: IBoard) {
        // check if none of the pieces moved and they are on the same row
        if (!(this.figure as IKing).isCastlingAvailable || target.figure?.type !== FigureTypes.ROOK) return false;
        if (this.figure!.color !== target.figure.color) return false;
        if (board.states.isCheck) return false;
        if (this.y !== target.y) return false;
        if (!(target.figure as IRook).isFirstMove) return false;

        // check if no pieces between
        const range = Math.abs(target.x - this.x);
        const dir = target.x < this.x ? -1 : 1;

        for (let i = 1; i < range; i++) {
            if (!board.getCell(this.x + i * dir, this.y).isEmpty() 
            || this.isUnderAttack(board.getCell(this.x + i * dir, this.y), board)) return false;
        }      

        return true;
    }

    performCastle(target: ICell, board: IBoard) {
        const dir = target.x < this.x ? 1 : -1;
        const targetForKing = board.getCell(target.x + dir, this.y);
        const targetForRook = board.getCell(target.x + 2 * dir, this.y);

        this.moveFigure(targetForKing, board, false, true);
        target.moveFigure(targetForRook, board, false, true);
    }


    moveFigure(target: ICell, board: IBoard, isFake: boolean = false, isCastling: boolean = false) {
        if (this.isCastlingMove(target)) return this.performCastle(target, board);
        if (!isFake) this.handleAddMove(target, board, isCastling);

        this.figure!.moveFigure(target, isFake);
        target.prevFigure = target.figure;
        target.figure = this.figure;
        this.figure = null;
    }

    handleAddMove (target: ICell, board: IBoard, isCastling: boolean) {
        if (target.figure) {
            board.addMove({...this.figure!, figureTaken: {...target.figure}});
            board.addLostFigure({...target.figure, takenBy: {...this.figure!}});
            board.popFigure(target.figure);
            return;
        }
        board.addMove({...this.figure!, x: target.x, y: target.y, isCastling: isCastling})
    } 
    
    handlePromotion (figureToPromote: FigureTypes, board: IBoard) {
        if (!this.figure) return;

        const type = this.figure.color === Colors.WHITE ? figureToPromote.toUpperCase() : figureToPromote;
        board.popFigure(this.figure);
        this.figure = board.createFigure(type, this.x, this.y);
        board.figures.push(this.figure!);

    }
}