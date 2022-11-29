import { IBoard } from "./Board";
import { Colors } from "./colors.enum";
import { FigureTypes, IFigure } from "./figures/Figures";
import { Direction } from "./helper.enum";
import { isInBounds } from "./helpers";

export interface ILegalMoveArg {
    board: IBoard;
    direction?: Direction;
    numCell: number;
}

export interface ICell {
    readonly x: number;
    readonly y: number;
    color: Colors;
    prevMove: ICell | null;
    figure: IFigure | null;
    isAvailable: boolean;
    isEmpty: () => boolean;
    isEnemy: (figure: IFigure | null) => boolean;
    isSafeCell: (target: ICell, board: IBoard) => boolean;
    moveFigure: (target: ICell, board: IBoard) => void;
    canMoveFigure: (target: ICell, board: IBoard) => boolean;
    getLegalMovesVertical: (arg: ILegalMoveArg) => void;
    getLegalMovesHorizontal: (arg: ILegalMoveArg) => void;
    getLegalMovesDiagonal: (arg: ILegalMoveArg) => void;
    addLegalMove: (cell: ICell) => boolean;
    isUncheckingMove: (target: ICell, board: IBoard) => boolean;
}

interface ICellInit extends Pick<ICell, 'x' | 'y' | 'color' | 'figure'> { };

export class Cell implements ICell {
    readonly x: number;
    readonly y: number;
    prevMove: ICell | null = null;
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

        // for (let i = 0; i < 8; i++) {

        //     for (let j = 0; j < 8; j++) {
        //         let current = board.getCell(j, i);
        //         if (current!.figure && this.isEnemy(current!.figure)) {

        //             const potentialTarget = {
        //                 ...target,
        //                 figure: this.figure
        //             };

        //             if (current!.figure.canMove(potentialTarget, board)) return false;
        //         } else {
        //             continue;
        //         }
        //     }
        // }

        return true;
    }

    isEnemy(figure: IFigure | null): boolean {
        if (!figure) return false;
        if (!this.figure) return false;
        return this.figure.color !== figure.color;
    }

    // if direction is not specified, working in both directions


    getLegalMovesVertical({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;
        let i = 1;
        while (i <= numCell) {
            if (!isInBounds(this.figure!.x, this.figure!.y + i * dir)) break;
            const current = board.getCell(this.figure!.x, this.figure!.y + i * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break;
            i++;
        }

        if (!direction) this.getLegalMovesVertical({ board, direction: Direction.NEG, numCell });
    }
    getLegalMovesHorizontal({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;
        let i = 1;
        while (i <= numCell) {
            if (!isInBounds(this.figure!.x + i * dir, this.figure!.y)) break;
            const current = board.getCell(this.figure!.x + i * dir, this.figure!.y);
            const isLast = this.addLegalMove(current);
            if (isLast) break;
            i++;
        }

        if (!direction) this.getLegalMovesHorizontal({ board, direction: Direction.NEG, numCell });
    }

    getLegalMovesDiagonal({ board, direction, numCell }: ILegalMoveArg) {

        const dir = direction ? direction : Direction.POS;

        let currentInd = 1;
        while (currentInd <= numCell) {
            if (!isInBounds(this.figure!.x + currentInd * dir, this.figure!.y + currentInd * dir)) break;
            const current = board.getCell(this.figure!.x + currentInd * dir, this.figure!.y + currentInd * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break
            currentInd++;
        }
        currentInd = 1;

        while (currentInd <= numCell) {
            if (!isInBounds(this.figure!.x - currentInd * dir, this.figure!.y + currentInd * dir)) break;
            const current = board.getCell(this.figure!.x - currentInd * dir, this.figure!.y + currentInd * dir);
            const isLast = this.addLegalMove(current);
            if (isLast) break
            currentInd++;
        }

        if (!direction) this.getLegalMovesDiagonal({ board, direction: Direction.NEG, numCell });
    }


    addLegalMove(cell: ICell) {

        if (cell.isEmpty()) {
            this.figure!.legalMoves.push(cell);
            return false;
        } else if (!cell.isEmpty() && cell.isEnemy(this.figure)) {
            this.figure!.legalMoves.push(cell);
            return true;
        }
        return true;
    }

    canMoveFigure(target: ICell, board: IBoard) {
        if (target.figure?.type === FigureTypes.KING) return false;
        if (this.figure?.color !== board.currentPlayer) return false;

        const move = this.figure?.legalMoves.find(cell => cell.x === target.x && cell.y === target.y)
        return !!move;
    }

    isUncheckingMove(target: ICell, board: IBoard) {
        const copyBoard = board.getCopyBoard();
        copyBoard.isCheck = false;
        copyBoard.updateAllLegalMoves();
        const copyTarget = copyBoard.getCell(target.x, target.y);
        const copyStart = copyBoard.getCell(this.x, this.y);
        console.log(copyStart === this)
        copyStart.moveFigure(copyTarget, copyBoard);
        copyBoard.updateAllLegalMoves();
        copyBoard.isKingChecked();

        if (!copyBoard.isCheck) {
            return true;
        } else {
            return false;
        }

    }


    moveFigure(target: ICell, board: IBoard) {
        if (!this.figure || !target) return;
        if (target.figure?.type === FigureTypes.KING) return;

        this.figure!.moveFigure(target);
        target.figure = this.figure;
        target.prevMove = this;
        this.figure = null;
        this.isAvailable = false;
        this.prevMove = null
        board.swapPlayer();
    }





}