import { IBoard } from "./Board";
import { Colors } from "./colors.enum";
import { FigureTypes, IFigure } from "./figures/Figures";

export interface ICell {
    readonly x: number;
    readonly y: number;
    color: Colors;
    figure: IFigure | null;
    isAvailable: boolean;   
    // board: IBoard;
    isEmpty: () => boolean;
    isEnemy: (figure:IFigure) => boolean;
    isSafeCell: (target: ICell, board:IBoard) => boolean;
    isEmptyHorizontal: (target:ICell, board:IBoard) => boolean;
    isEmptyVertical: (target:ICell, board:IBoard) => boolean;
    isEmptyDiagonal: (target:ICell, board:IBoard) => boolean;
    moveFigure: (target:ICell, board:IBoard) => boolean; 
}

interface ICellInit extends Pick<ICell, 'x' | 'y' | 'color' | 'figure'>{};

export class Cell implements ICell {    
    readonly x: number;
    readonly y: number;
    color: Colors;
    figure: IFigure | null;
    isAvailable: boolean;
    // board: IBoard;
    

    constructor({x,y,color, figure}:ICellInit) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = figure
        this.isAvailable = false;
        // this.board = board;
    }

    isEmpty():boolean {
        return this.figure === null;
    }
    
    isSafeCell(target: ICell, board: IBoard):boolean {

        for (let i=0;i<8;i++) {

            for (let j=0; j<8;j++) {
                let current = board.cells[i][j];
                if (current.figure && this.isEnemy(current.figure)) {
                    // to check if a sell is safe I had to create a dummy bishop to a potential cell and ask every enemy figure if they can go
                    // and attack this potential target
                    const potentialTarget = {...target};
                    console.log(current.figure.canMove(potentialTarget, board), current)
                    if (current.figure.canMove(potentialTarget, board)) return false;
                } else {
                    continue;
                }
            }
        }

        return true;
    }

    isEnemy(figure:IFigure):boolean {
        return this.figure?.color !== figure.color;
    }

    isEmptyVertical(target:ICell, board:IBoard):boolean {
      
        if (target.x !== this.x) return false;
        const absY = Math.abs(this.y - target.y);
        const y = target.y > this.y ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!board.cells[this.y + y*i][this.x].isEmpty()) return false;
        }
        return true;
    }
    isEmptyHorizontal(target:ICell, board: IBoard):boolean {
        if (target.y !== this.y) return false;
        const absX = Math.abs(this.x - target.x);
        const x = target.x > this.x ? 1 : -1;

        for (let i = 1; i < absX; i++) {
            if (!board.cells[this.y][this.x + x*i].isEmpty()) return false;
        }
        return true;
       
    }
    isEmptyDiagonal(target:ICell, board: IBoard):boolean {

        const absY = Math.abs(this.y - target.y);
        const absX = Math.abs(this.x - target.x);

        if (absX !== absY) return false //Target is not on diagonal line

        const dy = target.y > this.y ? 1 : -1;
        const dx = target.x > this.x ? 1 : -1;

        for (let i = 1; i < absY; i++) {
            if (!board.cells[this.y + dy*i][this.x + dx*i].isEmpty()) return false;
        }

        return true;
    }


    moveFigure(target: ICell, board: IBoard) {
        if (!this.figure?.canMove(target, board)) return false;
        if (target.figure?.type === FigureTypes.KING) return false;
        this.figure.moveFigure(target);
        target.figure = this.figure;
        this.figure = null;
        this.isAvailable = false;
        return true
    }
}