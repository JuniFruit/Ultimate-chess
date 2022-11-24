import { SPRITES } from "../../assets/sprites";
import { IBoard } from "../Board";
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
    x:number;
    y:number;
    sprite?: string;
    canMove: (target:ICell, board:IBoard, isUpwards?:boolean) => boolean;
    moveFigure: (target: ICell) => void;
}

export type ISpritesObj = typeof SPRITES; 

export class Figure {
    readonly color:Colors;
    sprites?: ISpritesObj;
    x:number;
    y:number;

    constructor(x:number,y:number,color:Colors, sprites?: ISpritesObj) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.sprites = sprites;
    }

    canMove(target: ICell, board:IBoard, isUpwards = true) {
        if (this.color === target.figure?.color) return false;
        if (this.x === target.x && this.y === target.y) return false;
        // if (target.figure?.type === FigureTypes.KING) return false;
        return true;
    }

    moveFigure(target:ICell) {   
        if (target.figure?.type === FigureTypes.KING) return; 
        this.x = target.x;
        this.y = target.y;
    }

}