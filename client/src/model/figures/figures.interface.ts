import { SPRITES } from "../../assets/Packs/Default/sprites";
import { IMoveOptions } from "../../constants/socketIO/ClientEvents.interface";
import { IBoard } from "../Board";
import { ICell, ICellInfo } from "../Cell";
import { Colors } from "../colors.enum";
import { IEffectItem } from "../effects/data/effects.data";
import { ISprite } from "../effects/Sprite";
import { IVFX, IVFXConstructor } from "../effects/VFX";
import { Direction } from "../helper.enum";
import { IBoardUlt } from "../ultimate/BoardUlt";
import { ICellUlt } from "../ultimate/CellUlt";
import { ISkillApplied } from "../ultimate/Skills";

export enum FigureTypes {
    ROOK = 'r',
    BISHOP = 'b',
    PAWN = 'p',
    KING = 'k',
    KNIGHT = 'n',
    QUEEN = 'q',
}

export interface ILegalMoveArg {
    board: IBoard | IBoardUlt;
    direction?: Direction;
    numCell: number;
}

export interface IFigureBase {
    readonly sprites?: ISpritesObj;
    spriteSrc?: string;
    sprite?: ISprite;
    ultimateStates: IFigureUltimateStates
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
    moveFigure: (target: ICell | ICellUlt, board: IBoard | IBoardUlt, isFake?: boolean) => void;
    getLegalMoves: (board: IBoard | IBoardUlt) => void;
    clearMoves: () => void;
    filterUncheckingMoves: (board: IBoard | IBoardUlt) => void
    getLegalMovesVertical: (arg: ILegalMoveArg) => void;
    getLegalMovesHorizontal: (arg: ILegalMoveArg) => void;
    getLegalMovesDiagonal: (arg: ILegalMoveArg) => void;
    addLegalMove: (cell: ICell | ICellUlt) => boolean;
    update: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, isFlipped: boolean) => void;
    setSpriteObj: () => void;
    undo: () => void;

    /* ultimate methods */

    applySkill: (skill: ISkillApplied) => void;
    clearExpiredStates: (currentGlobalMoveCount: number) => void;
    filterDisabled: () => void;
    setEffect: (args: IEffectItem) => void;
    clearEffects: () => void;
}

export interface IFigure extends IFigureBase {
    type: FigureTypes;
}

export interface IFigureInfo extends Pick<IFigure, "color" | "type" | "x" | "y" | "spriteSrc" | "pos" | "ultimateStates"> { }

export interface ILostFigure extends IFigureInfo {
    takenBy: IFigureInfo;
};

export interface ILegalMove extends Pick<ICell, "x" | "y" | "pos"> {
    figure: IFigureInfo | null;
    prevFigure: IFigureInfo | null;
}


export interface IMoveCoordinates {

}

export interface IMovedFigure {
    options: IMoveOptions;
    from: ICellInfo;
    to: ICellInfo;
    figureTaken?: IFigureInfo;
    figureMove: IFigureInfo;
}

export type ISpritesObj = typeof SPRITES;


export interface IFigureUltimateStates {
    skillsApplied: ISkillApplied[]
    effects: IVFX[]
}