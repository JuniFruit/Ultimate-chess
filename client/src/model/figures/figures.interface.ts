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

export interface IFigure {
    color: Colors;
    type: FigureTypes;
    x: number;
    y: number;
    sprite?: string;
    legalMoves: ICell[];
    moveFigure: (target: ICell, isFake?: boolean) => void;
    getLegalMoves: (board: IBoard) => void;
    clearMoves: () => void;
    filterUncheckingMoves: (board: IBoard) => void
    getLegalMovesVertical: (arg: ILegalMoveArg) => void;
    getLegalMovesHorizontal: (arg: ILegalMoveArg) => void;
    getLegalMovesDiagonal: (arg: ILegalMoveArg) => void;
    addLegalMove: (cell: ICell) => boolean;
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