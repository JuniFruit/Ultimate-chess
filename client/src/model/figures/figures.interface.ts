import { Direction } from "readline";
import { SPRITES } from "../../assets/Packs/Default/sprites";
import { IMoveOptions } from "../../constants/socketIO/ClientEvents.interface";
import { IBoard } from "../Board";
import { ICell, ICellInfo } from "../Cell";
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
    prevX: number;
    prevY: number;
    pos: string;
    lastTake: IFigureInfo | null;
    takes: IFigureInfo[];
    movesCount: number;    
    color: Colors;
    legalMoves: ILegalMove[];
    moveFigure: (target: ICell, board: IBoard, isFake?: boolean) => void;
    getLegalMoves: (board: IBoard) => void;
    clearMoves: () => void;
    filterUncheckingMoves: (board: IBoard) => void
    getLegalMovesVertical: (arg: ILegalMoveArg) => void;
    getLegalMovesHorizontal: (arg: ILegalMoveArg) => void;
    getLegalMovesDiagonal: (arg: ILegalMoveArg) => void;
    addLegalMove: (cell: ICell) => boolean;
    undo:() => void;
}

export interface IFigure extends IFigureBase {    
    type: FigureTypes;    
    sprite?: string;    
}


export interface IFigureInfo extends Pick<IFigure, "color" | "type" | "x" | "y" | "sprite" | "pos"> {}

export interface ILostFigure extends IFigureInfo {
    takenBy: IFigureInfo;
};

export interface ILegalMove extends Pick<ICell, "x" | "y" | "pos"> {
    figure: IFigureInfo | null;
    prevFigure: IFigureInfo | null;
}


export interface IMoveCoordinates {
    
}

export interface IMovedFigure  {   
    options: IMoveOptions;
    from: ICellInfo;
    to: ICellInfo;
    figureTaken?: IFigureInfo;
    figureMove: IFigureInfo;
}

export type ISpritesObj = typeof SPRITES;