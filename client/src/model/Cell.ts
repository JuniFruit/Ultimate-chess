import { Colors } from "./colors.enum";
import { IFigure } from "./figures/Figures";

export interface ICell {
    readonly x: number;
    readonly y: number;
    color: Colors;
    figure: IFigure | null;
    isAvailable: boolean;   
    moveFigure: (target:ICell) => void; 
}

interface ICellInit extends Pick<ICell, 'x' | 'y' | 'color' | 'figure'>{};

export class Cell implements ICell {    
    readonly x: number;
    readonly y: number;
    color: Colors;
    figure: IFigure | null;
    isAvailable: boolean;

    constructor({x,y,color, figure}:ICellInit) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.figure = figure
        this.isAvailable = false;
    }

    moveFigure(target: ICell) {
        if (!this.figure?.canMove(target)) return;
        target.figure = this.figure;
        this.figure = null;
    }
}