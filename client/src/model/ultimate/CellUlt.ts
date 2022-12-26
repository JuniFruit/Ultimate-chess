import { IMoveOptions } from "../../constants/socketIO/ClientEvents.interface";
import { IBoard } from "../Board";
import { Cell, ICell, ICellInfo } from "../Cell";
import { Colors } from "../colors.enum";
import { FigureTypes, IFigure, IMovedFigure } from "../figures/figures.interface";
import { IKing } from "../figures/King";
import { IRook } from "../figures/Rook";
import { getFigureInfo } from "../helpers";
import { IBoardUlt } from "./BoardUlt";
import { SkillNames } from "./Skills";


export interface ICellUltStates {
    isOnFire: boolean
}

export interface ICellUlt extends ICell {
    states: ICellUltStates;
    canPerformSkill: (skill: SkillNames, board: IBoardUlt) => boolean;
    performSkill: (skill: SkillNames, board: IBoardUlt) => void;
    performSacrifice: (board: IBoardUlt) => void;
}

export class CellUlt extends Cell implements ICellUlt {
    states: ICellUltStates = {
        isOnFire: false
    }


    public canPerformSkill(skill: SkillNames, board: IBoardUlt) {
        switch (skill) {
            case SkillNames.SACRIFICE:
                return this._canSacrifice(board);
            default:
                return false;
        }
    }

    public performSkill(skill: SkillNames, board: IBoardUlt) {
        switch (skill) {
            case SkillNames.SACRIFICE:
                return this.performSacrifice(board);
            default:
                return false;
        }
    }

    public performSacrifice(board: IBoardUlt) {
        board.popFigure(this.figure!);
        this.figure = null;
        this.prevFigure = null;
    }

    private _canSacrifice(board: IBoardUlt) {
        if (this.figure?.type !== FigureTypes.PAWN) return false;
        if (this.figure.color !== board.states.currentPlayer) return false;
        if (board.isSkillUsedByPlayer(SkillNames.SACRIFICE)) return false;
        if (board.figures.filter(figure => figure.type === FigureTypes.PAWN
            && figure.color === board.states.currentPlayer).length > 1) return false;
        return true;
    }

    




}