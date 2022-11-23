import { ICell } from "../Cell";
import { Colors } from "../colors.enum";

export enum FigureTypes {
    ROOK = 'rook',
    BISHOP = 'bishop',
    PAWN = 'pawn',
    KING = 'king',
    KNIGHT = 'knight',
    QUEEN = 'queen',
}

export interface IFigure {
    color: Colors;
    type: FigureTypes;
    cell: ICell
    sprite: string;
    canMove: (target:ICell, isUpwards?:boolean) => boolean;
    moveFigure: (target: ICell) => void;
}

export class Figure {
    readonly color:Colors;
    cell:ICell;

    constructor(color:Colors, cell:ICell) {
        this.color = color;
        this.cell = cell
    }

    canMove(target: ICell, isUpwards = true) {
        if (this.color === target.figure?.color) return false;
        if (this.cell.x === target.x && this.cell.y === target.y) return false;
        // if (target.figure?.type === FigureTypes.KING) return false;
        return true;
    }

    moveFigure(target:ICell) {   
        if (target.figure?.type === FigureTypes.KING) return; 
        target.figure = this.cell.figure;
        this.cell = target;
        this.cell.figure = null;
    }

}