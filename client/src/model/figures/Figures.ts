import { SPRITES } from "../../assets/sprites";
import { IBoard } from "../Board";
import { ICell } from "../Cell";
import { Colors } from "../colors.enum";

export enum FigureTypes {
    ROOK = 'r',
    BISHOP = 'b',
    PAWN = 'p',
    KING = 'k',
    KNIGHT = 'n',
    QUEEN = 'q',
}

export interface IFigure {
    color: Colors;
    type: FigureTypes;
    x:number;
    y:number;
    sprite?: string;
    legalMoves: ICell[];   
    moveFigure: (target: ICell) => void;
    getLegalMoves: (board:IBoard) => void;
    clearMoves: () =>  void;
    filterUncheckingMoves: (figureCell:ICell, board:IBoard) => void
}

export type ISpritesObj = typeof SPRITES; 

export class Figure {
    readonly color:Colors;
    sprites?: ISpritesObj;
    x:number;
    y:number;
    legalMoves: ICell[] = [];

    constructor(x:number,y:number,color:Colors, sprites?: ISpritesObj) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.sprites = sprites;
    }   

    moveFigure(target:ICell) {   
        if (target.figure?.type === FigureTypes.KING) return; 
        this.x = target.x;
        this.y = target.y;
    }

    filterUncheckingMoves(figureCell:ICell,board:IBoard) {
        if (!board.isCheck) return;
        if (!figureCell.figure) return;
        if (figureCell.figure.color !== board.currentPlayer) return;
        const currentFigure = figureCell.figure;
        currentFigure.legalMoves = currentFigure.legalMoves.filter(move => figureCell.isUncheckingMove(move, board));
    }

    clearMoves() {
        this.legalMoves = [];
    }

}