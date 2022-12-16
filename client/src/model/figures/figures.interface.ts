import { Direction } from "readline";
import { SPRITES } from "../../assets/Packs/Default/sprites";
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

export interface ILegalMoveArg {
    board: IBoard;
    direction?: Direction;
    numCell: number;
}

export interface IFigureBase {
    sprites?: ISpritesObj;
    x: number;
    y: number;  
    movesCount: number;    
    color: Colors;
    legalMoves: ICell[];
    moveFigure: (target: ICell, board: IBoard, isFake?: boolean) => void;
    getLegalMoves: (board: IBoard) => void;
    clearMoves: () => void;
    filterUncheckingMoves: (board: IBoard) => void
    getLegalMovesVertical: (arg: ILegalMoveArg) => void;
    getLegalMovesHorizontal: (arg: ILegalMoveArg) => void;
    getLegalMovesDiagonal: (arg: ILegalMoveArg) => void;
    addLegalMove: (cell: ICell) => boolean;
}

export interface IFigure extends IFigureBase {    
    type: FigureTypes;    
    sprite?: string;    
}


export interface IFigureInfo extends Pick<IFigure, "color" | "type" | "x" | "y" | "sprite"> {}

export interface ILostFigure extends Pick<IFigureInfo, 'type' | 'color' | 'sprite' > {
    takenBy: IFigureInfo;
};

export interface IMovedFigure extends IFigureInfo {   
    isCastling?: boolean;
    figureTaken?: IFigureInfo;
}

export type ISpritesObj = typeof SPRITES;