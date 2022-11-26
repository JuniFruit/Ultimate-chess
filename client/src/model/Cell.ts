import { IBoard } from "./Board";
import { Colors } from "./colors.enum";
import { FigureTypes, IFigure } from "./figures/Figures";
import { Direction } from "./helper.enum";
import { isInBounds } from "./helpers";

export interface ICell {
    readonly x: number;
    readonly y: number;
    color: Colors;
    figure: IFigure | null;
    isAvailable: boolean;
    isEmpty: () => boolean;
    isEnemy: (figure: IFigure | null) => boolean;
    isSafeCell: (target: ICell, board: IBoard) => boolean;
    isEmptyHorizontal: (target: ICell, board: IBoard) => boolean;
    isEmptyVertical: (target: ICell, board: IBoard) => boolean;
    isEmptyDiagonal: (target: ICell, board: IBoard) => boolean;
    moveFigure: (target: ICell) => void;
    canMoveFigure: (target: ICell, board: IBoard) => boolean;
}

interface ICellInit extends Pick<ICell, 'x' | 'y' | 'color' | 'figure'> { };

export class Cell implements ICell {
    readonly x: number;
    readonly y: number;
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

        for (let i = 0; i < 8; i++) {

            for (let j = 0; j < 8; j++) {
                let current = board.getCell(j, i);
                if (current!.figure && this.isEnemy(current!.figure)) {

                    const potentialTarget = {
                        ...target,
                        figure: this.figure
                    };

                    if (current!.figure.canMove(potentialTarget, board)) return false;
                } else {
                    continue;
                }
            }
        }

        return true;
    }

    isEnemy(figure: IFigure | null): boolean {
        if (!figure) return false;
        return this.figure?.color !== figure.color;
    }

    isEmptyVertical(target: ICell, board: IBoard): boolean {

        if (target.x !== this.x) return false;
        const absY = Math.abs(this.y - target.y);
        const y = target.y > this.y ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!board.getCell(this.x, this.y + y * i)!.isEmpty()) return false;
        }
        return true;
    }
    isEmptyHorizontal(target: ICell, board: IBoard): boolean {
        if (target.y !== this.y) return false;
        const absX = Math.abs(this.x - target.x);
        const x = target.x > this.x ? 1 : -1;

        for (let i = 1; i < absX; i++) {
            if (!board.getCell(this.x + x * i, this.y)!.isEmpty()) return false;
        }
        return true;

    }
    isEmptyDiagonal(target: ICell, board: IBoard): boolean {

        const absY = Math.abs(this.y - target.y);
        const absX = Math.abs(this.x - target.x);

        if (absX !== absY) return false //Target is not on diagonal line

        const dy = target.y > this.y ? 1 : -1;
        const dx = target.x > this.x ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) return false;
        }

        return true;
    }

    
    getLegalMovesVertical(figure: IFigure, board: IBoard, direction: Direction, numCell: number) {

        
        for (let i = 1; i < numCell; i++) {
            if (!isInBounds(figure.x, figure.y + i * direction)) return;
            const current = board.cells[figure.y + i * direction][figure.x];
            const isLast = this.addLegalMove(current, figure);
            if (isLast) return;
        }
    }
    getLegalMovesHorizontal(figure: IFigure, board: IBoard, direction: Direction, numCell: number) {

        for (let i = 1; i < numCell; i++) {
            if (!isInBounds(figure.x + i*direction, figure.y)) return;
            const current = board.cells[figure.y][figure.x + i*direction];
            const isLast = this.addLegalMove(current, figure);
            if (isLast) return;
        }
    }

    getLegalMovesDiagonal(figure: IFigure, board: IBoard, direction: Direction, numCell: number) {

        for (let i= 1; i<numCell; i++) {
            if (!isInBounds(figure.x + i*direction, figure.y+i*direction)) return;
            const current = board.cells[figure.y+i*direction][figure.x+i*direction];
            const isLast = this.addLegalMove(current, figure);
            if (isLast) return;
            // TODO check all directions 
        }
    }
    

    addLegalMove(cell: ICell, figure: IFigure) {

        if (cell.isEmpty()) {
            figure.legalMoves.push(cell);
            return false;
        } else if (!cell.isEmpty() && cell.isEnemy(figure)) {
            figure.legalMoves.push(cell);
            return true;
        }
    }

    canMoveFigure(target: ICell, board: IBoard) {
        if (!this.figure?.canMove(target, board)) return false;
        if (target.figure?.type === FigureTypes.KING) return false;
        return true;
    }


    moveFigure(target: ICell) {
        this.figure!.moveFigure(target);
        target.figure = this.figure;
        this.figure = null;
        this.isAvailable = false;
    }



}