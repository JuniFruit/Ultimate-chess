import { IBoard } from "./Board";
import { Colors } from "./colors.enum";
import { IFigure } from "./figures/Figures";

export interface ICell {
    readonly x: number;
    readonly y: number;
    color: Colors;
    figure: IFigure | null;
    isAvailable: boolean;   
    board: IBoard;
    isEmpty: () => boolean;
    isEmptyHorizontal: (target:ICell) => boolean;
    isEmptyVertical: (target:ICell) => boolean;
    isEmptyDiagonal: (target:ICell) => boolean;
    moveFigure: (target:ICell) => void; 
}

interface ICellInit extends Pick<ICell, 'x' | 'y' | 'color' | 'figure' | 'board'>{};

export class Cell implements ICell {    
    readonly x: number;
    readonly y: number;
    color: Colors;
    figure: IFigure | null;
    isAvailable: boolean;
    board: IBoard;
    

    constructor({x,y,color, figure, board}:ICellInit) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = figure
        this.isAvailable = false;
        this.board = board;
    }

    isEmpty():boolean {
        return this.figure === null;
    }

    isEmptyHorizontal(target:ICell):boolean {
        if (target.x !== this.x) return false;
        const absY = Math.abs(this.y - target.y);
        const y = target.y > this.y ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!this.board.cells[this.x][this.y + y*i].isEmpty()) return false;
        }
        return true;
    }
    isEmptyVertical(target:ICell):boolean {
        if (target.y !== this.y) return false;
        const absX = Math.abs(this.x - target.x);
        const x = target.x > this.x ? 1 : -1;

        for (let i = 1; i < absX; i++) {
            if (!this.board.cells[this.x + x*i][this.y].isEmpty()) return false;
        }
        return true;
       
    }
    isEmptyDiagonal(target:ICell):boolean {

        const absY = Math.abs(this.y - target.y);
        const absX = Math.abs(this.x - target.x);

        if (absX !== absY) return false //Target is not on diagonal line

        const dy = target.y > this.y ? 1 : -1;
        const dx = target.x > this.x ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!this.board.cells[this.x + dx*i][this.y + dy*i].isEmpty()) return false;
        }

        return true;
    }


    moveFigure(target: ICell) {
        if (!this.figure?.canMove(target)) return;
        // this.figure.moveFigure(target);
        target.figure = this.figure;
        this.figure = null;
    }
}